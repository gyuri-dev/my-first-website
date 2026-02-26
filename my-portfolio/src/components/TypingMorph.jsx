/**
 * TypingMorph — 타이핑 + 텍스트 모핑 컴포넌트
 *
 * ┌ 글자별 등장  ─ 각 글자가 tm-char-in 애니메이션으로 순차 진입
 * ├ 그라데이션   ─ 움직이는 골드 그라데이션 (tm-gradient, background-clip: text)
 * ├ 타이핑 리듬  ─ setTimeout으로 타이핑/삭제 속도 제어
 * └ 일시정지     ─ 마우스 오버 시 paused 상태로 전환, 리어브 시 재개
 *
 * CSS 클래스(keyframes)는 index.css에 정의되어 있음:
 *   tm-char-in | tm-gradient | tm-blink
 */
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';

// ── 설정 ──────────────────────────────────────────────────────────────────────
const WORDS     = ['개발자', '디자이너', '크리에이터'];
const TYPE_MS   = 115;   // 타이핑 속도 (ms/글자)
const DEL_MS    = 62;    // 삭제 속도 (ms/글자)
const FULL_WAIT = 2000;  // 완성 후 대기 (ms)
const NEXT_WAIT = 400;   // 다음 단어 전 대기 (ms)

export default function TypingMorph({ visible = true }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase,   setPhase]   = useState('idle');   // 'idle' | 'typing' | 'deleting'
  const [paused,  setPaused]  = useState(false);
  const timer = useRef(null);

  // visible 전환 시 타이핑 시작
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setPhase('typing'), 700);
    return () => clearTimeout(t);
  }, [visible]);

  // ── 타이핑/삭제 스테이트 머신 ───────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(timer.current);
    if (paused || phase === 'idle') return;

    const word = WORDS[wordIdx];

    if (phase === 'typing') {
      if (charIdx < word.length) {
        // 다음 글자 타이핑
        timer.current = setTimeout(() => setCharIdx(c => c + 1), TYPE_MS);
      } else {
        // 단어 완성 → 잠시 대기 후 삭제 시작
        timer.current = setTimeout(() => setPhase('deleting'), FULL_WAIT);
      }
    } else if (phase === 'deleting') {
      if (charIdx > 0) {
        // 뒤에서부터 한 글자 삭제
        timer.current = setTimeout(() => setCharIdx(c => c - 1), DEL_MS);
      } else {
        // 전부 삭제 → 다음 단어로
        timer.current = setTimeout(() => {
          setWordIdx(i => (i + 1) % WORDS.length);
          setPhase('typing');
        }, NEXT_WAIT);
      }
    }

    return () => clearTimeout(timer.current);
  }, [phase, charIdx, wordIdx, paused]);

  const word     = WORDS[wordIdx];
  const displayed = word.slice(0, charIdx);
  // 단어가 완성된 상태 (대기 중)
  const isFull   = phase === 'typing' && charIdx === word.length;

  return (
    <Box
      role="text"
      aria-label={`역할: ${word}`}
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        display:    'inline-flex',
        alignItems: 'baseline',
        gap:        { xs: 1.2, sm: 1.5 },
        flexWrap:   'wrap',
        cursor:     'default',
        userSelect: 'none',
      }}
    >
      {/* ── 접두 레이블 ── */}
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          fontFamily:    '"Inter", sans-serif',
          fontSize:      { xs: '0.65rem', sm: '0.72rem' },
          fontWeight:    700,
          letterSpacing: 2.8,
          // 일시정지 시 골드, 평상시 회색
          color:      paused ? '#C8A97E' : '#AAAAAA',
          transition: 'color 0.35s ease',
          alignSelf:  'center',
          minWidth:   '4.5em',  // 레이아웃 점프 방지
        }}
      >
        {paused ? 'PAUSED' : 'I\u00a0AM\u00a0A'}
      </Box>

      {/* ── 글자별 타이핑 텍스트 + 커서 ── */}
      <Box
        component="span"
        sx={{ display: 'inline-flex', alignItems: 'center', minWidth: '4ch' }}
      >
        {[...displayed].map((char, i) => (
          <Box
            // key: wordIdx가 바뀌면 새 요소 → 진입 애니메이션 재실행
            key={`${wordIdx}-${i}`}
            component="span"
            sx={{
              display:  'inline-block',
              fontFamily: '"Playfair Display", serif',
              fontSize:   { xs: '1.5rem', sm: '1.9rem', md: '2.4rem' },
              fontWeight: 700,
              lineHeight: 1.15,
              // ── 그라데이션 텍스트 (background-clip: text) ──
              background:           'linear-gradient(90deg,#C8A97E 0%,#F0D5A8 22%,#C8A97E 44%,#A8865A 66%,#DEC09B 88%,#C8A97E 100%)',
              backgroundSize:       '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
              // ── 글자 진입 애니메이션 + 그라데이션 흐름 ──
              animation: 'tm-char-in 0.30s cubic-bezier(0.34,1.56,0.64,1) both, tm-gradient 3.5s linear infinite',
              // 일시정지 시 흐림 처리
              filter:     paused ? 'blur(0.6px)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          >
            {char}
          </Box>
        ))}

        {/* ── 커서 바 ── */}
        <Box
          aria-hidden="true"
          component="span"
          sx={{
            display:       phase === 'idle' ? 'none' : 'inline-block',
            width:         { xs: '2px', sm: '2.5px' },
            height:        { xs: '1.3rem', sm: '1.65rem', md: '2.05rem' },
            bgcolor:       '#C8A97E',
            ml:            '3px',
            verticalAlign: 'middle',
            flexShrink:    0,
            // 완성 상태에서만 깜빡임, 삭제 중에는 반투명 고정
            animation:  (isFull && !paused) ? 'tm-blink 0.95s step-end infinite' : 'none',
            opacity:    phase === 'deleting' ? 0.4 : 1,
            transition: 'opacity 0.15s',
          }}
        />
      </Box>
    </Box>
  );
}
