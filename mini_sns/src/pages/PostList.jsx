import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

export default function PostList() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [likedSet, setLikedSet] = useState(new Set())
  const [commentCounts, setCommentCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10

  useEffect(() => {
    fetchPosts()
    if (user) fetchLiked()
  }, [user, sortBy, page])

  async function fetchPosts() {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('*, profiles(*)')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (sortBy === 'newest') query = query.order('created_at', { ascending: false })
    else if (sortBy === 'popular') query = query.order('likes_count', { ascending: false })

    const { data } = await query
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
    const { data } = await supabase.from('comments').select('post_id').in('post_id', postIds)
    if (data) {
      const counts = {}
      data.forEach(c => { counts[c.post_id] = (counts[c.post_id] || 0) + 1 })
      setCommentCounts(counts)
    }
  }

  const handleSearch = async () => {
    if (!search.trim()) { fetchPosts(); return }
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .ilike('caption', `%${search}%`)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) {
      setPosts(data)
      fetchCommentCounts(data.map(p => p.id))
    }
    setLoading(false)
  }

  return (
    <Layout title="게시물">
      <div style={{ padding: '12px 16px 8px' }}>
        {/* 검색창 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            className="input-field"
            style={{ flex: 1 }}
            placeholder="게시물 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch} style={{ padding: '12px 14px', flexShrink: 0 }}>
            <SearchIcon />
          </button>
        </div>

        {/* 정렬 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          {[['newest', '최신순'], ['popular', '인기순']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setSortBy(val); setPage(0) }}
              className="tag"
              style={{
                background: sortBy === val ? 'var(--color-primary)' : 'var(--color-beige)',
                color: sortBy === val ? 'white' : 'var(--color-primary-dark)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-full"><div className="loading-spinner" /><span>불러오는 중...</span></div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p style={{ fontWeight: 600 }}>{search ? '검색 결과가 없어요' : '아직 게시물이 없어요'}</p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              commentCount={commentCounts[post.id] || 0}
              isLiked={likedSet.has(post.id)}
              onLikeChange={fetchLiked}
            />
          ))}

          {/* 페이지네이션 */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '16px' }}>
            {page > 0 && (
              <button className="btn btn-outline" onClick={() => setPage(p => p - 1)} style={{ fontSize: 13 }}>
                ← 이전
              </button>
            )}
            {posts.length === PAGE_SIZE && (
              <button className="btn btn-outline" onClick={() => setPage(p => p + 1)} style={{ fontSize: 13 }}>
                다음 →
              </button>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
