import React           from 'react';
import ReactDOM        from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme }             from './theme';
import App                            from './App.jsx';
import { PortfolioProvider }          from './context/PortfolioContext';
import { ThemeModeProvider, useThemeMode } from './context/ThemeContext';
import './index.css';

/**
 * AppShell — ThemeModeProvider 안에서 isDark를 읽어 MUI 테마를 동적으로 생성.
 * ThemeProvider는 여기서 감싸야 useThemeMode() 훅을 쓸 수 있음.
 */
function AppShell() {
  const { isDark } = useThemeMode();
  const muiTheme   = createAppTheme(isDark);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeModeProvider>
        <AppShell />
      </ThemeModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
