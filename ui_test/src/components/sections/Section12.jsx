import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import Collapse from '@mui/material/Collapse';
import SectionWrapper from './SectionWrapper';

const transitions = [
  { id: 'fade', label: 'Fade', color: '#e3f2fd' },
  { id: 'grow', label: 'Grow', color: '#f3e5f5' },
  { id: 'slide', label: 'Slide', color: '#e8f5e9' },
  { id: 'zoom', label: 'Zoom', color: '#fff3e0' },
  { id: 'collapse', label: 'Collapse', color: '#fce4ec' },
];

const spinKeyframes = {
  '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
  '@keyframes bounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-20px)' },
  },
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.15)', opacity: 0.7 },
  },
};

const cssAnimations = [
  { id: 'spin', label: 'Spin', animation: 'spin 1.5s linear infinite', color: '#1976d2' },
  { id: 'bounce', label: 'Bounce', animation: 'bounce 0.8s ease infinite', color: '#9c27b0' },
  { id: 'pulse', label: 'Pulse', animation: 'pulse 1.2s ease infinite', color: '#d32f2f' },
];

function TransitionBox({ color, label }) {
  return (
    <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: color, minWidth: 140 }}>
      <Typography variant="subtitle1" fontWeight="bold">{label}</Typography>
    </Paper>
  );
}

function Section12() {
  const [show, setShow] = useState({});
  const [cssPlay, setCssPlay] = useState({});

  const toggle = (id) => setShow((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleAll = () => {
    const allVisible = transitions.every((t) => show[t.id]);
    const next = {};
    transitions.forEach((t) => { next[t.id] = !allVisible; });
    setShow(next);
  };

  const toggleCss = (id) => setCssPlay((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <SectionWrapper
      title="12. Animation"
      subtitle="MUI 트랜지션과 CSS 애니메이션 효과를 확인하세요."
      even
    >
      <Box sx={spinKeyframes}>
        {/* MUI 트랜지션 */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>MUI Transitions</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          {transitions.map((t) => (
            <Button key={t.id} variant={show[t.id] ? 'contained' : 'outlined'} size="small" onClick={() => toggle(t.id)}>
              {t.label}
            </Button>
          ))}
          <Button variant="outlined" color="secondary" size="small" onClick={toggleAll}>
            전체 토글
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ minHeight: 100, mb: 6 }}>
          <Fade in={!!show.fade} timeout={600}>
            <Box>{show.fade !== undefined && <TransitionBox color="#e3f2fd" label="Fade" />}</Box>
          </Fade>
          <Grow in={!!show.grow} timeout={600}>
            <Box>{show.grow !== undefined && <TransitionBox color="#f3e5f5" label="Grow" />}</Box>
          </Grow>
          <Slide direction="up" in={!!show.slide} timeout={600} mountOnEnter unmountOnExit>
            <Box><TransitionBox color="#e8f5e9" label="Slide" /></Box>
          </Slide>
          <Zoom in={!!show.zoom} timeout={600}>
            <Box>{show.zoom !== undefined && <TransitionBox color="#fff3e0" label="Zoom" />}</Box>
          </Zoom>
          <Collapse in={!!show.collapse} orientation="horizontal" timeout={600}>
            <TransitionBox color="#fce4ec" label="Collapse" />
          </Collapse>
        </Stack>

        {/* CSS 애니메이션 */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>CSS Animations</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {cssAnimations.map((a) => (
            <Button key={a.id} variant={cssPlay[a.id] ? 'contained' : 'outlined'} size="small" onClick={() => toggleCss(a.id)}>
              {a.label}
            </Button>
          ))}
        </Stack>

        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
          {cssAnimations.map((a) => (
            <Box
              key={a.id}
              sx={{
                width: 80,
                height: 80,
                borderRadius: a.id === 'spin' ? 1 : '50%',
                backgroundColor: a.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: cssPlay[a.id] ? a.animation : 'none',
                transition: 'background-color 0.3s',
              }}
            >
              <Typography variant="caption" color="white" fontWeight="bold">
                {a.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </SectionWrapper>
  );
}

export default Section12;
