import BottomNav from './BottomNav'

export default function Layout({ children, title, showBack, onBack, rightAction }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* 헤더 */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 'var(--header-height)',
        background: 'white',
        borderBottom: '1px solid var(--color-border-light)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
      }}>
        {showBack && (
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text)',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
        )}

        {!showBack && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📔</span>
          </div>
        )}

        <h1 style={{
          flex: 1,
          fontSize: showBack ? 16 : 17,
          fontWeight: 700,
          color: 'var(--color-primary-dark)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {title || '다이어리를 하나만 사자'}
        </h1>

        {rightAction && <div style={{ flexShrink: 0 }}>{rightAction}</div>}
      </header>

      {/* 콘텐츠 */}
      <main style={{
        flex: 1,
        paddingBottom: 'calc(var(--nav-height) + 16px)',
        overflowY: 'auto',
      }}>
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
