import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ImagePicker from '../components/ImagePicker'
import { supabase } from '../lib/supabase'

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  )
}

function formatDate(dateStr) {
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

function FreePostCard({ post, onDeleted }) {
  const [showDeleteForm, setShowDeleteForm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!post.password && !deletePassword) {
      // 비밀번호 없이 작성된 글은 바로 삭제
      setDeleting(true)
      await supabase.from('free_posts').delete().eq('id', post.id)
      setDeleting(false)
      onDeleted(post.id)
      return
    }
    if (deletePassword !== post.password) {
      alert('비밀번호가 틀렸어요.')
      return
    }
    setDeleting(true)
    await supabase.from('free_posts').delete().eq('id', post.id)
    setDeleting(false)
    onDeleted(post.id)
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-light)',
      marginBottom: 12,
      overflow: 'hidden',
    }}>
      {/* 작성자 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--color-beige)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'var(--color-primary)',
          }}>
            {(post.nickname || '익')[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>{post.nickname || '익명'}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{formatDate(post.created_at)}</div>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteForm(v => !v)}
          style={{ color: 'var(--color-text-muted)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <TrashIcon />
          삭제
        </button>
      </div>

      {/* 이미지 */}
      {post.image_url && (
        <div style={{ width: '100%', maxHeight: 300, overflow: 'hidden' }}>
          <img
            src={post.image_url}
            alt="게시물 이미지"
            style={{ width: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* 내용 */}
      <div style={{ padding: '10px 14px 12px' }}>
        <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {post.caption}
        </p>
      </div>

      {/* 삭제 폼 */}
      {showDeleteForm && (
        <div style={{
          borderTop: '1px solid var(--color-border-light)',
          padding: '12px 14px',
          background: 'var(--color-surface-2)',
        }}>
          {post.password ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="password"
                className="input-field"
                style={{ flex: 1, fontSize: 13 }}
                placeholder="작성 시 입력한 비밀번호"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDelete()}
              />
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: '#e74c3c', color: 'white', borderRadius: 'var(--radius-md)',
                  padding: '0 14px', fontSize: 13, fontWeight: 600,
                }}
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>비밀번호 없이 작성된 글입니다. 삭제할까요?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: '#e74c3c', color: 'white', borderRadius: 'var(--radius-md)',
                  padding: '6px 14px', fontSize: 13, fontWeight: 600, flexShrink: 0,
                }}
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function FreeBoard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)

  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('free_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
    setLoading(false)
  }

  async function handleSubmit() {
    if (!caption.trim()) {
      alert('내용을 입력해주세요.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('free_posts').insert({
      nickname: nickname.trim() || '익명',
      password: password || null,
      caption: caption.trim(),
      image_url: imageUrl || null,
    })
    if (!error) {
      setNickname('')
      setPassword('')
      setCaption('')
      setImageUrl('')
      setShowImagePicker(false)
      setFormOpen(false)
      await loadPosts()
    } else {
      alert('등록에 실패했어요. 다시 시도해주세요.')
    }
    setSubmitting(false)
  }

  function handleDeleted(id) {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <Layout title="자유 게시판">
      <div style={{ padding: '16px 16px 8px' }}>

        {/* 안내 배너 */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-beige) 0%, #fff8f0 100%)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
            💬 자유 게시판
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            로그인 없이 누구나 자유롭게 글을 남길 수 있어요.<br />
            닉네임과 비밀번호(선택)만 입력하면 바로 게시됩니다!
          </p>
        </div>

        {/* 글쓰기 토글 버튼 */}
        <button
          onClick={() => setFormOpen(v => !v)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            background: formOpen ? 'var(--color-primary)' : 'white',
            color: formOpen ? 'white' : 'var(--color-primary)',
            border: `2px solid var(--color-primary)`,
            borderRadius: 'var(--radius-lg)',
            fontWeight: 700, fontSize: 14,
            transition: 'all 0.2s',
            marginBottom: formOpen ? 0 : 16,
            borderBottomLeftRadius: formOpen ? 0 : undefined,
            borderBottomRightRadius: formOpen ? 0 : undefined,
            borderBottom: formOpen ? 'none' : undefined,
          }}
        >
          <span>✏️ 글 작성하기</span>
          {formOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>

        {/* 작성 폼 (아코디언) */}
        {formOpen && (
          <div className="fade-in" style={{
            border: '2px solid var(--color-primary)',
            borderTop: 'none',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            padding: 16,
            marginBottom: 16,
            background: 'white',
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>닉네임</label>
                <input
                  className="input-field"
                  style={{ fontSize: 14 }}
                  placeholder="익명"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  maxLength={20}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>비밀번호 (선택)</label>
                <input
                  type="password"
                  className="input-field"
                  style={{ fontSize: 14 }}
                  placeholder="삭제 시 필요"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  maxLength={50}
                />
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>내용 <span style={{ color: '#e74c3c' }}>*</span></label>
              <textarea
                className="input-field"
                style={{ minHeight: 120, resize: 'vertical', lineHeight: 1.7, fontSize: 14 }}
                placeholder="자유롭게 작성해보세요 ✨"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                maxLength={1000}
              />
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {caption.length}/1000
              </div>
            </div>

            {/* 이미지 선택 토글 */}
            <button
              className="btn btn-outline btn-full"
              onClick={() => setShowImagePicker(v => !v)}
              style={{ marginBottom: showImagePicker ? 10 : 12, fontSize: 13 }}
            >
              {imageUrl ? '🖼️ 이미지 변경' : '🖼️ 이미지 선택 (선택)'}
            </button>

            {showImagePicker && (
              <div style={{ marginBottom: 12 }}>
                <ImagePicker
                  selectedUrl={imageUrl}
                  onSelect={(url) => { setImageUrl(url); setShowImagePicker(false) }}
                />
                {imageUrl && (
                  <button
                    onClick={() => setImageUrl('')}
                    style={{ fontSize: 12, color: '#e74c3c', marginTop: 8, padding: '4px 0' }}
                  >
                    × 이미지 제거
                  </button>
                )}
              </div>
            )}

            {imageUrl && !showImagePicker && (
              <div style={{ marginBottom: 12, position: 'relative' }}>
                <img src={imageUrl} alt="선택된 이미지" style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: 160, objectFit: 'cover' }} />
                <button
                  onClick={() => setImageUrl('')}
                  style={{
                    position: 'absolute', top: 6, right: 6,
                    background: 'rgba(0,0,0,0.5)', color: 'white',
                    borderRadius: '50%', width: 24, height: 24,
                    fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
              </div>
            )}

            <button
              className="btn btn-primary btn-full"
              onClick={handleSubmit}
              disabled={submitting || !caption.trim()}
            >
              {submitting ? '등록 중...' : '✨ 게시하기'}
            </button>
          </div>
        )}

        {/* 게시물 목록 */}
        {loading ? (
          <div className="loading-full" style={{ minHeight: 200 }}>
            <div className="loading-spinner" />
            <span>불러오는 중...</span>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>아직 게시물이 없어요</p>
            <p style={{ fontSize: 13 }}>첫 번째 글을 남겨보세요!</p>
          </div>
        ) : (
          posts.map(post => (
            <FreePostCard key={post.id} post={post} onDeleted={handleDeleted} />
          ))
        )}
      </div>
    </Layout>
  )
}
