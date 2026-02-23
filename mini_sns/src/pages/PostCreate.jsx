import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ImagePicker from '../components/ImagePicker'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function PostCreate() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [step, setStep] = useState(1) // 1: 글 작성, 2: 이미지 선택
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadDraft()
  }, [user])

  async function loadDraft() {
    const { data } = await supabase
      .from('drafts')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
    if (data) setDraft(data)
  }

  async function handleSaveDraft() {
    setSaving(true)
    if (draft) {
      await supabase.from('drafts').update({ caption, image_url: imageUrl, updated_at: new Date().toISOString() }).eq('id', draft.id)
    } else {
      const { data } = await supabase.from('drafts').insert({ user_id: user.id, caption, image_url: imageUrl }).select().single()
      if (data) setDraft(data)
    }
    setSaving(false)
    alert('임시저장 완료! ✨')
  }

  async function handleLoadDraft() {
    if (!draft) return
    setCaption(draft.caption || '')
    setImageUrl(draft.image_url || '')
    alert('임시저장된 내용을 불러왔어요!')
  }

  async function handleSubmit() {
    if (!caption.trim() && !imageUrl) {
      alert('내용이나 이미지를 입력해주세요.')
      return
    }
    setSubmitting(true)
    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: user.id, caption: caption.trim(), image_url: imageUrl })
      .select()
      .single()

    if (!error && data) {
      // 임시저장 삭제
      if (draft) await supabase.from('drafts').delete().eq('id', draft.id)
      navigate(`/post/${data.id}`)
    } else {
      alert('게시물 등록에 실패했어요. 다시 시도해주세요.')
    }
    setSubmitting(false)
  }

  if (!user) return null

  return (
    <Layout
      showBack
      onBack={() => navigate(-1)}
      title="게시물 작성"
      rightAction={
        <button
          onClick={handleSaveDraft}
          disabled={saving}
          style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, padding: '4px 8px' }}
        >
          {saving ? '저장 중...' : '임시저장'}
        </button>
      }
    >
      <div style={{ padding: '16px' }}>

        {/* 임시저장 불러오기 */}
        {draft && (
          <div style={{
            padding: '12px 14px',
            background: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>📝 임시저장된 내용이 있어요</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {new Date(draft.updated_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <button className="btn btn-outline" onClick={handleLoadDraft} style={{ fontSize: 13, padding: '8px 12px' }}>
              불러오기
            </button>
          </div>
        )}

        {/* 단계 탭 */}
        <div style={{
          display: 'flex',
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-full)',
          padding: 4,
          marginBottom: 20,
        }}>
          {[1, 2].map(s => (
            <button
              key={s}
              onClick={() => setStep(s)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 600,
                background: step === s ? 'white' : 'transparent',
                color: step === s ? 'var(--color-primary)' : 'var(--color-text-muted)',
                boxShadow: step === s ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {s === 1 ? '📝 1단계: 글 작성' : '🖼️ 2단계: 이미지 선택'}
            </button>
          ))}
        </div>

        {step === 1 && (
          <div className="fade-in">
            <div className="input-group">
              <label className="input-label">내용 입력</label>
              <textarea
                className="input-field"
                style={{ minHeight: 180, resize: 'vertical', lineHeight: 1.7 }}
                placeholder="오늘의 다이어리 꾸미기를 공유해보세요 ✨&#10;&#10;사용한 재료, 꾸미기 팁, 느낀 점 등을 자유롭게 작성해주세요!"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                maxLength={1000}
              />
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
                {caption.length}/1000
              </div>
            </div>

            {imageUrl && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>✓ 이미지 선택됨</p>
                <img src={imageUrl} alt="선택된 이미지" style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: 160, objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-outline"
                onClick={() => setStep(2)}
                style={{ flex: 1 }}
              >
                {imageUrl ? '🖼️ 이미지 변경' : '🖼️ 이미지 선택'}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || (!caption.trim() && !imageUrl)}
                style={{ flex: 1 }}
              >
                {submitting ? '등록 중...' : '✨ 등록하기'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              아래에서 이미지를 검색하거나 랜덤으로 불러와서 마음에 드는 사진을 선택해보세요 📸
            </p>
            <ImagePicker selectedUrl={imageUrl} onSelect={(url) => { setImageUrl(url); setStep(1) }} />
          </div>
        )}
      </div>
    </Layout>
  )
}
