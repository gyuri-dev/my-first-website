// 던킨 도너츠 컬러 팔레트 디자인 시스템 기반 MUI 테마
// 출처: 컬러 팔레트 디자인 시스템.md

import { createTheme } from '@mui/material/styles';

export const colors = {
  // Primary Colors (던킨 시그니처 오렌지)
  primary:       '#FF6B2B',
  primaryLight:  '#FF9260',
  primaryDark:   '#CC4A12',

  // Secondary Colors
  secondary:     '#E91F8A',
  accent:        '#F7C948',

  // Background Colors
  bgPrimary:     '#FDF7F2',
  bgSecondary:   '#FFFFFF',
  bgTertiary:    '#F5EDE0',

  // Text Colors
  textPrimary:   '#1A1A1A',
  textSecondary: '#6B5B4E',
  textMuted:     '#A89485',
  textBrand:     '#FF6B2B',
  textOnDark:    '#FFFFFF',

  // Button
  buttonPrimary: '#FF6B2B',
  buttonHover:   '#FF3D00',
  buttonActive:  '#CC4A12',

  // Link
  link:          '#FF6B2B',
  linkHover:     '#E91F8A',

  // Border
  border:        '#E0D5C8',
  borderFocus:   '#FF6B2B',
  borderBrand:   '#FF6B2B',

  // State
  success:       '#4CAF50',
  warning:       '#F7C948',
  error:         '#E53935',
  info:          '#2196F3',

  // Shadow & Overlay
  shadowCard:    '0 4px 16px rgba(255, 107, 43, 0.12)',
  shadowModal:   '0 8px 32px rgba(26, 26, 26, 0.18)',
  overlayDark:   'rgba(26, 26, 26, 0.5)',
};

const theme = createTheme({
  palette: {
    primary: {
      main:  colors.primary,
      light: colors.primaryLight,
      dark:  colors.primaryDark,
      contrastText: colors.textOnDark,
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.textOnDark,
    },
    background: {
      default: colors.bgPrimary,
      paper:   colors.bgSecondary,
    },
    text: {
      primary:   colors.textPrimary,
      secondary: colors.textSecondary,
      disabled:  colors.textMuted,
    },
    warning: {
      main: colors.accent,
    },
    success: {
      main: colors.success,
    },
    error: {
      main: colors.error,
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", "Roboto", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        contained: {
          boxShadow: colors.shadowCard,
          '&:hover': {
            backgroundColor: colors.buttonHover,
            boxShadow: colors.shadowModal,
          },
          '&:active': {
            backgroundColor: colors.buttonActive,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: colors.shadowCard,
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.bgSecondary,
          borderBottom: `2px solid ${colors.border}`,
        },
      },
    },
  },
});

export default theme;
