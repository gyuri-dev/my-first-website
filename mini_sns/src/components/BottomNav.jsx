import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

const ListIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>
)

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function BottomNav() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  const navItems = [
    { to: '/', icon: <HomeIcon />, label: '홈' },
    { to: '/posts', icon: <ListIcon />, label: '게시물' },
    { to: '/create', icon: null, label: '작성' },
    { to: user ? '/mypage' : '/login', icon: <UserIcon />, label: '마이' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 'var(--max-width)',
      height: 'var(--nav-height)',
      background: 'white',
      borderTop: '1px solid var(--color-border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 100,
      boxShadow: '0 -4px 16px rgba(92,61,46,0.08)',
    }}>
      {navItems.map((item) => {
        if (item.label === '작성') {
          return (
            <Link key="create" to="/create" style={{ textDecoration: 'none' }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(139,111,71,0.4)',
                transition: 'all 0.2s',
              }}>
                <PlusIcon />
              </div>
            </Link>
          )
        }

        const isActive = pathname === item.to || (item.to === '/posts' && pathname.startsWith('/post'))

        return (
          <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'color 0.2s',
              padding: '4px 12px',
            }}>
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
