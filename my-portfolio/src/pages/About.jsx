import { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../theme';

// ─── 카운트업 훅 ──────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1400, trigger = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!trigger || target === 0) { setCount(0); return; }
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, trigger]);
  return count;
}

// ─── 원형 프로그래스 (SVG) ────────────────────────────────────────────────────
function SkillCircle({ skill, catColor, trigger }) {
  const cfg = getIcon(skill.icon, skill.name);
  const count = useCountUp(skill.level, 1200, trigger);
  const R   = 36;
  const C   = 2 * Math.PI * R;
  const offset = C - (count / 100) * C;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ position: 'relative', width: 96, height: 96 }}>
        <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
          {/* 배경 원 */}
          <circle cx="48" cy="48" r={R} fill="none" stroke={colors.border} strokeWidth="5" />
          {/* 프로그래스 원 */}
          <circle
            cx="48" cy="48" r={R} fill="none"
            stroke={catColor} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        {/* 중앙 아이콘 */}
        <Box sx={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 0.3,
        }}>
          <Box sx={{ width: 26, height: 26, bgcolor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 9, fontWeight: 700, color: cfg.text, lineHeight: 1 }}>
              {cfg.symbol}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 700, color: catColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {count}%
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 600, color: colors.textPrimary, textAlign: 'center' }}>
        {skill.name}
      </Typography>
    </Box>
  );
}

// ─── 스킬 바 행 ───────────────────────────────────────────────────────────────
function SkillBarRow({ skill, catColor, trigger, delay = 0 }) {
  const cfg = getIcon(skill.icon, skill.name);
  const count = useCountUp(skill.level, 1200, trigger);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5,
      opacity: trigger ? 1 : 0, transform: trigger ? 'translateX(0)' : 'translateX(-16px)',
      transition: `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`,
    }}>
      {/* 아이콘 */}
      <Box sx={{ width: 32, height: 32, bgcolor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 700, color: cfg.text, lineHeight: 1 }}>
          {cfg.symbol}
        </Typography>
      </Box>
      {/* 이름 */}
      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: colors.textPrimary, minWidth: 90, flexShrink: 0 }}>
        {skill.name}
      </Typography>
      {/* 바 */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Box sx={{ height: 5, bgcolor: colors.border, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${count}%`,
            background: `linear-gradient(90deg, ${catColor}aa, ${catColor})`,
            transition: 'width 0.05s linear',
          }} />
        </Box>
      </Box>
      {/* 퍼센트 */}
      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 700, color: catColor, minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {count}%
      </Typography>
    </Box>
  );
}

// ─── 스킬 스켈레톤 UI ─────────────────────────────────────────────────────────
function SkillSkeleton() {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
      gap: 2,
      '@keyframes shimmer': {
        '0%':   { backgroundPosition: '-400px 0' },
        '100%': { backgroundPosition: '400px 0'  },
      },
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i} sx={{
          height: 120,
          background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.bgSecondary} 50%, ${colors.bgTertiary} 75%)`,
          backgroundSize: '800px 100%',
          animation: 'shimmer 1.4s infinite linear',
          border: `1px solid ${colors.border}`,
        }} />
      ))}
    </Box>
  );
}

// ─── 카테고리 설정 ────────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  Frontend:  { color: '#3B7DD8', label: 'FRONTEND'  },
  Framework: { color: '#C8A97E', label: 'FRAMEWORK' },
  Design:    { color: '#6E8B74', label: 'DESIGN'    },
  Backend:   { color: '#8B6DB0', label: 'BACKEND'   },
  Tool:      { color: '#888888', label: 'TOOL'       },
};

// ─── 아이콘 맵 ────────────────────────────────────────────────────────────────
const ICON_MAP = {
  html:  { symbol: 'H',   bg: '#E44D26', text: '#FFF'     },
  css:   { symbol: 'C',   bg: '#264DE4', text: '#FFF'     },
  js:    { symbol: 'JS',  bg: '#F0DB4F', text: '#1A1A1A'  },
  react: { symbol: '⚛',  bg: '#20232A', text: '#61DAFB'  },
  figma: { symbol: 'Fg',  bg: '#A259FF', text: '#FFF'     },
  ts:    { symbol: 'TS',  bg: '#3178C6', text: '#FFF'     },
  java:  { symbol: 'Jv',  bg: '#ED8B00', text: '#FFF'     },
  git:   { symbol: 'G',   bg: '#F05032', text: '#FFF'     },
};
const getIcon = (key, name) =>
  ICON_MAP[key] ?? { symbol: name.slice(0, 2).toUpperCase(), bg: '#C8A97E', text: '#FFF' };

// ─── 빠른 추가 추천 스킬 ─────────────────────────────────────────────────────
const SUGGESTED_SKILLS = [
  { name: 'TypeScript', category: 'Frontend', icon: 'ts',   level: 50 },
  { name: 'Java',       category: 'Backend',  icon: 'java', level: 50 },
  { name: 'Git',        category: 'Tool',     icon: 'git',  level: 60 },
];

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG);
const EMPTY_FORM = { name: '', category: 'Frontend', icon: '', level: 60, showInMain: false };

// ─── 공통: 섹션 레이블 ────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        fontFamily: '"Inter", sans-serif',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 4,
        color: colors.textMuted,
        mb: 6,
      }}
    >
      {children}
    </Typography>
  );
}

// ─── 1. 프로필 섹션 ───────────────────────────────────────────────────────────
function ProfileSection({ basicInfo, onPhotoChange }) {
  const fileRef = useRef(null);

  const infoItems = [
    { label: 'EDUCATION',  value: basicInfo.education  },
    { label: 'MAJOR',      value: basicInfo.major      },
    { label: 'EXPERIENCE', value: basicInfo.experience },
  ];

  return (
    <Box
      sx={{
        bgcolor: colors.bgPrimary,
        borderBottom: `1px solid ${colors.border}`,
        pt: { xs: 12, md: 14 },
        pb: { xs: 8, md: 10 },
        px: { xs: 3, sm: 6, md: 10, lg: 16 },
      }}
    >
      <SectionLabel>02 &nbsp;/&nbsp; ABOUT &nbsp;{basicInfo.name}</SectionLabel>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: { xs: 5, md: 8 },
        }}
      >
        {/* 프로필 사진 */}
        <Box sx={{ flexShrink: 0 }}>
          <Box
            onClick={() => fileRef.current?.click()}
            sx={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `1px solid ${colors.border}`,
              bgcolor: colors.bgTertiary,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'border-color 0.2s',
              '&:hover': { borderColor: colors.primary },
              '&:hover .photo-overlay': { opacity: 1 },
            }}
          >
            {basicInfo.photo ? (
              <>
                <img
                  src={basicInfo.photo}
                  alt="프로필"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                  className="photo-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(26,26,26,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, color: colors.bgPrimary, letterSpacing: 1 }}>
                    변경하기
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: 28, mb: 1, lineHeight: 1 }}>📷</Typography>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, color: colors.textMuted, letterSpacing: 1 }}>
                  사진 업로드
                </Typography>
              </>
            )}
          </Box>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhotoChange} />
        </Box>

        {/* 텍스트 정보 */}
        <Box sx={{ flex: 1, width: '100%', textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Playfair Display", "Noto Serif KR", serif',
              fontSize: { xs: '2.2rem', md: '2.8rem', lg: '3.4rem' },
              fontWeight: 700,
              color: colors.textPrimary,
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            {basicInfo.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Box sx={{ width: 28, height: '1px', bgcolor: colors.primary, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: colors.textMuted }}>
              WEB DESIGNER
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, border: `1px solid ${colors.border}` }}>
            {infoItems.map((item, i) => (
              <Box
                key={item.label}
                sx={{
                  flex: 1,
                  p: { xs: 2.5, md: 3 },
                  bgcolor: colors.bgSecondary,
                  borderRight:   { sm: i < infoItems.length - 1 ? `1px solid ${colors.border}` : 'none' },
                  borderBottom:  { xs: i < infoItems.length - 1 ? `1px solid ${colors.border}` : 'none', sm: 'none' },
                  textAlign: 'left',
                }}
              >
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: colors.textMuted, mb: 1 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: { xs: 12, md: 13 }, fontWeight: 500, color: colors.textPrimary, lineHeight: 1.5 }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── 2. 개발 스토리 콘텐츠 ───────────────────────────────────────────────────
function DevStoryContent({ content }) {
  return (
    <Box>
      <Typography sx={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif', fontSize: { xs: '1.35rem', md: '1.65rem' }, fontWeight: 700, color: colors.textPrimary, mb: 5, lineHeight: 1.3 }}>
        나의 개발 스토리
      </Typography>
      <Box sx={{ borderLeft: `2px solid ${colors.primary}`, pl: 4, py: 0.5, mb: 4 }}>
        <Typography sx={{ fontFamily: '"Noto Serif KR", serif', fontSize: { xs: 15, md: 16 }, color: colors.textSecondary, lineHeight: 2, wordBreak: 'keep-all' }}>
          {content}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 5 }}>
        {['웹디자인', '코딩', '개발 학습 중'].map((tag) => (
          <Box key={tag} sx={{ px: 2, py: 0.7, border: `1px solid ${colors.border}`, bgcolor: colors.bgSecondary }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, letterSpacing: 1, color: colors.textMuted }}>
              {tag}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── 3. 개발 철학 콘텐츠 ─────────────────────────────────────────────────────
function PhilosophyContent({ content }) {
  const philosophies = content.split(',').map((s) => s.trim());
  return (
    <Box>
      <Typography sx={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif', fontSize: { xs: '1.35rem', md: '1.65rem' }, fontWeight: 700, color: colors.textPrimary, mb: 5, lineHeight: 1.3 }}>
        개발 철학
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {philosophies.map((text, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3.5, p: { xs: 2.5, md: 3.5 }, bgcolor: colors.bgSecondary, border: `1px solid ${colors.border}`, transition: 'border-color 0.2s', '&:hover': { borderColor: colors.primary } }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 700, color: colors.primary, letterSpacing: 1, flexShrink: 0, pt: '3px', minWidth: 20 }}>
              {String(i + 1).padStart(2, '0')}
            </Typography>
            <Typography sx={{ fontFamily: '"Noto Serif KR", serif', fontSize: { xs: 14, md: 15 }, color: colors.textPrimary, lineHeight: 1.9, wordBreak: 'keep-all' }}>
              {text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── 4. 개인적인 이야기 콘텐츠 ───────────────────────────────────────────────
function PersonalContent({ content }) {
  const paragraphs = content.split('\n').filter(Boolean);
  return (
    <Box>
      <Typography sx={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif', fontSize: { xs: '1.35rem', md: '1.65rem' }, fontWeight: 700, color: colors.textPrimary, mb: 5, lineHeight: 1.3 }}>
        개인적인 이야기
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 6 }}>
        {paragraphs.map((para, i) => (
          <Typography key={i} sx={{ fontFamily: '"Noto Serif KR", serif', fontSize: { xs: 14, md: 15 }, color: colors.textSecondary, lineHeight: 2, wordBreak: 'keep-all' }}>
            {para}
          </Typography>
        ))}
      </Box>
      <Box sx={{ pt: 4, borderTop: `1px solid ${colors.border}` }}>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: 2.5, color: colors.textMuted, mb: 2 }}>
          HOBBIES
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {['영화 감상', '다이어리 꾸미기', '혼자만의 시간'].map((hobby) => (
            <Box key={hobby} sx={{ px: 2, py: 0.8, border: `1px solid ${colors.border}`, bgcolor: colors.bgSecondary }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, letterSpacing: 1, color: colors.textMuted }}>
                {hobby}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─── 5. 콘텐츠 탭 섹션 ───────────────────────────────────────────────────────
function ContentSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0);
  const active = sections[activeTab];

  return (
    <Box sx={{ bgcolor: colors.bgPrimary, px: { xs: 3, sm: 6, md: 10, lg: 16 }, py: { xs: 8, md: 10 } }}>
      <SectionLabel>STORIES</SectionLabel>

      <Box sx={{ borderBottom: `1px solid ${colors.border}`, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            '& .MuiTabs-indicator': { bgcolor: colors.primary, height: '1px' },
            '& .MuiTab-root': {
              fontFamily: '"Inter", sans-serif',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 0.3,
              color: colors.textMuted,
              textTransform: 'none',
              minHeight: 52,
              px: 0,
              mr: { xs: 3, md: 5 },
              '&.Mui-selected': { color: colors.textPrimary, fontWeight: 600 },
            },
          }}
        >
          {sections.map((section) => (
            <Tab
              key={section.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <span>{section.title}</span>
                  {section.showInHome && (
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: colors.primary, flexShrink: 0, mb: '1px' }} />
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 8 }}>
        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: colors.primary, flexShrink: 0 }} />
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: colors.textMuted, letterSpacing: 0.5 }}>
          홈 화면에 표시되는 섹션
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 720 }}>
        {active.id === 'dev-story'  && <DevStoryContent  content={active.content} />}
        {active.id === 'philosophy' && <PhilosophyContent content={active.content} />}
        {active.id === 'personal'   && <PersonalContent  content={active.content} />}
      </Box>
    </Box>
  );
}

// ─── 6. 스킬 아이콘 ───────────────────────────────────────────────────────────
function SkillIcon({ iconKey, name, size = 38 }) {
  const cfg = getIcon(iconKey, name);
  return (
    <Box
      sx={{
        width: size,
        height: size,
        bgcolor: cfg.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: size * 0.3, fontWeight: 700, color: cfg.text, lineHeight: 1 }}>
        {cfg.symbol}
      </Typography>
    </Box>
  );
}


// ─── 8. 스킬 카드 (플립 카드) ────────────────────────────────────────────────
function SkillCard({ skill, catColor, animated, onToggleMain, onDelete }) {
  const cfg = getIcon(skill.icon, skill.name);

  return (
    <Box
      sx={{
        perspective: '1000px',
        height: 190,
        cursor: 'pointer',
        '&:hover .flip-inner': {
          transform: 'rotateY(180deg)',
        },
      }}
    >
      <Box
        className="flip-inner"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* ── 앞면 ── */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            bgcolor: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            p: 3,
          }}
        >
          {/* 아이콘 */}
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: cfg.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 0.5,
            }}
          >
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 22, fontWeight: 700, color: cfg.text, lineHeight: 1 }}>
              {cfg.symbol}
            </Typography>
          </Box>

          {/* 이름 */}
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 600, color: colors.textPrimary, textAlign: 'center' }}>
            {skill.name}
          </Typography>

          {/* 카테고리 뱃지 */}
          <Box sx={{ px: 1.5, py: 0.4, bgcolor: `${catColor}20`, border: `1px solid ${catColor}50` }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 700, color: catColor, letterSpacing: 1.5 }}>
              {skill.category.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        {/* ── 뒷면 ── */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            bgcolor: colors.bgSecondary,
            border: `1px solid ${catColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            p: 3,
          }}
        >
          {/* 아이콘 */}
          <Box sx={{ width: 56, height: 56, bgcolor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 20, fontWeight: 700, color: cfg.text, lineHeight: 1 }}>
              {cfg.symbol}
            </Typography>
          </Box>

          {/* 스킬 이름 */}
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 700, color: colors.textPrimary, textAlign: 'center' }}>
            {skill.name}
          </Typography>

          {/* 구분선 */}
          <Box sx={{ width: 32, height: '1px', bgcolor: catColor }} />

          {/* 카테고리 */}
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 700, color: catColor, letterSpacing: 2 }}>
            {skill.category.toUpperCase()}
          </Typography>

          {/* 별 / 삭제 버튼 */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
            <Tooltip title={skill.showInMain ? '홈에 표시 중 (클릭하여 해제)' : '홈에 표시 안 함 (클릭하여 추가)'} placement="top">
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onToggleMain(skill.id); }}
                sx={{
                  color: skill.showInMain ? '#C8A97E' : colors.border,
                  transition: 'color 0.2s',
                  '&:hover': { color: '#C8A97E', bgcolor: 'transparent' },
                }}
              >
                {skill.showInMain ? <StarIcon sx={{ fontSize: 16 }} /> : <StarBorderIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onDelete(skill.id); }}
              sx={{
                color: colors.textMuted,
                '&:hover': { color: '#E53935', bgcolor: 'transparent' },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── 9. 스킬 추가 다이얼로그 ──────────────────────────────────────────────────
function AddSkillDialog({ open, onClose, onAdd, existingNames }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const handleSuggest = (s) => {
    setForm({ name: s.name, category: s.category, icon: s.icon, level: s.level, showInMain: false });
    setError('');
  };

  const handleSubmit = () => {
    const trimmed = form.name.trim();
    if (!trimmed) { setError('스킬 이름을 입력해주세요.'); return; }
    if (existingNames.includes(trimmed.toLowerCase())) { setError('이미 추가된 스킬입니다.'); return; }
    onAdd({
      id: Date.now(),
      icon: form.icon || trimmed.slice(0, 2).toLowerCase(),
      name: trimmed,
      level: form.level,
      category: form.category,
      showInMain: form.showInMain,
    });
    setForm(EMPTY_FORM);
    setError('');
    onClose();
  };

  const handleClose = () => { setForm(EMPTY_FORM); setError(''); onClose(); };

  const availableSuggestions = SUGGESTED_SKILLS.filter(
    (s) => !existingNames.includes(s.name.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: 0,
          boxShadow: colors.shadowModal,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>
            스킬 추가
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: colors.textMuted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* 빠른 추가 추천 */}
        {availableSuggestions.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: 2, color: colors.textMuted, mb: 1.5 }}>
              빠른 추가
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {availableSuggestions.map((s) => (
                <Box
                  key={s.name}
                  onClick={() => handleSuggest(s)}
                  sx={{
                    px: 1.8,
                    py: 0.6,
                    border: `1px solid ${colors.border}`,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: colors.primary },
                  }}
                >
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: colors.textSecondary }}>
                    + {s.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* 스킬 이름 */}
        <TextField
          fullWidth
          label="스킬 이름"
          value={form.name}
          onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(''); }}
          error={!!error}
          helperText={error}
          size="small"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
        />

        {/* 카테고리 선택 */}
        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel>카테고리</InputLabel>
          <Select
            value={form.category}
            label="카테고리"
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            sx={{ borderRadius: 0 }}
          >
            {ALL_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: CATEGORY_CONFIG[cat].color, flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 13 }}>{cat}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 숙련도 슬라이더 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: colors.textSecondary }}>숙련도</Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 600, color: colors.primary }}>
              {form.level}%
            </Typography>
          </Box>
          <Slider
            value={form.level}
            onChange={(_, v) => setForm((p) => ({ ...p, level: v }))}
            min={10}
            max={100}
            step={5}
            sx={{
              color: colors.primary,
              '& .MuiSlider-thumb': { borderRadius: 0, width: 12, height: 12 },
              '& .MuiSlider-track': { borderRadius: 0 },
              '& .MuiSlider-rail': { borderRadius: 0, bgcolor: colors.border },
            }}
          />
        </Box>

        {/* 홈 표시 여부 */}
        <FormControlLabel
          control={
            <Switch
              checked={form.showInMain}
              onChange={(e) => setForm((p) => ({ ...p, showInMain: e.target.checked }))}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: colors.primary },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: colors.primary },
              }}
            />
          }
          label={
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: colors.textSecondary }}>
              홈 화면에 표시
            </Typography>
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: colors.textMuted, border: `1px solid ${colors.border}`, borderRadius: 0, px: 3 }}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disableElevation
          sx={{ fontFamily: '"Inter", sans-serif', fontSize: 13, bgcolor: '#1A1A1A', color: '#F8F8F6', borderRadius: 0, px: 3, '&:hover': { bgcolor: colors.primary } }}
        >
          추가하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── 10. 스킬 섹션 ────────────────────────────────────────────────────────────
const CTRL_BTN = (active) => ({
  px: 2, py: 0.6,
  border: `1px solid ${active ? '#1A1A1A' : colors.border}`,
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  '&:hover': { borderColor: '#1A1A1A' },
});

const TOP_N_OPTIONS = [
  { label: '전체',   value: null },
  { label: '상위 3', value: 3    },
  { label: '상위 5', value: 5    },
];

function SkillsSection({ skills, onToggleMain, onAddSkill, onDeleteSkill }) {
  const sectionRef = useRef(null);
  const [animated,    setAnimated]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [view,        setView]        = useState('card');  // 'card' | 'bar'
  const [dialogOpen,  setDialogOpen]  = useState(false);
  const [sortByLevel, setSortByLevel] = useState(false);
  const [topN,        setTopN]        = useState(null);

  // 로딩 스켈레톤 → 실제 콘텐츠 전환 (900ms)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // 뷰포트 진입 시 애니메이션 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 정렬 및 필터 적용
  const sorted  = useMemo(() => [...skills].sort((a, b) => b.level - a.level), [skills]);
  const display = useMemo(() => {
    let list = sortByLevel ? sorted : [...skills];
    if (topN !== null) list = sorted.slice(0, topN);
    return list;
  }, [skills, sorted, sortByLevel, topN]);

  // 원형 프로그래스용 상위 3개
  const top3 = useMemo(() => sorted.slice(0, 3), [sorted]);

  // 카테고리별 그룹핑
  const grouped = useMemo(() => display.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}), [display]);

  const existingNames = skills.map((s) => s.name.toLowerCase());

  return (
    <Box
      ref={sectionRef}
      sx={{
        bgcolor: colors.bgTertiary,
        borderTop: `1px solid ${colors.border}`,
        px: { xs: 3, sm: 6, md: 10, lg: 16 },
        py: { xs: 8, md: 10 },
      }}
    >
      {/* ── 헤더: 레이블 + 뷰 토글 + 정렬 컨트롤 ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 7 }}>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: 4, color: colors.textMuted }}>
          SKILLS
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* 뷰 토글 */}
          <Box onClick={() => setView('card')} sx={CTRL_BTN(view === 'card')}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: view === 'card' ? 600 : 400, letterSpacing: 0.8, color: view === 'card' ? '#1A1A1A' : colors.textMuted }}>
              카드 뷰
            </Typography>
          </Box>
          <Box onClick={() => setView('bar')} sx={CTRL_BTN(view === 'bar')}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: view === 'bar' ? 600 : 400, letterSpacing: 0.8, color: view === 'bar' ? '#1A1A1A' : colors.textMuted }}>
              바 뷰
            </Typography>
          </Box>

          {/* 정렬 토글 */}
          <Box onClick={() => setSortByLevel((v) => !v)} sx={CTRL_BTN(sortByLevel)}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: sortByLevel ? 600 : 400, letterSpacing: 0.8, color: sortByLevel ? '#1A1A1A' : colors.textMuted }}>
              {sortByLevel ? '숙련도순' : '기본순'}
            </Typography>
          </Box>

          {/* Top N 필터 */}
          {TOP_N_OPTIONS.map(({ label, value }) => (
            <Box key={String(value)} onClick={() => setTopN(value)} sx={CTRL_BTN(topN === value)}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: topN === value ? 600 : 400, letterSpacing: 0.8, color: topN === value ? '#1A1A1A' : colors.textMuted }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── 로딩 스켈레톤 ── */}
      {loading && <SkillSkeleton />}

      {/* ── 콘텐츠 (로딩 완료 후) ── */}
      {!loading && (
        <>
          {/* 원형 프로그래스 — 상위 3 스킬 */}
          <Box sx={{
            display: 'flex', gap: { xs: 3, sm: 5 }, justifyContent: 'center',
            mb: 7, flexWrap: 'wrap',
            opacity: animated ? 1 : 0, transition: 'opacity 0.6s ease 0.1s',
          }}>
            {top3.map((skill) => {
              const catColor = (CATEGORY_CONFIG[skill.category] ?? { color: '#888888' }).color;
              return (
                <SkillCircle key={skill.id} skill={skill} catColor={catColor} trigger={animated} />
              );
            })}
          </Box>

          {/* 구분선 */}
          <Box sx={{ height: '1px', bgcolor: colors.border, mb: 7 }} />

          {/* ── 카드 뷰 ── */}
          {view === 'card' && (
            Object.entries(grouped).map(([category, catSkills]) => {
              const cfg = CATEGORY_CONFIG[category] ?? { color: '#888888', label: category.toUpperCase() };
              return (
                <Box key={category} sx={{ mb: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 3, color: cfg.color }}>
                      {cfg.label}
                    </Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: colors.border }} />
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                    {catSkills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        catColor={cfg.color}
                        animated={animated}
                        onToggleMain={onToggleMain}
                        onDelete={onDeleteSkill}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })
          )}

          {/* ── 바 뷰 ── */}
          {view === 'bar' && (
            Object.entries(grouped).map(([category, catSkills]) => {
              const cfg = CATEGORY_CONFIG[category] ?? { color: '#888888', label: category.toUpperCase() };
              return (
                <Box key={category} sx={{ mb: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 3, color: cfg.color }}>
                      {cfg.label}
                    </Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: colors.border }} />
                  </Box>
                  <Box sx={{ bgcolor: colors.bgSecondary, border: `1px solid ${colors.border}`, px: { xs: 2, sm: 3 }, py: 1 }}>
                    {catSkills.map((skill, idx) => (
                      <Box key={skill.id} sx={{ borderBottom: idx < catSkills.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                        <SkillBarRow
                          skill={skill}
                          catColor={cfg.color}
                          trigger={animated}
                          delay={idx * 0.08}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })
          )}
        </>
      )}

      {/* ── 스킬 추가 버튼 ── */}
      {!loading && (
        <>
          <Box
            onClick={() => setDialogOpen(true)}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 3, py: 1.2, border: `1px solid ${colors.border}`,
              cursor: 'pointer', mt: 2, transition: 'border-color 0.2s',
              '&:hover': { borderColor: '#1A1A1A' },
            }}
          >
            <AddIcon sx={{ fontSize: 15, color: colors.textMuted }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, letterSpacing: 1, color: colors.textMuted }}>
              스킬 추가
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4 }}>
            <StarIcon sx={{ fontSize: 14, color: '#C8A97E' }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: colors.textMuted }}>
              홈 화면에 표시되는 스킬
            </Typography>
          </Box>
        </>
      )}

      <AddSkillDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={onAddSkill}
        existingNames={existingNames}
      />
    </Box>
  );
}

// ─── About 페이지 ──────────────────────────────────────────────────────────────
export default function About() {
  const { aboutData, updatePhoto, skills, toggleSkillMain, addSkill, deleteSkill } = usePortfolio();

  // 파일 선택 → URL 생성 후 context 업데이트
  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    updatePhoto(URL.createObjectURL(file));
  }, [updatePhoto]);

  return (
    <Box>
      <ProfileSection
        basicInfo={aboutData.basicInfo}
        onPhotoChange={handlePhotoChange}
      />
      <ContentSection sections={aboutData.sections} />
      <SkillsSection
        skills={skills}
        onToggleMain={toggleSkillMain}
        onAddSkill={addSkill}
        onDeleteSkill={deleteSkill}
      />
    </Box>
  );
}
