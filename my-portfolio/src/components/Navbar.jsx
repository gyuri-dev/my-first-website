import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar        from '@mui/material/AppBar';
import Toolbar       from '@mui/material/Toolbar';
import Typography    from '@mui/material/Typography';
import Button        from '@mui/material/Button';
import Box           from '@mui/material/Box';
import IconButton    from '@mui/material/IconButton';
import Drawer        from '@mui/material/Drawer';
import List          from '@mui/material/List';
import ListItem      from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText  from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme }  from '@mui/material/styles';
import { colors }    from '../theme';
import ThemeToggle   from './ThemeToggle';

// ─── 네비게이션 항목 ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Home',     path: '/',         num: '01' },
  { label: 'About Me', path: '/about',    num: '02' },
  { label: 'Projects', path: '/projects', num: '03' },
];

// 소셜 링크 (Drawer 하단)
const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href:  'https://github.com/',
    path:  'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 6.8c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z',
  },
  {
    label: 'LinkedIn',
    href:  'https://linkedin.com/in/',
    path:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
];

// ─── 애니메이션 햄버거 아이콘 ─────────────────────────────────────────────────
// open=false → 3줄 / open=true → X
function HamburgerIcon({ open }) {
  const base = {
    position: 'absolute',
    left:     0,
    width:    '100%',
    height:   '1.5px',
    bgcolor:  colors.textPrimary,
    transformOrigin: 'center',
    transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
  };
  return (
    <Box sx={{ width: 22, height: 15, position: 'relative', flexShrink: 0 }}>
      {/* 상단 선 */}
      <Box sx={{ ...base, top: 0, transform: open ? 'translateY(7.5px) rotate(45deg)' : 'none' }} />
      {/* 중간 선 */}
      <Box sx={{ ...base, top: '50%', transform: 'translateY(-50%)', opacity: open ? 0 : 1 }} />
      {/* 하단 선 */}
      <Box sx={{ ...base, bottom: 0, transform: open ? 'translateY(-7.5px) rotate(-45deg)' : 'none' }} />
    </Box>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [navVisible,   setNavVisible]   = useState(true);   // 헤더 표시 여부
  const [scrolled,     setScrolled]     = useState(false);  // 스크롤 시작 여부
  const [readProgress, setReadProgress] = useState(0);      // 읽기 진행률 0-100

  const prevScrollY = useRef(0);  // 이전 스크롤 위치
  const ticking     = useRef(false); // RAF 중복 방지

  // ── 스크롤 이벤트 ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      // requestAnimationFrame으로 성능 최적화
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y    = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;

        // 읽기 진행률 계산
        setReadProgress(docH > 0 ? Math.min(100, (y / docH) * 100) : 0);

        // 스크롤 여부 (배경 블러 강도 조절)
        setScrolled(y > 20);

        // 방향 감지: 최상단 → 항상 표시
        if (y < 10) {
          setNavVisible(true);
        } else if (y > prevScrollY.current + 8) {
          // 아래로 8px 이상 → 숨김
          setNavVisible(false);
          setDrawerOpen(false); // 스크롤 다운 시 열린 Drawer도 닫기
        } else if (y < prevScrollY.current - 4) {
          // 위로 4px 이상 → 표시
          setNavVisible(true);
        }

        prevScrollY.current = y;
        ticking.current     = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Drawer 열릴 때 body 스크롤 잠금 ─────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // ── 유틸리티 ─────────────────────────────────────────────────────────────────
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor:       scrolled ? 'var(--c-navbar-scrolled)' : 'var(--c-navbar)',
          backdropFilter:'blur(12px)',
          borderBottom:  `1px solid ${scrolled ? colors.border : 'transparent'}`,
          // CSS transform으로 hide/show (레이아웃 리플로우 없음)
          transform:     navVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition:    [
            'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
            'background-color 0.25s ease',
            'border-color 0.25s ease',
          ].join(', '),
        }}
      >
        {/* ── 읽기 진행률 바 ── */}
        <Box
          aria-hidden="true"
          role="progressbar"
          aria-valuenow={Math.round(readProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          sx={{
            position:   'absolute',
            top:        0,
            left:       0,
            height:     '2px',
            width:      `${readProgress}%`,
            bgcolor:    colors.primary,
            transition: 'width 0.08s linear',
            zIndex:     10,
            // 진행 중에만 표시
            opacity:    readProgress > 0 && readProgress < 100 ? 1 : 0,
          }}
        />

        <Toolbar
          sx={{
            maxWidth: 1200,
            mx:       'auto',
            width:    '100%',
            px:       { xs: 2.5, md: 6, lg: 10 },
          }}
        >
          {/* ── 로고 ── */}
          <Box
            component="button"
            onClick={() => handleNav('/')}
            aria-label="홈으로 이동"
            data-magnetic
            sx={{
              flexGrow:   1,
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              p:          0,
              textAlign:  'left',
            }}
          >
            <Typography
              sx={{
                fontFamily:   '"Playfair Display", serif',
                fontWeight:   700,
                fontSize:     18,
                color:        colors.textPrimary,
                letterSpacing: 0.5,
                lineHeight:   1,
              }}
            >
              Portfolio
            </Typography>
          </Box>

          {/* ── 데스크탑 메뉴 ── */}
          {!isMobile && (
            <Box component="nav" aria-label="주요 네비게이션" sx={{ display: 'flex', gap: 0.5 }}>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    aria-current={active ? 'page' : undefined}
                    data-magnetic
                    sx={{
                      fontFamily:   '"Inter", sans-serif',
                      fontSize:     13,
                      fontWeight:   active ? 600 : 500,
                      letterSpacing: 1,
                      color:        active ? colors.textPrimary : colors.textMuted,
                      borderBottom: `1px solid ${active ? colors.primary : 'transparent'}`,
                      borderRadius: 0,
                      px:           2,
                      py:           0.5,
                      position:     'relative',
                      // 호버 시 골드 언더라인 미리 보기
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom:   0,
                        left:     '50%',
                        width:    active ? '0%' : '0%',
                        height:   '1px',
                        bgcolor:  colors.primary,
                        transform: 'translateX(-50%)',
                        transition: 'width 0.2s ease',
                      },
                      '&:hover': {
                        color:  colors.textPrimary,
                        bgcolor: 'transparent',
                        '&::after': { width: active ? '0%' : '60%' },
                      },
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <ThemeToggle />
            </Box>
          )}

          {/* ── 모바일 햄버거 버튼 ── */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ThemeToggle />
            <IconButton
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              sx={{
                p:           1.2,
                borderRadius: 0,
                color:        colors.textPrimary,
                '&:hover':   { bgcolor: 'transparent' },
              }}
            >
              <HamburgerIcon open={drawerOpen} />
            </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* ── 모바일 Drawer ── */}
      <Drawer
        id="mobile-nav-drawer"
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width:       270,
            bgcolor:     colors.bgPrimary,
            borderLeft:  `1px solid ${colors.border}`,
            boxShadow:   colors.shadowModal,
            display:     'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Drawer 헤더 */}
        <Box
          sx={{
            px: 3,
            pt: 2.5,
            pb: 2,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            borderBottom:   `1px solid ${colors.border}`,
            flexShrink:     0,
          }}
        >
          <Typography
            sx={{
              fontFamily:    '"Playfair Display", serif',
              fontWeight:    700,
              fontSize:      17,
              color:         colors.textPrimary,
              letterSpacing: 0.5,
            }}
          >
            Portfolio
          </Typography>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="메뉴 닫기"
            sx={{
              p:          1,
              borderRadius: 0,
              color:        colors.textMuted,
              '&:hover':  { bgcolor: 'transparent', color: colors.textPrimary },
            }}
          >
            <HamburgerIcon open={true} />
          </IconButton>
        </Box>

        {/* 네비게이션 목록 */}
        <Box component="nav" aria-label="모바일 네비게이션" sx={{ flexGrow: 1, pt: 2, px: 2 }}>
          <List disablePadding>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleNav(item.path)}
                    aria-current={active ? 'page' : undefined}
                    sx={{
                      py:          1.8,
                      px:          2,
                      borderRadius: 0,
                      borderLeft:  `2px solid ${active ? colors.primary : 'transparent'}`,
                      bgcolor:     active ? `${colors.primary}10` : 'transparent',
                      transition:  'all 0.2s ease',
                      '&:hover': {
                        bgcolor:    `${colors.primary}08`,
                        borderLeftColor: `${colors.primary}80`,
                      },
                    }}
                  >
                    {/* 순번 */}
                    <Typography
                      sx={{
                        fontFamily:    '"Inter", sans-serif',
                        fontSize:      10,
                        fontWeight:    700,
                        letterSpacing: 1,
                        color:         active ? colors.primary : '#CCCCCC',
                        minWidth:      28,
                        transition:    'color 0.2s',
                      }}
                    >
                      {item.num}
                    </Typography>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontFamily:    '"Inter", sans-serif',
                        fontSize:      15,
                        fontWeight:    active ? 600 : 400,
                        color:         active ? colors.textPrimary : colors.textSecondary,
                        letterSpacing: 0.3,
                      }}
                    />
                    {/* 활성 상태 화살표 */}
                    {active && (
                      <Box
                        aria-hidden="true"
                        sx={{
                          width:  6,
                          height: 6,
                          borderTop:   `1.5px solid ${colors.primary}`,
                          borderRight: `1.5px solid ${colors.primary}`,
                          transform:   'rotate(45deg)',
                          flexShrink:  0,
                          ml:          1,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Drawer 하단 — 소셜 링크 */}
        <Box
          sx={{
            px:          3,
            py:          2.5,
            borderTop:   `1px solid ${colors.border}`,
            display:     'flex',
            alignItems:  'center',
            gap:         1.5,
            flexShrink:  0,
          }}
        >
          <Typography
            sx={{
              fontFamily:    '"Inter", sans-serif',
              fontSize:      9,
              fontWeight:    700,
              letterSpacing: 2.5,
              color:         '#CCCCCC',
              mr:            0.5,
            }}
          >
            FIND ME
          </Typography>
          {SOCIAL_LINKS.map(({ label, href, path }) => (
            <IconButton
              key={label}
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} 새 탭에서 열기`}
              size="small"
              sx={{
                color:      '#AAAAAA',
                p:          0.8,
                borderRadius: 0,
                '&:hover':  { color: colors.textPrimary, bgcolor: 'transparent' },
                transition: 'color 0.2s',
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{ width: 16, height: 16, fill: 'currentColor' }}
                aria-hidden="true"
              >
                <path d={path} />
              </Box>
            </IconButton>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
