/**
 * ThemeContext — 다크/라이트 모드 상태 관리
 *
 * ┌ 초기값   ─ index.html anti-flicker 스크립트가 이미 설정한 data-theme 읽기
 * ├ 저장     ─ localStorage('portfolio-theme')
 * ├ 시스템   ─ prefers-color-scheme 변화 감지 (저장값 없을 때만 반영)
 * └ 전환     ─ toggleTheme() 호출 시 .theme-animating 클래스로 부드러운 색상 변화
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeCtx = createContext(null);

export function ThemeModeProvider({ children }) {
  // anti-flicker 스크립트가 이미 data-theme를 설정했으므로 그 값을 읽어 초기화
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  // isDark 변경 시 data-theme 속성 + localStorage 동기화
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light'); } catch (_) {}
  }, [isDark]);

  // 시스템 색상 테마 변경 감지 (사용자 저장값이 없을 때만 반영)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      try {
        if (!localStorage.getItem('portfolio-theme')) setIsDark(e.matches);
      } catch (_) { setIsDark(e.matches); }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // 전환: .theme-animating으로 부드러운 색상 transition 활성화 → 400ms 후 제거
  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    html.classList.add('theme-animating');
    setIsDark((v) => !v);
    const t = setTimeout(() => html.classList.remove('theme-animating'), 420);
    return () => clearTimeout(t);
  }, []);

  return (
    <ThemeCtx.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useThemeMode는 ThemeModeProvider 안에서만 사용 가능합니다.');
  return ctx;
}
