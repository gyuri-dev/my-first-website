import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error: err } = await signIn(form.email, form.password)
      if (err) setError(err.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : err.message)
      else navigate('/')
    } else {
      if (!form.username.trim()) { setError('사용자명을 입력해주세요.'); setLoading(false); return }
      if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); setLoading(false); return }
      const { error: err } = await signUp(form.email, form.password, form.username, form.displayName || form.username)
      if (err) setError(err.message)
      else {
        setError('')
        alert('가입 완료! 이메일을 확인해 인증 링크를 클릭해주세요.')
        setMode('login')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 24,
    }}>
      {/* 로고 */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>📔</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary-dark)', lineHeight: 1.3 }}>
          다이어리를 하나만 사자
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 8 }}>
          다이어리 꾸미기 모임에 오신 걸 환영해요 ✨
        </p>
      </div>

      {/* 카드 */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: 28,
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* 탭 */}
        <div style={{
          display: 'flex',
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-full)',
          padding: 4,
          marginBottom: 24,
        }}>
          {['login', 'signup'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 'var(--radius-full)',
                fontSize: 14,
                fontWeight: 600,
                background: mode === m ? 'white' : 'transparent',
                color: mode === m ? 'var(--color-primary)' : 'var(--color-text-muted)',
                boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="input-group">
                <label className="input-label">사용자명 (@아이디)</label>
                <input className="input-field" name="username" placeholder="diary_lover" value={form.username} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">닉네임</label>
                <input className="input-field" name="displayName" placeholder="귤귤이" value={form.displayName} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">이메일</label>
            <input className="input-field" type="email" name="email" placeholder="hello@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group" style={{ marginBottom: 20 }}>
            <label className="input-label">비밀번호</label>
            <input className="input-field" type="password" name="password" placeholder={mode === 'signup' ? '6자 이상' : '비밀번호 입력'} value={form.password} onChange={handleChange} required />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#FFF0EE',
              border: '1px solid #FFCCC7',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ fontSize: 15 }}
          >
            {loading ? <><span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> 처리 중...</> : (mode === 'login' ? '로그인' : '가입하기')}
          </button>
        </form>
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: 'var(--color-text-muted)' }}>
        로그인 없이도 게시물을 구경할 수 있어요 🌸
      </p>
      <Link to="/" style={{ marginTop: 8, fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
        홈으로 →
      </Link>
    </div>
  )
}
