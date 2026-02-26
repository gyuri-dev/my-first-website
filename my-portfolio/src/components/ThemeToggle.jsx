/**
 * ThemeToggle — 해/달 아이콘 모핑 토글 버튼
 *
 * 라이트 모드: 태양 아이콘 표시 → 클릭하면 다크 모드
 * 다크 모드:   달 아이콘 표시  → 클릭하면 라이트 모드
 *
 * 전환 애니메이션: 아이콘 회전(90°) + 페이드 + 스케일 0.4→1
 */
import Box        from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip    from '@mui/material/Tooltip';
import { useThemeMode } from '../context/ThemeContext';

// ── 태양 아이콘 (Feather Icons "sun") ─────────────────────────────────────
function SunSvg() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"     x2="12" y2="3"     />
      <line x1="12" y1="21"    x2="12" y2="23"    />
      <line x1="4.22" y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12"    x2="3"  y2="12"    />
      <line x1="21" y1="12"    x2="23" y2="12"    />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

// ── 달 아이콘 (Feather Icons "moon") ──────────────────────────────────────
function MoonSvg() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ── 공통 아이콘 래퍼 스타일 ────────────────────────────────────────────────
function iconWrap(visible) {
  return {
    position:       'absolute',
    inset:          0,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    opacity:        visible ? 1 : 0,
    transform:      visible
      ? 'rotate(0deg) scale(1)'
      : 'rotate(90deg) scale(0.35)',
    transition: 'opacity 0.42s cubic-bezier(0.34,1.56,0.64,1), transform 0.42s cubic-bezier(0.34,1.56,0.64,1)',
    pointerEvents: 'none',
  };
}

// ── 컴포넌트 ──────────────────────────────────────────────────────────────
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <Tooltip
      title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      placement="bottom"
      arrow
    >
      <IconButton
        onClick={toggleTheme}
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        size="small"
        sx={{
          width:        36,
          height:       36,
          borderRadius: 0,
          color:        'var(--c-text)',
          flexShrink:   0,
          '&:hover': {
            bgcolor: 'transparent',
            color:   '#C8A97E',
          },
          transition: 'color 0.2s ease',
        }}
      >
        {/* 20×20 상대 컨테이너 — 두 아이콘이 겹쳐 position:absolute */}
        <Box sx={{ position: 'relative', width: 20, height: 20 }}>
          {/* 태양: 라이트 모드일 때 표시 */}
          <Box sx={iconWrap(!isDark)}>
            <Box sx={{ width: 19, height: 19 }}><SunSvg /></Box>
          </Box>
          {/* 달: 다크 모드일 때 표시 */}
          <Box sx={iconWrap(isDark)}>
            <Box sx={{ width: 17, height: 17 }}><MoonSvg /></Box>
          </Box>
        </Box>
      </IconButton>
    </Tooltip>
  );
}
