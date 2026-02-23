import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function HeartIcon({ filled }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--color-like)">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPost()
    fetchComments()
    if (user) checkLiked()
  }, [id, user])

  async function fetchPost() {
    const { data } = await supabase.from('posts').select('*, profiles(*)').eq('id', id).single()
    setPost(data)
    setLoading(false)
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }

  async function checkLiked() {
    const { data } = await supabase.from('likes').select('id').eq('post_id', id).eq('user_id', user.id).single()
    setLiked(!!data)
  }

  async function handleLike() {
    if (!user) { navigate('/login'); return }
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id)
      setLiked(false)
      setPost(p => ({ ...p, likes_count: Math.max(0, p.likes_count - 1) }))
    } else {
      await supabase.from('likes').insert({ post_id: id, user_id: user.id })
      setLiked(true)
      setPost(p => ({ ...p, likes_count: p.likes_count + 1 }))
    }
  }

  async function handleComment(e) {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!commentText.trim()) return
    setSubmitting(true)
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: id, user_id: user.id, content: commentText.trim() })
      .select('*, profiles(*)')
      .single()
    if (!error && data) {
      setComments(c => [...c, data])
      setCommentText('')
    }
    setSubmitting(false)
  }

  async function handleDeletePost() {
    if (!confirm('게시물을 삭제할까요?')) return
    await supabase.from('posts').delete().eq('id', id)
    navigate('/posts')
  }

  async function handleDeleteComment(commentId) {
    await supabase.from('comments').delete().eq('id', commentId)
    setComments(c => c.filter(x => x.id !== commentId))
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getAvatarLetter = (profile) => (profile?.display_name || profile?.username || '?')[0].toUpperCase()

  if (loading) return (
    <Layout showBack onBack={() => navigate(-1)}>
      <div className="loading-full"><div className="loading-spinner" /></div>
    </Layout>
  )

  if (!post) return (
    <Layout showBack onBack={() => navigate(-1)} title="게시물 없음">
      <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: 48 }}>😔</div>
        <p style={{ marginTop: 12 }}>게시물을 찾을 수 없어요</p>
      </div>
    </Layout>
  )

  const isOwner = user && post.user_id === user.id

  return (
    <Layout
      showBack
      onBack={() => navigate(-1)}
      title={post.profiles?.display_name || post.profiles?.username || '게시물'}
      rightAction={isOwner && (
        <button
          onClick={handleDeletePost}
          style={{ fontSize: 13, color: 'var(--color-error)', fontWeight: 600, padding: '4px 8px' }}
        >
          삭제
        </button>
      )}
    >
      {/* 작성자 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 12px' }}>
        <div className="avatar avatar-md" style={{ overflow: 'hidden' }}>
          {post.profiles?.avatar_url ? (
            <img src={post.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar-placeholder" style={{ fontSize: 16 }}>{getAvatarLetter(post.profiles)}</div>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{post.profiles?.display_name}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>@{post.profiles?.username} · {formatDate(post.created_at)}</div>
        </div>
      </div>

      {/* 이미지 */}
      {post.image_url && (
        <div style={{ width: '100%', background: 'var(--color-beige)', marginBottom: 0 }}>
          <img src={post.image_url} alt="게시물 이미지" style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
        </div>
      )}

      {/* 좋아요 & 공유 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px' }}>
        <button onClick={handleLike} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: liked ? 'var(--color-like)' : 'var(--color-text-secondary)',
          fontWeight: 700, fontSize: 15,
          padding: '6px 0',
          transition: 'all 0.2s',
        }}>
          <HeartIcon filled={liked} />
          <span>{post.likes_count}</span>
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: '다이어리를 하나만 사자', text: post.caption, url: window.location.href })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('링크가 복사되었습니다!')
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 14, padding: '6px 0' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          공유
        </button>
      </div>

      {/* 캡션 */}
      {post.caption && (
        <div style={{ padding: '4px 16px 16px' }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text)' }}>{post.caption}</p>
        </div>
      )}

      <div className="divider" />

      {/* 댓글 목록 */}
      <div style={{ padding: '16px 16px 8px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          댓글 {comments.length}개
        </h3>

        {comments.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>
            첫 번째 댓글을 남겨보세요 💬
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div className="avatar avatar-sm" style={{ overflow: 'hidden', flexShrink: 0 }}>
                {comment.profiles?.avatar_url ? (
                  <img src={comment.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="avatar-placeholder" style={{ fontSize: 12 }}>{getAvatarLetter(comment.profiles)}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{comment.profiles?.display_name || comment.profiles?.username}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {new Date(comment.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {user && comment.user_id === user.id && (
                    <button onClick={() => handleDeleteComment(comment.id)} style={{ fontSize: 11, color: 'var(--color-error)', marginLeft: 'auto' }}>삭제</button>
                  )}
                </div>
                <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5 }}>{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 댓글 입력 */}
      <div style={{
        position: 'sticky',
        bottom: 'var(--nav-height)',
        background: 'white',
        borderTop: '1px solid var(--color-border-light)',
        padding: '12px 16px',
      }}>
        {user ? (
          <form onSubmit={handleComment} style={{ display: 'flex', gap: 8 }}>
            <input
              className="input-field"
              style={{ flex: 1, padding: '10px 14px' }}
              placeholder="댓글 입력..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !commentText.trim()}
              style={{ padding: '10px 16px', flexShrink: 0 }}
            >
              {submitting ? '...' : '등록'}
            </button>
          </form>
        ) : (
          <Link to="/login" style={{ display: 'block' }}>
            <button className="btn btn-outline btn-full">
              로그인하고 댓글 달기 💬
            </button>
          </Link>
        )}
      </div>
    </Layout>
  )
}
