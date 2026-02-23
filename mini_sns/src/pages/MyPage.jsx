import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function PostGrid({ posts, emptyMsg }) {
  if (!posts.length) return (
    <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--color-text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>📔</div>
      <p style={{ fontSize: 14 }}>{emptyMsg}</p>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
      {posts.map(post => (
        <Link key={post.id} to={`/post/${post.id}`}>
          <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--color-beige)' }}>
            {post.image_url ? (
              <img src={post.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-surface-2)', fontSize: 24,
              }}>
                📝
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function MyPage() {
  const navigate = useNavigate()
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [tab, setTab] = useState('posts') // 'posts' | 'liked'
  const [myPosts, setMyPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ display_name: '', bio: '' })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchData()
    if (profile) setEditForm({ display_name: profile.display_name || '', bio: profile.bio || '' })
  }, [user, profile])

  async function fetchData() {
    setLoading(true)
    const [postsRes, likedRes] = await Promise.all([
      supabase.from('posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('likes').select('post_id, posts(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    setMyPosts(postsRes.data || [])
    setLikedPosts((likedRes.data || []).map(l => l.posts).filter(Boolean))
    setLoading(false)
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: editForm.display_name, bio: editForm.bio })
      .eq('id', user.id)
    if (!error) {
      await refreshProfile()
      setEditing(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const getAvatarLetter = () => (profile?.display_name || profile?.username || '?')[0].toUpperCase()

  if (!user) return null

  return (
    <Layout title="마이페이지">
      {/* 프로필 헤더 */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--color-border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          {/* 아바타 */}
          <div style={{ position: 'relative' }}>
            <div className="avatar avatar-xl" style={{ overflow: 'hidden' }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="avatar-placeholder" style={{ fontSize: 28 }}>{getAvatarLetter()}</div>
              )}
            </div>
          </div>

          {/* 통계 */}
          <div style={{ flex: 1, display: 'flex', gap: 20 }}>
            {[
              { label: '게시물', value: myPosts.length },
              { label: '좋아요', value: likedPosts.length },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 프로필 정보 */}
        {!editing ? (
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--color-text)', marginBottom: 2 }}>
              {profile?.display_name || profile?.username}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: profile?.bio ? 6 : 0 }}>
              @{profile?.username}
            </div>
            {profile?.bio && (
              <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5 }}>{profile.bio}</p>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-outline" onClick={() => setEditing(true)} style={{ flex: 1, fontSize: 13, padding: '8px' }}>
                프로필 편집
              </button>
              <button className="btn btn-ghost" onClick={handleSignOut} style={{ fontSize: 13, padding: '8px 12px', color: 'var(--color-error)' }}>
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="input-group">
              <label className="input-label">닉네임</label>
              <input className="input-field" value={editForm.display_name} onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))} placeholder="닉네임 입력" />
            </div>
            <div className="input-group" style={{ marginBottom: 12 }}>
              <label className="input-label">소개글</label>
              <textarea className="input-field" style={{ minHeight: 80, resize: 'none' }} value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} placeholder="나를 소개해주세요 🌸" maxLength={150} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, fontSize: 13, padding: '8px' }}>저장</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)} style={{ flex: 1, fontSize: 13, padding: '8px' }}>취소</button>
            </div>
          </form>
        )}
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-light)' }}>
        {[
          { key: 'posts', label: '내 게시물', icon: '🗂️' },
          { key: 'liked', label: '좋아요한 게시물', icon: '❤️' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: 13,
              fontWeight: tab === t.key ? 700 : 400,
              color: tab === t.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: tab === t.key ? '2px solid var(--color-primary)' : '2px solid transparent',
              transition: 'all 0.2s',
              background: 'none',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* 게시물 그리드 */}
      {loading ? (
        <div className="loading-full"><div className="loading-spinner" /></div>
      ) : tab === 'posts' ? (
        <PostGrid posts={myPosts} emptyMsg="아직 작성한 게시물이 없어요" />
      ) : (
        <PostGrid posts={likedPosts} emptyMsg="아직 좋아요한 게시물이 없어요" />
      )}
    </Layout>
  )
}
