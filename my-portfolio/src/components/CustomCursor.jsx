/**
 * CustomCursor — 커스텀 커서 컴포넌트
 *
 * ┌ Dot   ─ 마우스 위치에 즉시 따라붙는 작은 점
 * ├ Ring  ─ lerp(선형 보간)으로 부드럽게 따라오는 링
 * ├ Trail ─ 이전 위치들을 시간차로 표시하는 흔적
 * └ Magnetic ─ [data-magnetic] 요소 근처에서 서로 끌어당기는 효과
 *
 * 마우스가 없는 터치 기기에서는 자동 비활성화
 */
import { useEffect, useRef, useState } from 'react';

// ── 설정값 ───────────────────────────────────────────────────────────────────
const TRAIL_LEN  = 10;   // 흔적 파티클 수
const RING_LERP  = 0.11; // 링 추적 속도 (0~1, 낮을수록 느리게 따라옴)

function lerp(a, b, t) { return a + (b - a) * t; }

// ── 기본 fixed 스타일 ─────────────────────────────────────────────────────────
const BASE_STYLE = {
  position:     'fixed',
  top:          0,
  left:         0,
  pointerEvents:'none',
  userSelect:   'none',
  willChange:   'transform',
};

export default function CustomCursor() {
  const [active, setActive] = useState(false);

  // DOM refs — React 렌더가 아닌 직접 DOM 조작으로 성능 최적화
  const dotEl    = useRef(null);
  const ringEl   = useRef(null);
  const trailEls = useRef([]);

  // 위치 / 상태 refs (setState 없이 RAF에서 직접 읽어 리렌더 최소화)
  const mouse   = useRef({ x: -400, y: -400 });
  const ringXY  = useRef({ x: -400, y: -400 });
  const trail   = useRef(
    Array.from({ length: TRAIL_LEN }, () => ({ x: -400, y: -400 }))
  );
  const vis     = useRef(false);
  const mode    = useRef('default'); // 'default' | 'pointer' | 'text'
  const pressed = useRef(false);
  const rafId   = useRef(null);

  useEffect(() => {
    // ── 터치/펜 기기 감지 → 비활성화 ─────────────────────────────────────────
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setActive(true);

    // ── 네이티브 커서 숨기기 ──────────────────────────────────────────────────
    const styleEl = document.createElement('style');
    styleEl.id = 'cc-hide';
    styleEl.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(styleEl);

    // ── 이벤트 핸들러 ────────────────────────────────────────────────────────
    const onMove = ({ clientX: x, clientY: y }) => {
      if (!vis.current) {
        // 첫 감지 시 ring / trail을 마우스 위치로 스냅
        ringXY.current = { x, y };
        trail.current.fill({ x, y });
        vis.current = true;
      }
      mouse.current = { x, y };
    };

    const onDocLeave = () => { vis.current = false; };
    const onDocEnter = () => { vis.current = true;  };

    const onDown = () => {
      pressed.current = true;
      spawnRipple(mouse.current.x, mouse.current.y);
    };
    const onUp = () => { pressed.current = false; };

    // 커서 모드 결정 — 상위 요소까지 확인
    const onOver = ({ target }) => {
      if (target.closest('button, a, [role="button"], [data-cursor="pointer"]')) {
        mode.current = 'pointer';
      } else if (target.closest('input, textarea, select, [contenteditable]')) {
        mode.current = 'text';
      } else {
        mode.current = 'default';
      }
    };

    // ── 자기장 효과: 이벤트 위임으로 처리 ────────────────────────────────────
    const onMagMove = ({ target, clientX: x, clientY: y }) => {
      const el = target.closest('[data-magnetic]');
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      // 커서→요소 중심 거리에 비례해 요소를 커서 쪽으로 살짝 당김
      el.style.transform  = `translate3d(${(x - cx) * 0.3}px,${(y - cy) * 0.3}px,0)`;
      el.style.transition = 'transform 0.08s linear';
    };

    const onMagOut = ({ target, relatedTarget }) => {
      const el = target.closest?.('[data-magnetic]');
      if (el && !el.contains(relatedTarget)) {
        // 마우스가 요소를 벗어나면 스프링 복귀
        el.style.transform  = 'translate3d(0,0,0)';
        el.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
      }
    };

    document.addEventListener('mousemove',  onMove,      { passive: true });
    document.addEventListener('mousemove',  onMagMove,   { passive: true });
    document.addEventListener('mouseover',  onOver,      { passive: true });
    document.addEventListener('mouseleave', onDocLeave,  { passive: true });
    document.addEventListener('mouseenter', onDocEnter,  { passive: true });
    document.addEventListener('mousedown',  onDown,      { passive: true });
    document.addEventListener('mouseup',    onUp,        { passive: true });
    document.addEventListener('mouseout',   onMagOut,    { passive: true });

    // ── RAF 애니메이션 루프 ────────────────────────────────────────────────────
    const tick = () => {
      const { x: mx, y: my } = mouse.current;

      // Ring: lerp 보간으로 마우스를 느리게 추적
      ringXY.current.x = lerp(ringXY.current.x, mx, RING_LERP);
      ringXY.current.y = lerp(ringXY.current.y, my, RING_LERP);
      const rx = ringXY.current.x;
      const ry = ringXY.current.y;

      // Trail: 원형 버퍼 대신 단순 shift (TRAIL_LEN ≤ 10이므로 충분히 빠름)
      for (let i = TRAIL_LEN - 1; i > 0; i--) trail.current[i] = trail.current[i - 1];
      trail.current[0] = { x: mx, y: my };

      const v = vis.current;
      const m = mode.current;
      const p = pressed.current;

      // ── Dot ──────────────────────────────────────────────────────────────
      const dot = dotEl.current;
      if (dot) {
        if (m === 'pointer') {
          // 버튼 위에서는 dot 숨김 (ring이 대신 강조)
          dot.style.opacity = '0';
        } else if (m === 'text') {
          dot.style.opacity      = v ? '1' : '0';
          dot.style.width        = '2px';
          dot.style.height       = '22px';
          dot.style.marginTop    = '-11px';
          dot.style.marginLeft   = '-1px';
          dot.style.borderRadius = '1px';
          dot.style.background   = '#FFFFFF';
          dot.style.transform    = `translate3d(${mx}px,${my}px,0)`;
        } else {
          dot.style.opacity      = v ? '1' : '0';
          dot.style.width        = '8px';
          dot.style.height       = '8px';
          dot.style.marginTop    = '-4px';
          dot.style.marginLeft   = '-4px';
          dot.style.borderRadius = '50%';
          dot.style.background   = '#FFFFFF';
          dot.style.transform    = `translate3d(${mx}px,${my}px,0)`;
        }
      }

      // ── Ring ─────────────────────────────────────────────────────────────
      const ring = ringEl.current;
      if (ring) {
        let w, h, bRadius, bColor, bgColor;
        const scale = p ? 0.7 : 1;

        if (m === 'pointer') {
          w = 54; h = 54;
          bRadius = '50%';
          bColor  = 'rgba(255,255,255,1)';
          bgColor = 'rgba(255,255,255,0.18)';
        } else if (m === 'text') {
          w = 2;  h = 32;
          bRadius = '2px';
          bColor  = 'transparent';
          bgColor = 'rgba(255,255,255,0.7)';
        } else {
          w = 36; h = 36;
          bRadius = '50%';
          bColor  = 'rgba(255,255,255,1)';
          bgColor = 'rgba(255,255,255,0.08)';
        }

        ring.style.transform       = `translate3d(${rx}px,${ry}px,0) scale(${scale})`;
        ring.style.opacity         = v ? '1' : '0';
        ring.style.width           = `${w}px`;
        ring.style.height          = `${h}px`;
        ring.style.marginTop       = `${-h / 2}px`;
        ring.style.marginLeft      = `${-w / 2}px`;
        ring.style.borderRadius    = bRadius;
        ring.style.borderColor     = bColor;
        ring.style.backgroundColor = bgColor;
      }

      // ── Trail ────────────────────────────────────────────────────────────
      trailEls.current.forEach((el, i) => {
        if (!el) return;
        const { x: tx, y: ty } = trail.current[i];
        // t: 1 = 가장 최근(현재 마우스), 0 = 가장 오래된 위치
        const t     = (TRAIL_LEN - 1 - i) / (TRAIL_LEN - 1);
        const sz    = Math.max(2, 7 * t);
        const opMax = m === 'pointer' ? 0.65 : 0.35;
        const op    = v ? opMax * t : 0;
        const color = 'rgba(255,255,255,0.9)';

        el.style.transform       = `translate3d(${tx}px,${ty}px,0)`;
        el.style.width           = `${sz}px`;
        el.style.height          = `${sz}px`;
        el.style.marginTop       = `${-sz / 2}px`;
        el.style.marginLeft      = `${-sz / 2}px`;
        el.style.opacity         = String(op);
        el.style.backgroundColor = color;
      });

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mousemove',  onMagMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseleave', onDocLeave);
      document.removeEventListener('mouseenter', onDocEnter);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseout',   onMagOut);
      document.getElementById('cc-hide')?.remove();
      // 자기장 요소 transform 초기화
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        el.style.transform  = '';
        el.style.transition = '';
      });
    };
  }, []);

  if (!active) return null;

  return (
    <>
      {/* ── Trail 파티클 (가장 뒤에 렌더) ── */}
      {Array.from({ length: TRAIL_LEN }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailEls.current[i] = el; }}
          aria-hidden="true"
          style={{
            ...BASE_STYLE,
            zIndex:          9995,
            borderRadius:    '50%',
            backgroundColor: 'rgba(255,255,255,0.6)',
            mixBlendMode:    'difference',
            transition:      'background-color 0.2s',
          }}
        />
      ))}

      {/* ── Ring (lerp 팔로워) ── */}
      <div
        ref={ringEl}
        aria-hidden="true"
        style={{
          ...BASE_STYLE,
          zIndex:          9997,
          width:           '36px',
          height:          '36px',
          marginTop:       '-18px',
          marginLeft:      '-18px',
          borderRadius:    '50%',
          border:          '1.5px solid rgba(255,255,255,1)',
          backgroundColor: 'rgba(255,255,255,0.08)',
          mixBlendMode:    'difference',
          // 위치(transform)는 transition 없이 RAF로 직접 제어 — 지연 없음
          // 크기/색상 변화만 transition 적용
          transition: [
            'width 0.38s cubic-bezier(0.34,1.56,0.64,1)',
            'height 0.38s cubic-bezier(0.34,1.56,0.64,1)',
            'margin 0.38s cubic-bezier(0.34,1.56,0.64,1)',
            'border-color 0.25s ease',
            'background-color 0.25s ease',
            'border-radius 0.22s ease',
            'opacity 0.3s ease',
          ].join(', '),
        }}
      />

      {/* ── Dot (즉시 추적) ── */}
      <div
        ref={dotEl}
        aria-hidden="true"
        style={{
          ...BASE_STYLE,
          zIndex:          9999,
          width:           '8px',
          height:          '8px',
          marginTop:       '-4px',
          marginLeft:      '-4px',
          borderRadius:    '50%',
          backgroundColor: '#FFFFFF',
          mixBlendMode:    'difference',
          transition:      [
            'width 0.2s ease',
            'height 0.2s ease',
            'margin 0.2s ease',
            'border-radius 0.2s ease',
            'background-color 0.2s ease',
            'opacity 0.3s ease',
          ].join(', '),
        }}
      />
    </>
  );
}

// ── 클릭 리플 — React 외부에서 생성/제거 (렌더 비용 없음) ────────────────────
function spawnRipple(x, y) {
  const SIZE = 52;
  const el   = document.createElement('div');
  Object.assign(el.style, {
    position:        'fixed',
    left:            `${x - SIZE / 2}px`,
    top:             `${y - SIZE / 2}px`,
    width:           `${SIZE}px`,
    height:          `${SIZE}px`,
    borderRadius:    '50%',
    border:          '1.5px solid rgba(255,255,255,0.9)',
    pointerEvents:   'none',
    zIndex:          '9996',
    mixBlendMode:    'difference',
    animation:       'cc-ripple 0.6s ease-out forwards',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 650);
}
