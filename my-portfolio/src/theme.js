// 포트폴리오 디자인 시스템 — 모노톤 + 골드 포인트
import { createTheme } from '@mui/material/styles';

/**
 * colors — sx 프롭에서 사용하는 색상 레퍼런스.
 * 대부분 CSS 변수를 가리키므로 [data-theme="dark"] 전환 시 자동 반영됨.
 * 골드 계열은 라이트/다크 모두 동일하므로 하드코딩.
 */
export const colors = {
  // ── 브랜드 (양 모드 동일) ─────────────────────────────────────────────────
  primary:       '#C8A97E',
  primaryLight:  '#DEC09B',
  primaryDark:   '#A8865A',

  // ── 배경 (CSS 변수) ───────────────────────────────────────────────────────
  bgPrimary:     'var(--c-bg)',
  bgSecondary:   'var(--c-bg-surface)',
  bgTertiary:    'var(--c-bg-raised)',

  // ── 텍스트 (CSS 변수) ─────────────────────────────────────────────────────
  textPrimary:   'var(--c-text)',
  textSecondary: 'var(--c-text-sub)',
  textMuted:     'var(--c-text-muted)',
  textOnDark:    '#F8F8F6',   // 의도적 다크 섹션(stats 등)에서 사용

  // ── 버튼 ─────────────────────────────────────────────────────────────────
  buttonPrimary: 'var(--c-text)',
  buttonHover:   '#C8A97E',
  buttonActive:  '#A8865A',

  // ── 링크 ─────────────────────────────────────────────────────────────────
  link:      '#C8A97E',
  linkHover: '#A8865A',

  // ── 테두리 (CSS 변수) ─────────────────────────────────────────────────────
  border:      'var(--c-border)',
  borderFocus: '#C8A97E',

  // ── 상태 (양 모드 동일) ───────────────────────────────────────────────────
  success: '#4CAF50',
  warning: '#F7C948',
  error:   '#E53935',
  info:    '#2196F3',

  // ── 그림자 (CSS 변수) ─────────────────────────────────────────────────────
  shadowCard:  'var(--c-shadow-card)',
  shadowModal: 'var(--c-shadow-modal)',
  overlayDark: 'rgba(0, 0, 0, 0.5)',
};

// ── MUI 공통 설정 (라이트/다크 공유) ──────────────────────────────────────
const sharedConfig = {
  typography: {
    fontFamily: '"Inter", "Noto Serif KR", "Roboto", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 0,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'var(--c-shadow-card)',
          border: '1px solid var(--c-border)',
          borderRadius: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
  },
};

/**
 * createAppTheme — isDark에 따라 MUI 팔레트를 동적 생성.
 * main.jsx에서 useThemeMode()와 연동하여 호출.
 */
export function createAppTheme(isDark = false) {
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main:         '#C8A97E',
        light:        '#DEC09B',
        dark:         '#A8865A',
        contrastText: isDark ? '#141412' : '#F8F8F6',
      },
      background: {
        default: isDark ? '#141412' : '#F8F8F6',
        paper:   isDark ? '#1C1C1A' : '#FFFFFF',
      },
      text: {
        primary:   isDark ? '#EEEAE4' : '#1A1A1A',
        secondary: isDark ? '#9A9690' : '#555555',
        disabled:  isDark ? '#5E5C58' : '#888888',
      },
      divider: isDark ? '#2C2C28' : '#E0DFDC',
      success: { main: '#4CAF50' },
      error:   { main: '#E53935' },
    },
    ...sharedConfig,
  });
}

// 하위 호환용 기본 익스포트 (라이트 테마)
export default createAppTheme(false);
