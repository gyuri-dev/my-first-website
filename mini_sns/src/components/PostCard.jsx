import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function HeartIcon({ filled }) {
  return filled ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-like)">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

export default function PostCard({ post, commentCount = 0, isLiked = false, onLikeChange }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [loading, setLoading] = useState(false)

  const profile = post.profiles

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return '방금 전'
    if (mins < 60) return `${mins}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  }

  const handleLike = async (e) => {
    e.preventDefault()
    if (!user || loading) return
    setLoading(true)
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      setLiked(false)
      setLikesCount(c => Math.max(0, c - 1))
    } else {
      await supabase.from('likes').insert({ post_id: post.id, user_id: user.id })
      setLiked(true)
      setLikesCount(c => c + 1)
    }
    setLoading(false)
    if (onLikeChange) onLikeChange()
  }

  const getAvatarLetter = () => {
    return (profile?.display_name || profile?.username || '?')[0].toUpperCase()
  }

  return (
    <div className="card fade-in" style={{ marginBottom: 12, border: 'none', borderBottom: '1px solid var(--color-border-light)', borderRadius: 0 }}>
      {/* 작성자 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 8px' }}>
        <div className="avatar avatar-md" style={{ overflow: 'hidden' }}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar-placeholder" style={{ fontSize: 16 }}>{getAvatarLetter()}</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>
            {profile?.display_name || profile?.username || '익명'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            @{profile?.username} · {formatDate(post.created_at)}
          </div>
        </div>
      </div>

      {/* 이미지 */}
      {post.image_url && (
        <Link to={`/post/${post.id}`}>
          <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-beige)' }}>
            <img
              src={post.image_url}
              alt="게시물 이미지"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'}
            />
          </div>
        </Link>
      )}

      {/* 캡션 */}
      {post.caption && (
        <Link to={`/post/${post.id}`} style={{ display: 'block', padding: '10px 16px 4px' }}>
          <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6 }}>
            {post.caption.length > 100 ? post.caption.slice(0, 100) + '...' : post.caption}
          </p>
        </Link>
      )}

      {/* 액션 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 16px 12px' }}>
        <button onClick={handleLike} disabled={!user} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: liked ? 'var(--color-like)' : 'var(--color-text-muted)',
          fontSize: 13, fontWeight: 600,
          padding: '4px 0',
          transition: 'all 0.2s',
          transform: loading ? 'scale(0.9)' : 'scale(1)',
        }}>
          <HeartIcon filled={liked} />
          <span>{likesCount}</span>
        </button>

        <Link to={`/post/${post.id}`} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 600,
          padding: '4px 0',
        }}>
          <CommentIcon />
          <span>{commentCount}</span>
        </Link>
      </div>
    </div>
  )
}
