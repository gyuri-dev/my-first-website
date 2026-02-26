import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — IntersectionObserver 기반 스크롤 등장 애니메이션 훅
 *
 * @param {object} options
 * @param {number}  threshold   가시성 임계값 (0~1)
 * @param {string}  rootMargin  IO rootMargin (아래 여백을 줘서 조금 일찍 트리거)
 * @param {boolean} once        true면 한 번만 트리거
 * @param {number}  delay       애니메이션 시작 지연(초)
 * @param {string}  direction   초기 방향: 'up' | 'down' | 'left' | 'right' | 'none'
 * @param {number}  distance    초기 이동 거리(px)
 * @param {number}  duration    애니메이션 지속 시간(초)
 *
 * @returns {{ ref, visible, sx }}
 *   - ref     : 관찰할 DOM 요소에 붙이는 React ref
 *   - visible : 현재 뷰포트 안에 있는지 여부
 *   - sx      : MUI sx prop에 바로 spread할 수 있는 스타일 객체
 */
export function useReveal({
  threshold  = 0.12,
  rootMargin = '0px 0px -32px 0px',
  once       = true,
  delay      = 0,
  direction  = 'up',
  distance   = 28,
  duration   = 0.7,
} = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  // 방향별 초기 transform
  const INIT = {
    up:    `translate3d(0,${distance}px,0)`,
    down:  `translate3d(0,-${distance}px,0)`,
    left:  `translate3d(${distance}px,0,0)`,
    right: `translate3d(-${distance}px,0,0)`,
    none:  'translate3d(0,0,0)',
  };

  const sx = {
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translate3d(0,0,0)' : (INIT[direction] ?? INIT.up),
    transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
    willChange: 'opacity, transform',
  };

  return { ref, visible, sx };
}

/**
 * useScrollProgress — 요소가 뷰포트를 통과하는 진행률 반환 (0→1)
 * 패럴렉스나 스크롤 기반 변형에 활용
 *
 * @returns {{ ref, progress }}
 */
export function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      const p    = 1 - rect.bottom / (vh + rect.height);
      setProgress(Math.max(0, Math.min(1, p)));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // 초기 계산
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { ref, progress };
}
