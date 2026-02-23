import { useState, useCallback } from 'react'

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const QUERIES = ['diary decoration', 'stationery aesthetic', 'washi tape journal', 'bullet journal', 'notebook craft', 'scrapbook']

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  )
}

export default function ImagePicker({ selectedUrl, onSelect }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [searched, setSearched] = useState(false)

  const fetchImages = useCallback(async (searchQuery, pg = 1) => {
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your_unsplash_access_key') {
      // Unsplash API 키 없을 경우 더미 이미지 사용
      const dummies = Array.from({ length: 9 }, (_, i) => ({
        id: `dummy_${pg}_${i}`,
        urls: { small: `https://picsum.photos/seed/${searchQuery}${pg}${i}/300/200`, regular: `https://picsum.photos/seed/${searchQuery}${pg}${i}/800/600` },
        alt_description: `이미지 ${i + 1}`,
        user: { name: 'Photo' },
      }))
      setImages(dummies)
      setSearched(true)
      return
    }

    setLoading(true)
    try {
      const q = searchQuery || QUERIES[Math.floor(Math.random() * QUERIES.length)]
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=9&page=${pg}&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      )
      const data = await res.json()
      setImages(data.results || [])
      setSearched(true)
    } catch (e) {
      console.error('Unsplash API 오류:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = () => {
    const q = query.trim() || 'diary journal'
    setPage(1)
    fetchImages(q, 1)
  }

  const handleRefresh = () => {
    const q = query.trim() || 'diary journal'
    const newPage = page + 1
    setPage(newPage)
    fetchImages(q, newPage)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          className="input-field"
          style={{ flex: 1 }}
          placeholder="이미지 검색 (예: washi tape, sticker)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch} style={{ padding: '12px 16px', flexShrink: 0 }}>
          <SearchIcon />
        </button>
      </div>

      {!searched && (
        <button
          className="btn btn-outline btn-full"
          onClick={() => fetchImages('diary stationery aesthetic')}
          style={{ marginBottom: 12 }}
        >
          📷 랜덤 이미지 불러오기
        </button>
      )}

      {loading && (
        <div className="loading-full" style={{ minHeight: 120 }}>
          <div className="loading-spinner" />
          <span>이미지 불러오는 중...</span>
        </div>
      )}

      {!loading && images.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 12 }}>
            {images.map(img => (
              <button
                key={img.id}
                onClick={() => onSelect(img.urls.regular || img.urls.small)}
                style={{
                  padding: 0,
                  border: selectedUrl === (img.urls.regular || img.urls.small) ? '3px solid var(--color-primary)' : '3px solid transparent',
                  borderRadius: 6,
                  overflow: 'hidden',
                  aspectRatio: '3/2',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <img
                  src={img.urls.small}
                  alt={img.alt_description || ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-full" onClick={handleRefresh} style={{ fontSize: 13 }}>
            <RefreshIcon /> 다른 이미지 보기
          </button>
        </>
      )}

      {selectedUrl && (
        <div style={{ marginTop: 12, padding: 12, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>✓ 선택된 이미지</p>
          <img
            src={selectedUrl}
            alt="선택된 이미지"
            style={{ width: '100%', borderRadius: 'var(--radius-sm)', maxHeight: 150, objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  )
}
