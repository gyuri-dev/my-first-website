import { useState, useEffect, useRef, Fragment, memo, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { colors } from '../theme';
import { usePortfolio } from '../context/PortfolioContext';
import { useReveal } from '../hooks/useScrollAnimation';
import TypingMorph from '../components/TypingMorph';

// ─── 공통 섹션 헤더 ───────────────────────────────────────────────────────────
const SectionHeader = memo(function SectionHeader({ label, title, subtitle }) {
  return (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Typography
        variant="overline"
        sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 3, fontSize: 13 }}
      >
        {label}
      </Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ color: colors.textPrimary, mt: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ color: colors.textSecondary, mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
});

// ─── "반영됨" 뱃지 ────────────────────────────────────────────────────────────
// homeData 레퍼런스가 바뀔 때마다 2.5초 동안 표시
function SyncBadge({ watchValue }) {
  const [visible,      setVisible]      = useState(false);
  const isFirstRender = useRef(true);
  const prevRef       = useRef(watchValue);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (prevRef.current !== watchValue) {
      prevRef.current = watchValue;
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(t);
    }
  }, [watchValue]);

  if (!visible) return null;
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.8,
        px: 2,
        py: 0.6,
        mb: 3,
        bgcolor: `${colors.success}12`,
        border: `1px solid ${colors.success}40`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        '@keyframes slideDown': {
          from: { opacity: 0, transform: 'translateY(-6px)' },
          to:   { opacity: 1, transform: 'translateY(0)'    },
        },
        animation: 'slideDown 0.35s ease',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.success, flexShrink: 0 }} />
      <Typography sx={{
        fontFamily: '"Inter", sans-serif',
        fontSize: 11,
        fontWeight: 600,
        color: colors.success,
        letterSpacing: 0.5,
      }}>
        About Me 변경사항이 반영되었습니다
      </Typography>
    </Box>
  );
}

// ─── 스크롤 fade-up 훅 ────────────────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref      = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── 카운트업 애니메이션 훅 ───────────────────────────────────────────────────
function useCountUp(target, duration = 1500, trigger = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!trigger || target === 0) { setCount(0); return; }
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target)); // ease-out cubic
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, trigger]);
  return count;
}

// 개별 스탯 아이템 (훅은 컴포넌트 레벨에서만 호출 가능)
function StatItem({ end, suffix, label, trigger }) {
  const count = useCountUp(end, 1600, trigger);
  return (
    <Box
      sx={{
        textAlign:    'center',
        px:           { xs: 1, sm: 3 },
        position:     'relative',
        // 우측 구분선 (마지막 제외)
        '&:not(:last-child)::after': {
          content:   '""',
          position:  'absolute',
          right:     0,
          top:       '50%',
          transform: 'translateY(-50%)',
          height:    '40%',
          width:     '1px',
          bgcolor:   'rgba(255,255,255,0.1)',
          display:   { xs: 'none', sm: 'block' },
        },
      }}
    >
      <Typography
        sx={{
          fontFamily:         '"Playfair Display", serif',
          fontSize:           { xs: '1.9rem', sm: '2.4rem', md: '2.8rem' },
          fontWeight:         700,
          color:              '#C8A97E',
          lineHeight:         1,
          mb:                 0.8,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}{suffix}
      </Typography>
      <Typography
        sx={{
          fontFamily:    '"Inter", sans-serif',
          fontSize:      { xs: 9, sm: 11 },
          fontWeight:    600,
          letterSpacing: 2,
          color:         'rgba(248,248,246,0.5)',
        }}
      >
        {label.toUpperCase()}
      </Typography>
    </Box>
  );
}

// ─── Stats 섹션 ───────────────────────────────────────────────────────────────
function StatsSection() {
  const { skills }        = usePortfolio();
  const { ref, visible }  = useFadeIn(0.2);

  const avgLevel = skills.length > 0
    ? Math.round(skills.reduce((s, sk) => s + sk.level, 0) / skills.length)
    : 0;

  const STATS = [
    { end: skills.length, suffix: '+', label: '보유 기술'  },
    { end: avgLevel,      suffix: '%', label: '평균 숙련도' },
    { end: 3,             suffix: '+', label: '학습 스토리' },
    { end: 100,           suffix: '%', label: '성장 의지'  },
  ];

  return (
    <Box
      ref={ref}
      component="section"
      aria-label="통계 섹션"
      sx={{
        bgcolor:    '#1A1A1A',
        py:         { xs: 5, sm: 6 },
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display:             'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          }}
        >
          {STATS.map(({ end, suffix, label }) => (
            <StatItem key={label} end={end} suffix={suffix} label={label} trigger={visible} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// ─── 아이콘 맵 ────────────────────────────────────────────────────────────────
const ICON_MAP_HOME = {
  html:  { symbol: 'H',  bg: '#E44D26', text: '#FFF'    },
  css:   { symbol: 'C',  bg: '#264DE4', text: '#FFF'    },
  js:    { symbol: 'JS', bg: '#F0DB4F', text: '#1A1A1A' },
  react: { symbol: '⚛', bg: '#20232A', text: '#61DAFB' },
  figma: { symbol: 'Fg', bg: '#A259FF', text: '#FFF'    },
  ts:    { symbol: 'TS', bg: '#3178C6', text: '#FFF'    },
  java:  { symbol: 'Jv', bg: '#ED8B00', text: '#FFF'    },
  git:   { symbol: 'G',  bg: '#F05032', text: '#FFF'    },
};
const getHomeIcon = (key, name) =>
  ICON_MAP_HOME[key] ?? { symbol: name.slice(0, 2).toUpperCase(), bg: '#C8A97E', text: '#FFF' };

const CAT_COLORS = {
  Frontend:  '#3B7DD8',
  Framework: '#C8A97E',
  Design:    '#6E8B74',
  Backend:   '#8B6DB0',
  Tool:      '#888888',
};

// ─── 1. Hero 섹션 ─────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate                      = useNavigate();
  const { homeData }                  = usePortfolio();
  const theme                         = useTheme();
  const isMobile                      = useMediaQuery(theme.breakpoints.down('sm'));   // < 600px
  const isTablet                      = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600–899px
  const [visible,     setVisible]     = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [showCursor,  setShowCursor]  = useState(false);

  // 페이지 진입 후 fade-up 트리거
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // 헤드라인 완성 1.5초 후 커서 표시
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowCursor(true), 1500);
    return () => clearTimeout(t);
  }, [visible]);

  // ── 패럴렉스 레이어 refs ──────────────────────────────────────────────────
  const pDotRef   = useRef(null); // 도트 그리드
  const pGlowLRef = useRef(null); // 좌측 글로우
  const pGlowRRef = useRef(null); // 우측 글로우
  const pWmarkRef = useRef(null); // 워터마크 "01"
  const pLineRef  = useRef(null); // 수직 라인

  // 스크롤: 인디케이터 숨김 + 패럴렉스 업데이트 (RAF throttle)
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y  = window.scrollY;
      const vh = window.innerHeight;
      setScrolled(y > 80);
      // 히어로 섹션 범위 내에서만 패럴렉스 적용
      if (y < vh * 1.2) {
        if (pDotRef.current)   pDotRef.current.style.transform   = `translate3d(0,${y * 0.20}px,0)`;
        if (pGlowLRef.current) pGlowLRef.current.style.transform = `translate3d(0,${y * 0.13}px,0)`;
        if (pGlowRRef.current) pGlowRRef.current.style.transform = `translate3d(0,${y * -0.10}px,0)`;
        if (pWmarkRef.current) pWmarkRef.current.style.transform = `translateY(calc(-50% + ${y * -0.18}px))`;
        if (pLineRef.current)  pLineRef.current.style.transform  = `translate3d(0,${y * 0.25}px,0)`;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // 초기 위치 설정
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fadeUp = (delay = 0) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0px)' : 'translateY(22px)',
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

  const { basicInfo, skills: topSkills } = homeData;

  const scrollToContact  = () =>
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToProjects = () =>
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToAbout    = () =>
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });

  // 소셜 링크 데이터
  const SOCIAL_LINKS = [
    {
      label: 'GitHub',
      href:  'https://github.com/',
      color: '#1A1A1A',
      path:  'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 6.8c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z',
    },
    {
      label: 'LinkedIn',
      href:  'https://linkedin.com/in/',
      color: '#0077B5',
      path:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    },
  ];

  return (
    <Box
      component="section"
      aria-label="소개 섹션"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: colors.bgPrimary,
        borderBottom: `1px solid ${colors.border}`,
        px: { xs: 2.5, sm: 5, md: 8, lg: 16 },
        pt: { xs: 10, sm: 11, md: 14 },
        pb: { xs: 18, sm: 16, md: 14 },   /* 모바일: 하단 태그 공간 확보 */
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── 배경 레이어 ── */}

      {/* 도트 그리드 패턴 */}
      <Box
        ref={pDotRef}
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, #C8A97E22 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          opacity: 0.6,
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* 그라데이션 글로우 — 좌측 상단 */}
      <Box
        ref={pGlowLRef}
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-15%',
          width: '50%',
          height: '70%',
          background: 'radial-gradient(ellipse at center, #C8A97E18 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* 그라데이션 글로우 — 우측 하단 */}
      <Box
        ref={pGlowRRef}
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: '-5%',
          right: '-10%',
          width: '45%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, #3B7DD820 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* 워터마크 "01" */}
      <Box
        ref={pWmarkRef}
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '50%',
          right: { xs: '-5%', md: '2%' },
          transform: 'translateY(-50%)',
          fontSize: { xs: '22vw', md: '16vw' },
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          WebkitTextStroke: '1px #C8A97E28',
          color: 'transparent',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
        }}
      >
        01
      </Box>

      {/* 수직 악센트 라인 */}
      <Box
        ref={pLineRef}
        aria-hidden="true"
        sx={{
          position: 'absolute',
          left: { xs: 16, sm: 24, md: 40 },
          top: '20%',
          height: '60%',
          width: '1px',
          background: 'linear-gradient(180deg, transparent 0%, #C8A97E60 30%, #C8A97E60 70%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* ── 2단 그리드 — 좌: 텍스트 / 우: 비주얼 ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 6, md: 8 },
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ════ 좌: 텍스트 영역 ════ */}
        <Box>
          {/* 섹션 레이블 */}
          <Box sx={{ ...fadeUp(0), mb: { xs: 3.5, sm: 5, md: 7 } }}>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: 10, sm: 11 },
              fontWeight: 600,
              letterSpacing: { xs: 3, sm: 4 },
              color: colors.textMuted,
            }}>
              01 &nbsp;/&nbsp; PORTFOLIO
            </Typography>
          </Box>

          {/* 메인 헤드라인 — 라인별 stagger */}
          <Box sx={{ mb: { xs: 3, sm: 3.5, md: 4 } }}>
            <Box sx={{ ...fadeUp(0.12) }}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: '"Playfair Display", "Noto Serif KR", serif',
                  fontSize: { xs: '1.75rem', sm: '2.3rem', md: '3.0rem', lg: '3.8rem' },
                  fontWeight: 700,
                  lineHeight: { xs: 1.3, md: 1.2 },
                  color: colors.textPrimary,
                  wordBreak: 'keep-all',
                }}
              >
                모자라면 즉시 찾고,
              </Typography>
            </Box>
            <Box sx={{ ...fadeUp(0.20) }}>
              <Typography
                component="p"
                sx={{
                  fontFamily: '"Playfair Display", "Noto Serif KR", serif',
                  fontSize: { xs: '1.75rem', sm: '2.3rem', md: '3.0rem', lg: '3.8rem' },
                  fontWeight: 700,
                  lineHeight: { xs: 1.3, md: 1.2 },
                  color: colors.textPrimary,
                  wordBreak: 'keep-all',
                  m: 0,
                }}
              >
                찾으면 바로 만들고,{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#C8A97E',
                    fontStyle: 'italic',
                    '@keyframes heroGlow': {
                      '0%, 100%': { textShadow: '0 0 8px #C8A97E40'  },
                      '50%':      { textShadow: '0 0 22px #C8A97E99' },
                    },
                    animation: 'heroGlow 3s ease-in-out infinite',
                    '@keyframes heroCursor': {
                      '0%, 100%': { opacity: 1 },
                      '50%':      { opacity: 0 },
                    },
                    ...(showCursor && {
                      '&::after': {
                        content: '"｜"',
                        display: 'inline-block',
                        ml: '2px',
                        fontSize: '0.8em',
                        animation: 'heroCursor 1.1s step-end infinite',
                        color: '#C8A97E',
                      },
                    }),
                  }}
                >
                  그렇게 자랍니다.
                </Box>
              </Typography>
            </Box>
          </Box>

          {/* ── Typing Morph — 역할 타이핑 모핑 ── */}
          <Box sx={{ ...fadeUp(0.26), mb: { xs: 3, sm: 3.5, md: 4.5 } }}>
            <TypingMorph visible={visible} />
          </Box>

          {/* 서브헤딩 */}
          <Box sx={{ ...fadeUp(0.34), mb: { xs: 4, sm: 5, md: 6 } }}>
            <Typography
              sx={{
                fontFamily: '"Noto Serif KR", serif',
                fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1.05rem' },
                fontWeight: 400,
                color: colors.textSecondary,
                lineHeight: { xs: 1.75, sm: 1.85, md: 1.9 },
                wordBreak: 'keep-all',
                borderLeft: '2px solid #C8A97E',
                pl: { xs: 2, sm: 2.5 },
              }}
            >
              부족함을 인정하는 것이 성장의 시작이라고
              <br />
              믿는 신입 개발자입니다.
            </Typography>
          </Box>

          {/* 이름 / 역할 */}
          <Box sx={{ ...fadeUp(0.42), display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 4, sm: 5, md: 7 } }}>
            <Box sx={{ width: { xs: 24, md: 36 }, height: '1px', bgcolor: '#C8A97E', flexShrink: 0 }} />
            <Typography sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: 11, sm: 12, md: 13 },
              fontWeight: 500,
              letterSpacing: { xs: 1.5, md: 2 },
              color: colors.textSecondary,
            }}>
              Web Designer & Developer &nbsp;·&nbsp; {basicInfo.name}
            </Typography>
          </Box>

          {/* CTA 버튼 */}
          <Box sx={{ ...fadeUp(0.50) }}>
            {/* ── 1행: 주요 버튼 + 보조 버튼 ── */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 2.5 },
            }}>
              {/* Primary CTA */}
              <Button
                variant="contained"
                size="large"
                fullWidth={isMobile}
                onClick={scrollToProjects}
                aria-label="프로젝트 섹션으로 스크롤"
                data-magnetic
                disableElevation
                sx={{
                  bgcolor: '#C8A97E',
                  color: '#1A1A1A',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.6, sm: 1.5 },
                  minHeight: 44,              /* 터치 타겟 44px 확보 */
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: 12, sm: 13 },
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  borderRadius: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  '@keyframes heroShimmer': {
                    '0%':   { left: '-100%' },
                    '100%': { left: '150%'  },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '60%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                    animation: 'heroShimmer 2.8s ease-in-out infinite 1.2s',
                  },
                  willChange:  'transform, background-color',
                  '&:hover':  { bgcolor: '#B8936E', transform: 'translateY(-2px)' },
                  '&:active': { transform: 'translateY(1px) scale(0.98)', transition: 'transform 0.08s ease' },
                  transition: 'background-color 0.25s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                포트폴리오 둘러보기
              </Button>

              {/* Secondary CTA */}
              <Button
                variant="outlined"
                size="large"
                fullWidth={isMobile}
                onClick={scrollToContact}
                aria-label="연락하기 섹션으로 스크롤"
                data-magnetic
                sx={{
                  borderColor: '#1A1A1A',
                  color: '#1A1A1A',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.6, sm: 1.5 },
                  minHeight: 44,              /* 터치 타겟 44px 확보 */
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: 12, sm: 13 },
                  fontWeight: 500,
                  letterSpacing: 1.5,
                  borderRadius: 0,
                  borderWidth: '1px !important',
                  willChange:  'transform, background-color',
                  '&:hover':  { bgcolor: '#1A1A1A', color: '#F8F8F6', borderColor: '#1A1A1A', transform: 'translateY(-2px)' },
                  '&:active': { transform: 'translateY(1px) scale(0.98)', transition: 'transform 0.08s ease' },
                  transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                연락하기
              </Button>
            </Box>

            {/* ── 2행: 이력서 다운로드 + 소셜 링크 ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              {/* 이력서 다운로드 */}
              <Button
                variant="text"
                component="a"
                href="#"
                aria-label="이력서 PDF 다운로드"
                sx={{
                  color: '#888888',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  px: 1,
                  py: { xs: 1.1, sm: 0.5 },  /* 모바일 터치 영역 확대 */
                  minHeight: { xs: 44, sm: 'auto' },
                  minWidth: 0,
                  borderRadius: 0,
                  gap: 0.8,
                  '&:hover': { color: '#C8A97E', bgcolor: 'transparent' },
                  transition: 'color 0.2s',
                }}
                startIcon={
                  <Box component="span" sx={{ fontSize: 12, lineHeight: 1 }}>↓</Box>
                }
              >
                이력서 다운로드
              </Button>

              {/* 구분선 */}
              <Box sx={{ width: '1px', height: 14, bgcolor: '#DDDDDD', mx: 0.5, flexShrink: 0 }} aria-hidden="true" />

              {/* 소셜 아이콘 버튼 */}
              {SOCIAL_LINKS.map(({ label, href, color, path }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} 프로필 새 탭에서 열기`}
                  size="small"
                  sx={{
                    color: '#888888',
                    p: { xs: 1.4, sm: 0.9 },   /* 모바일: ~44px 터치 타겟 */
                    borderRadius: 0,
                    '&:hover': {
                      color,
                      bgcolor: 'transparent',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'color 0.2s, transform 0.2s',
                  }}
                >
                  <Box
                    component="svg"
                    viewBox="0 0 24 24"
                    sx={{ width: { xs: 20, sm: 18 }, height: { xs: 20, sm: 18 }, fill: 'currentColor' }}
                    aria-hidden="true"
                  >
                    <path d={path} />
                  </Box>
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ════ 우: 프로필 사진 + 스킬 카드 (태블릿 이상) ════ */}
        <Box
          sx={{
            ...fadeUp(0.52),
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            gap: { md: 2.5, lg: 3 },
          }}
        >
          {/* 프로필 사진 — 원형 + 펄스 링 */}
          <Box
            sx={{
              position: 'relative',
              width: { md: 170, lg: 210, xl: 230 },
              height: { md: 170, lg: 210, xl: 230 },
              flexShrink: 0,
            }}
          >
            {/* 펄스 링 1 */}
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                inset: -16,
                borderRadius: '50%',
                border: '1px solid #C8A97E45',
                '@keyframes heroPulse': {
                  '0%':   { transform: 'scale(1)',    opacity: 0.6 },
                  '50%':  { transform: 'scale(1.04)', opacity: 0.3 },
                  '100%': { transform: 'scale(1)',    opacity: 0.6 },
                },
                animation: 'heroPulse 3s ease-in-out infinite',
              }}
            />
            {/* 펄스 링 2 */}
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                inset: -32,
                borderRadius: '50%',
                border: '1px solid #C8A97E25',
                animation: 'heroPulse 3s ease-in-out infinite 0.5s',
              }}
            />
            {/* 원형 사진 영역 */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                bgcolor: '#EFEFED',
                border: '2px solid #C8A97E60',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                zIndex: 1,
              }}
            >
              {basicInfo.photo ? (
                <img
                  src={basicInfo.photo}
                  alt={`${basicInfo.name} 프로필 사진`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <Typography
                    sx={{ fontFamily: '"Playfair Display", serif', fontSize: 64, fontWeight: 700, color: '#C8A97E', lineHeight: 1, mb: 1.5 }}
                    aria-hidden="true"
                  >
                    {basicInfo.name.charAt(0)}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 3, color: '#BBBBBB' }}>
                    PHOTO
                  </Typography>
                </>
              )}
              {/* 이름 뱃지 오버레이 */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(26, 26, 26, 0.68)',
                  backdropFilter: 'blur(4px)',
                  py: 1,
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(248, 248, 246, 0.85)' }}>
                  {basicInfo.name}
                </Typography>
              </Box>
            </Box>
          </Box>

        </Box>
      </Box>



      {/* ── 하단 기술 태그 — 모바일 숨김, 태블릿+ 표시 ── */}
      {topSkills.length > 0 && (
        <Box
          sx={{
            ...fadeUp(0.60),
            position: 'absolute',
            bottom: { sm: 48, md: 56, lg: 60 },
            left: { sm: 24, md: 80, lg: 128 },
            display: { xs: 'none', sm: 'flex' },   /* 모바일 숨김 */
            alignItems: 'center',
            gap: { sm: 2, md: 2.5 },
            zIndex: 1,
          }}
          aria-label="사용 기술 태그"
        >
          {topSkills.map((skill, i) => (
            <Fragment key={skill.id}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: '#AAAAAA' }}>
                {skill.name.toUpperCase()}
              </Typography>
              {i < topSkills.length - 1 && (
                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#C8A97E', flexShrink: 0 }} aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </Box>
      )}

      {/* ── 스크롤 다운 인디케이터 (클릭 시 About 섹션으로 이동) ── */}
      <Box
        component="button"
        onClick={scrollToAbout}
        aria-label="다음 섹션으로 스크롤"
        sx={{
          position: 'absolute',
          bottom: { xs: 12, sm: 18, md: 24 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          opacity: scrolled ? 0 : (visible ? 0.55 : 0),
          transition: 'opacity 0.4s ease',
          pointerEvents: scrolled ? 'none' : 'auto',
          zIndex: 1,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          '&:hover': { opacity: scrolled ? 0 : 0.9 },
        }}
      >
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: 2.5, color: '#888888' }}>
          SCROLL
        </Typography>
        {/* 바운싱 쉐브론 */}
        <Box
          sx={{
            '@keyframes heroBounce': {
              '0%, 100%': { transform: 'translateY(0)',   opacity: 0.45 },
              '50%':      { transform: 'translateY(6px)', opacity: 1    },
            },
            animation: 'heroBounce 1.8s ease-in-out infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 12,
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', left: 0,  top: 0, width: 12, height: '1.5px', bgcolor: '#C8A97E', transformOrigin: 'left',  transform: 'rotate(40deg)'  }} />
          <Box sx={{ position: 'absolute', right: 0, top: 0, width: 12, height: '1.5px', bgcolor: '#C8A97E', transformOrigin: 'right', transform: 'rotate(-40deg)' }} />
        </Box>
      </Box>
    </Box>
  );
}

// ─── 2. About Me 섹션 ─────────────────────────────────────────────────────────
const AboutSection = memo(function AboutSection() {
  const navigate           = useNavigate();
  const { homeData }       = usePortfolio();
  const { ref, visible }   = useFadeIn(0.1);

  const { content, basicInfo } = homeData;
  const devStory = useMemo(() => content.find((c) => c.id === 'dev-story'), [content]);
  const otherSections = useMemo(() => content.filter((c) => c.id !== 'dev-story'), [content]);

  return (
    <Box
      id="about-section"
      ref={ref}
      component="section"
      aria-label="자기소개 섹션"
      sx={{
        py: 10,
        bgcolor: colors.bgSecondary,
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translate3d(0,0,0)' : 'translate3d(0,18px,0)',
          transition: 'opacity 0.55s ease 0.05s, transform 0.55s ease 0.05s',
          willChange: 'opacity, transform',
        }}>
          <SyncBadge watchValue={homeData} />
          <SectionHeader label="ABOUT ME" title="자기소개" />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          {/* 사이드: 프로필 사진 + 기본 정보 */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow:    colors.shadowCard,
              border:       `1px solid ${colors.border}`,
              opacity:      visible ? 1 : 0,
              willChange:   'opacity, transform, box-shadow',
              transition:   'opacity 0.65s ease 0.2s, transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform:  'translateY(-6px)',
                boxShadow:  `0 16px 40px rgba(26,26,26,0.12)`,
                borderColor: colors.primary,
              },
            }}
            role="complementary"
            aria-label="프로필 정보"
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.bgTertiary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {basicInfo.photo ? (
                  <img
                    src={basicInfo.photo}
                    alt={`${basicInfo.name} 프로필 사진`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography sx={{ fontSize: 28 }} aria-hidden="true">📷</Typography>
                )}
              </Box>

              <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: colors.textPrimary, mb: 0.5 }}>
                {basicInfo.name}
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: 2, color: colors.textMuted, mb: 2 }}>
                WEB DESIGNER
              </Typography>

              <Divider sx={{ borderColor: colors.border, mb: 2 }} />

              {[
                { label: 'EDUCATION',  value: basicInfo.education  },
                { label: 'MAJOR',      value: basicInfo.major      },
                { label: 'EXPERIENCE', value: basicInfo.experience },
              ].map((item) => (
                <Box key={item.label} sx={{ mb: 1.5, textAlign: 'left' }}>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 2, color: colors.textMuted, mb: 0.3 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* 메인: 나의 개발 스토리 + 홈 표시 섹션 */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow:    colors.shadowCard,
              border:       `1px solid ${colors.border}`,
              overflow:     'visible',
              opacity:      visible ? 1 : 0,
              willChange:   'opacity, transform, box-shadow',
              transition:   'opacity 0.65s ease 0.35s, transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform:  'translateY(-4px)',
                boxShadow:  `0 12px 32px rgba(26,26,26,0.10)`,
              },
            }}
            role="main"
            aria-label="개발 스토리"
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ width: 40, height: 3, bgcolor: colors.primary, borderRadius: 2, mb: 2.5 }} />

              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 3, color: colors.textMuted, mb: 1 }}>
                나의 개발 스토리
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Noto Serif KR", serif',
                  fontSize: { xs: 14, md: 15 },
                  color: colors.textSecondary,
                  lineHeight: 2,
                  wordBreak: 'keep-all',
                  mb: 3,
                }}
              >
                {devStory
                  ? devStory.summary
                  : 'About Me 탭에서 나의 개발 스토리를 작성해보세요.'}
              </Typography>

              {otherSections.map((item) => (
                <Box
                  key={item.id}
                  sx={{ p: 2, mb: 1.5, bgcolor: colors.bgTertiary, border: `1px solid ${colors.border}` }}
                >
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2, color: colors.primary, mb: 0.5 }}>
                    {item.title.toUpperCase()}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Noto Serif KR", serif', fontSize: 13, color: colors.textSecondary, lineHeight: 1.8, wordBreak: 'keep-all' }}>
                    {item.summary}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ borderColor: colors.border, my: 3 }} />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/about')}
                  aria-label="About Me 페이지에서 자세한 내용 보기"
                  disableElevation
                  sx={{ bgcolor: '#1A1A1A', color: '#F8F8F6', fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: 1, borderRadius: 0, px: 3, '&:hover': { bgcolor: colors.primary }, transition: 'background-color 0.25s ease' }}
                >
                  더 알아보기
                </Button>
                <Button
                  variant="text"
                  aria-label="이력서 다운로드"
                  sx={{ color: colors.textSecondary, fontFamily: '"Inter", sans-serif', fontSize: 12, '&:hover': { color: colors.primary } }}
                >
                  이력서 다운로드
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
});

// ─── 3. Skills 섹션 ───────────────────────────────────────────────────────────
const SkillSection = memo(function SkillSection() {
  const navigate         = useNavigate();
  const { homeData }     = usePortfolio();
  const { ref, visible } = useFadeIn(0.15);

  // skills가 바뀔 때만 재계산
  const topSkills = useMemo(() => homeData.skills, [homeData.skills]);

  return (
    <Box
      ref={ref}
      component="section"
      aria-label="주요 스킬 섹션"
      sx={{
        py: 10,
        bgcolor: colors.bgPrimary,
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
      }}
    >
      <Container maxWidth="md">
        <SyncBadge watchValue={homeData} />
        <SectionHeader
          label="SKILLS"
          title="주요 스킬"
          subtitle="About Me 탭에서 ★ 별 클릭 또는 레벨 변경 시 즉시 반영됩니다."
        />

        {topSkills.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: colors.textMuted }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 13 }}>
              About Me 탭에서 스킬에 ★ 별을 표시하면 여기에 나타납니다.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 4,
            }}
          >
            {topSkills.map((skill, index) => {
              const cfg      = getHomeIcon(skill.icon, skill.name);
              const catColor = CAT_COLORS[skill.category] ?? '#C8A97E';
              return (
                <Tooltip
                  key={skill.id}
                  title={
                    <Box sx={{ p: 0.5 }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 700, mb: 0.3 }}>
                        {skill.name}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, opacity: 0.75, mb: 0.3 }}>
                        {skill.category}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: colors.primaryLight }}>
                        숙련도 {skill.level}%
                      </Typography>
                    </Box>
                  }
                  placement="top"
                  arrow
                  enterDelay={200}
                >
                  <Box
                    sx={{
                      p:           3,
                      bgcolor:     colors.bgSecondary,
                      border:      `1px solid ${colors.border}`,
                      display:     'flex',
                      flexDirection: 'column',
                      alignItems:  'center',
                      gap:         1.5,
                      cursor:      'default',
                      // 초기 페이드인 (opacity stagger)
                      opacity:     visible ? 1 : 0,
                      transition: [
                        `opacity 0.5s ease ${0.15 + index * 0.08}s`,
                        'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        'border-color 0.25s ease',
                        'box-shadow 0.35s ease',
                      ].join(', '),
                      willChange:  'transform, box-shadow',
                      // 호버: 리프트 + 글로우
                      '&:hover': {
                        transform:  'translateY(-8px) scale(1.03)',
                        borderColor: catColor,
                        boxShadow:  `0 16px 36px ${catColor}30, 0 4px 14px rgba(0,0,0,0.07)`,
                        // 아이콘 회전 (CSS class selector)
                        '& .skill-icon-inner': {
                          transform: 'rotate(15deg) scale(1.12)',
                          boxShadow: `0 0 18px ${catColor}70`,
                        },
                        // 구분선 확장
                        '& .skill-divider': { width: '80%', opacity: 0.8 },
                      },
                      '&:focus-within': { outline: `2px solid ${catColor}`, outlineOffset: 2 },
                    }}
                    role="article"
                    aria-label={`${skill.name} 스킬 - ${skill.category} - 숙련도 ${skill.level}%`}
                  >
                    {/* 아이콘 */}
                    <Box
                      className="skill-icon-inner"
                      sx={{
                        width:  52,
                        height: 52,
                        bgcolor: cfg.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        willChange:  'transform, box-shadow',
                        transition:  'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                      }}
                      aria-hidden="true"
                    >
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 18, fontWeight: 700, color: cfg.text, lineHeight: 1 }}>
                        {cfg.symbol}
                      </Typography>
                    </Box>

                    {/* 이름 */}
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 700, color: colors.textPrimary, textAlign: 'center' }}>
                      {skill.name}
                    </Typography>

                    {/* 구분선 (호버 시 확장) */}
                    <Box
                      className="skill-divider"
                      sx={{ width: 32, height: '1px', bgcolor: catColor, transition: 'width 0.3s ease, opacity 0.3s ease' }}
                      aria-hidden="true"
                    />

                    {/* 카테고리 */}
                    <Box sx={{ px: 1.5, py: 0.4, bgcolor: `${catColor}18`, border: `1px solid ${catColor}50` }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 9, fontWeight: 700, color: catColor, letterSpacing: 1.5 }}>
                        {skill.category.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        )}

        {/* 전체 스킬 보기 버튼 */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/about')}
            aria-label="About Me 페이지에서 전체 스킬 목록 보기"
            sx={{ borderColor: '#1A1A1A', color: '#1A1A1A', fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: 1.5, borderRadius: 0, borderWidth: '1px !important', px: 4, py: 1.2, '&:hover': { borderColor: colors.primary, color: colors.primary, bgcolor: 'transparent' }, transition: 'all 0.25s ease' }}
          >
            전체 스킬 보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
});

// ─── 4. Projects 섹션 ─────────────────────────────────────────────────────────
function ProjectsSection() {
  const navigate = useNavigate();
  const { ref: secRef, visible: projVisible } = useReveal({ threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  const projectCards = [
    { title: 'Project 01', desc: '대표 프로젝트 썸네일이 들어갈 예정입니다.', color: colors.bgTertiary         },
    { title: 'Project 02', desc: '대표 프로젝트 썸네일이 들어갈 예정입니다.', color: '#F7C94818'              },
    { title: 'Project 03', desc: '대표 프로젝트 썸네일이 들어갈 예정입니다.', color: '#6E8B7415'              },
    { title: 'Project 04', desc: '대표 프로젝트 썸네일이 들어갈 예정입니다.', color: `${colors.primary}18`   },
  ];

  return (
    <Box id="projects-section" component="section" aria-label="프로젝트 섹션" sx={{ py: 10, bgcolor: colors.bgSecondary }}>
      <Container maxWidth="lg" ref={secRef}>
        <Box sx={{
          opacity:    projVisible ? 1 : 0,
          transform:  projVisible ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          willChange: 'opacity, transform',
        }}>
          <SectionHeader
            label="PROJECTS"
            title="대표 프로젝트"
            subtitle="대표작 썸네일 3-4개와 '더 보기' 버튼이 들어갈 예정입니다."
          />
        </Box>

        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 5 }}
        >
          {projectCards.map((p, index) => (
            <Box key={p.title} sx={{
              opacity:    projVisible ? 1 : 0,
              transform:  projVisible ? 'translate3d(0,0,0)' : 'translate3d(0,36px,0)',
              transition: `opacity 0.65s ease ${0.1 + index * 0.11}s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${0.1 + index * 0.11}s`,
              willChange: 'opacity, transform',
            }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow:    colors.shadowCard,
                border:       `1px solid ${colors.border}`,
                overflow:     'hidden',
                willChange:   'transform, box-shadow',
                transition:   'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.3s ease',
                '&:hover': {
                  transform:   'translateY(-10px) scale(1.02)',
                  boxShadow:   '0 24px 48px rgba(26,26,26,0.14)',
                  borderColor: colors.primary,
                  // 이미지 영역 줌
                  '& .proj-img-inner': { transform: 'scale(1.10)' },
                  // 오버레이 슬라이드 업
                  '& .proj-overlay':   { opacity: 1, transform: 'translateY(0)' },
                  // 텍스트 색상 강조
                  '& .proj-title':     { color: colors.primary },
                },
              }}
            >
              {/* 이미지 영역 */}
              <Box
                sx={{
                  height:   150,
                  bgcolor:  p.color,
                  overflow: 'hidden',
                  position: 'relative',
                  borderBottom: `1px solid ${colors.border}`,
                }}
                aria-hidden="true"
              >
                {/* 줌 대상 inner */}
                <Box
                  className="proj-img-inner"
                  sx={{
                    width:  '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    willChange:  'transform',
                    transition:  'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  <Typography variant="h5" sx={{ color: colors.textMuted, opacity: 0.5 }}>🖼️</Typography>
                </Box>

                {/* 호버 오버레이 (슬라이드 업) */}
                <Box
                  className="proj-overlay"
                  sx={{
                    position:  'absolute',
                    inset:     0,
                    bgcolor:   'rgba(26,26,26,0.72)',
                    display:   'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap:        1,
                    opacity:    0,
                    transform:  'translateY(8px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#F8F8F6' }}>
                    자세히 보기
                  </Typography>
                  <Box sx={{ width: 24, height: '1px', bgcolor: colors.primary }} />
                </Box>
              </Box>

              <CardContent sx={{ p: 2.5 }}>
                <Typography
                  className="proj-title"
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ color: colors.textPrimary, mb: 0.5, transition: 'color 0.25s ease' }}
                >
                  {p.title}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  {p.desc}
                </Typography>
              </CardContent>
            </Card>
            </Box>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/projects')}
            aria-label="전체 프로젝트 목록 보기"
            sx={{ borderColor: colors.primary, color: colors.primary, px: 5, py: 1.5, '&:hover': { bgcolor: `${colors.primary}08`, borderColor: colors.primaryDark } }}
          >
            전체 프로젝트 보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// ─── 5. Contact 섹션 ──────────────────────────────────────────────────────────
function ContactSection() {
  const { ref: ctcRef, visible: ctcVisible } = useReveal({ threshold: 0.1 });
  return (
    <Box id="contact-section" component="section" aria-label="연락하기 섹션" sx={{ py: 10, bgcolor: colors.bgTertiary, borderTop: `1px solid ${colors.border}` }}>
      <Container maxWidth="md" ref={ctcRef}>
        <Box sx={{
          opacity:    ctcVisible ? 1 : 0,
          transform:  ctcVisible ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          willChange: 'opacity, transform',
        }}>
          <SectionHeader
            label="CONTACT"
            title="연락하기"
            subtitle="연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다."
          />
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          gap: 3,
          opacity:    ctcVisible ? 1 : 0,
          transform:  ctcVisible ? 'translate3d(0,0,0)' : 'translate3d(0,24px,0)',
          transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          willChange: 'opacity, transform',
        }}>
          <Card sx={{ borderRadius: 3, boxShadow: colors.shadowCard, border: `1px solid ${colors.border}` }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'inline-block', bgcolor: `${colors.warning}25`, border: `1px solid ${colors.warning}60`, borderRadius: 6, px: 2, py: 0.5, mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#8B6914', fontWeight: 700, letterSpacing: 2 }}>
                  CONTACT SECTION
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.9 }}>
                여기는 <strong style={{ color: colors.textPrimary }}>Contact 섹션</strong>입니다.
                <br /><br />
                연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다.
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['📧 email@example.com', '🐙 github.com/username', '💼 linkedin.com/in/username'].map((item) => (
                  <Typography key={item} variant="body2" sx={{ color: colors.textSecondary }}>{item}</Typography>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: colors.shadowCard, border: `1px solid ${colors.border}` }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: colors.textPrimary, mb: 3 }}>
                메시지 보내기
              </Typography>
              {['이름', '이메일', '메시지'].map((field) => (
                <Box
                  key={field}
                  sx={{ mb: 2, height: field === '메시지' ? 100 : 44, bgcolor: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: 2, display: 'flex', alignItems: field === '메시지' ? 'flex-start' : 'center', px: 2, pt: field === '메시지' ? 1.5 : 0 }}
                >
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    {field} 입력 폼이 들어갈 예정입니다.
                  </Typography>
                </Box>
              ))}
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: colors.primary, py: 1.5, mt: 1, '&:hover': { bgcolor: colors.buttonHover } }}
              >
                전송하기
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Home 페이지 ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Box component="main">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </Box>
  );
}
