import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SectionWrapper from './SectionWrapper';

const slides = [
  { id: 1, title: 'React', subtitle: '사용자 인터페이스 라이브러리', bg: 'linear-gradient(135deg, #61dafb 0%, #21a1f1 100%)' },
  { id: 2, title: 'Material UI', subtitle: 'React UI 프레임워크', bg: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' },
  { id: 3, title: 'Vite', subtitle: '차세대 빌드 도구', bg: 'linear-gradient(135deg, #646cff 0%, #535bf2 100%)' },
  { id: 4, title: 'TypeScript', subtitle: '타입 안전한 JavaScript', bg: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)' },
  { id: 5, title: 'Next.js', subtitle: 'React 풀스택 프레임워크', bg: 'linear-gradient(135deg, #111111 0%, #333333 100%)' },
];

function Section16() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(null);

  const goTo = (index) => {
    if (index < 0 || index >= slides.length) return;
    setDirection(index > current ? 'left' : 'right');
    setCurrent(index);
  };

  const goPrev = () => goTo(current - 1);
  const goNext = () => goTo(current + 1);

  const handlers = useSwipeable({
    onSwipedLeft: () => goNext(),
    onSwipedRight: () => goPrev(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <SectionWrapper
      title="16. Swipe"
      subtitle="좌우로 스와이프하거나 버튼을 클릭하여 슬라이드를 넘기세요."
      even
    >
      {/* 슬라이더 */}
      <Box
        {...handlers}
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          userSelect: 'none',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        {/* 슬라이드 영역 */}
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <Box
              key={slide.id}
              sx={{
                minWidth: '100%',
                height: 300,
                background: slide.bg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {slide.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.85 }}>
                {slide.subtitle}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* 이전/다음 버튼 */}
        <IconButton
          onClick={goPrev}
          disabled={current === 0}
          sx={{
            position: 'absolute',
            top: '50%',
            left: 8,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' },
            '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
          }}
        >
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={goNext}
          disabled={current === slides.length - 1}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 8,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' },
            '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
          }}
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* 인디케이터 */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
        {slides.map((slide, idx) => (
          <Box
            key={slide.id}
            onClick={() => goTo(idx)}
            sx={{
              width: idx === current ? 28 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: idx === current ? 'primary.main' : '#bdbdbd',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </Stack>

      {/* 슬라이드 번호 */}
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
        {current + 1} / {slides.length}
      </Typography>
    </SectionWrapper>
  );
}

export default Section16;
