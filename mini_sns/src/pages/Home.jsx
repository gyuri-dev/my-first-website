import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const categories = [
  { icon: '🌸', label: '입문자', query: '입문' },
  { icon: '🎀', label: '마스킹테이프', query: '마스킹' },
  { icon: '✂️', label: '꾸미기', query: '꾸미기' },
  { icon: '📌', label: '스티커', query: '스티커' },
  { icon: '🖊️', label: '캘리그라피', query: '캘리' },
  { icon: '🗓️', label: '위클리', query: '위클리' },
]

const banners = [
  {
    title: '🌸 이번 달 모임 공지',
    desc: '3월 다이어리 꾸미기 챌린지 참여하기',
    color: '#F5E6D3',
    textColor: '#5C3D2E',
  },
  {
    title: '✨ 신규 회원 환영',
    desc: '입문자를 위한 기초 꾸미기 가이드',
    color: '#E8D5B7',
    textColor: '#5C3D2E',
  },
  {
    title: '📔 이달의 다이어리',
    desc: '멤버들이 뽑은 베스트 다이어리 공개',
    color: '#D4B896',
    textColor: '#3D2B1F',
  },
]

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [likedSet, setLikedSet] = useState(new Set())
  const [commentCounts, setCommentCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeBanner, setActiveBanner] = useState(0)
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    fetchPosts()
    if (user) fetchLiked()
  }, [user])

  useEffect(() => {
    const timer = setInterval(() => setActiveBanner(b => (b + 1) % banners.length), 4000)
    return () => clearInterval(timer)
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) {
      setPosts(data)
      fetchCommentCounts(data.map(p => p.id))
    }
    setLoading(false)
  }

  async function fetchLiked() {
    const { data } = await supabase.from('likes').select('post_id').eq('user_id', user.id)
    if (data) setLikedSet(new Set(data.map(l => l.post_id)))
  }

  async function fetchCommentCounts(postIds) {
    if (!postIds.length) return
    const { data } = await supabase
      .from('comments')
      .select('post_id')
      .in('post_id', postIds)
    if (data) {
      const counts = {}
      data.forEach(c => { counts[c.post_id] = (counts[c.post_id] || 0) + 1 })
      setCommentCounts(counts)
    }
  }

  return (
    <Layout>
      {/* 배너 */}
      <div style={{ padding: '12px 16px 0', position: 'relative' }}>
        <div style={{
          borderRadius: 'var(--radius-lg)',
          background: banners[activeBanner].color,
          padding: '20px 20px',
          minHeight: 100,
          transition: 'background 0.5s',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', right: 16, top: 10, fontSize: 40, opacity: 0.3 }}>📔</div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: banners[activeBanner].textColor, marginBottom: 6 }}>
            {banners[activeBanner].title}
          </h2>
          <p style={{ fontSize: 13, color: banners[activeBanner].textColor, opacity: 0.8 }}>
            {banners[activeBanner].desc}
          </p>
          <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                style={{
                  width: i === activeBanner ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: banners[activeBanner].textColor,
                  opacity: i === activeBanner ? 0.8 : 0.3,
                  transition: 'all 0.3s',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 카테고리 */}
      <div style={{ padding: '16px 16px 8px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>
          취향별 꾸미기 🎨
        </h3>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 14px',
                borderRadius: 'var(--radius-lg)',
                background: activeCategory === cat.label ? 'var(--color-primary)' : 'var(--color-surface-2)',
                color: activeCategory === cat.label ? 'white' : 'var(--color-text)',
                flexShrink: 0,
                transition: 'all 0.2s',
                border: 'none',
                minWidth: 64,
              }}
            >
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 최신 게시물 */}
      <div style={{ padding: '12px 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 12px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>최신 게시물 📸</h3>
          <Link to="/posts" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>전체 보기 →</Link>
        </div>

        {loading ? (
          <div className="loading-full">
            <div className="loading-spinner" />
            <span>불러오는 중...</span>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📔</div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>아직 게시물이 없어요</p>
            <p style={{ fontSize: 13 }}>첫 번째 다이어리를 공유해보세요!</p>
            {!user && (
              <Link to="/login">
                <button className="btn btn-primary" style={{ marginTop: 16 }}>시작하기</button>
              </Link>
            )}
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              commentCount={commentCounts[post.id] || 0}
              isLiked={likedSet.has(post.id)}
              onLikeChange={fetchLiked}
            />
          ))
        )}
      </div>
    </Layout>
  )
}
