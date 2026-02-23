-- =============================================
-- mini_sns 다이어리를 하나만 사자
-- Supabase SQL 스키마 설정
-- =============================================

-- 1. 프로필 테이블 (Supabase Auth users와 연동)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. 게시물 테이블
CREATE TABLE IF NOT EXISTS public.posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  caption TEXT,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. 댓글 테이블
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. 좋아요 테이블 (중복 방지)
CREATE TABLE IF NOT EXISTS public.likes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(post_id, user_id)
);

-- 5. 임시저장 테이블
CREATE TABLE IF NOT EXISTS public.drafts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  caption TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================
-- RLS (Row Level Security) 정책 설정
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- profiles 정책
CREATE POLICY "프로필 전체 공개" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "본인 프로필 생성" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "본인 프로필 수정" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- posts 정책
CREATE POLICY "게시물 전체 공개" ON public.posts FOR SELECT USING (true);
CREATE POLICY "로그인 사용자 게시물 작성" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 게시물 수정" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "본인 게시물 삭제" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- comments 정책
CREATE POLICY "댓글 전체 공개" ON public.comments FOR SELECT USING (true);
CREATE POLICY "로그인 사용자 댓글 작성" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 댓글 삭제" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- likes 정책
CREATE POLICY "좋아요 전체 공개" ON public.likes FOR SELECT USING (true);
CREATE POLICY "로그인 사용자 좋아요" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 좋아요 취소" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- drafts 정책
CREATE POLICY "본인 임시저장만 조회" ON public.drafts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "본인 임시저장 생성" ON public.drafts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인 임시저장 수정" ON public.drafts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "본인 임시저장 삭제" ON public.drafts FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 함수 및 트리거 설정
-- =============================================

-- 회원가입 시 자동으로 profiles 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 좋아요 수 자동 업데이트
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();

-- Storage 버킷 생성 (avatars용)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "아바타 이미지 전체 공개" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "로그인 사용자 아바타 업로드" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "본인 아바타 수정" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "본인 아바타 삭제" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
