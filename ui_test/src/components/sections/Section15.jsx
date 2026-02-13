import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SectionWrapper from './SectionWrapper';

const hoverCards = [
  {
    id: 'scale',
    label: 'Scale Up',
    description: '크기가 커집니다',
    base: { backgroundColor: '#1976d2', color: 'white' },
    hover: { transform: 'scale(1.1)', boxShadow: 8 },
  },
  {
    id: 'shadow',
    label: 'Shadow Lift',
    description: '그림자가 깊어집니다',
    base: { backgroundColor: '#ffffff', border: '1px solid #e0e0e0' },
    hover: { boxShadow: '0 12px 28px rgba(0,0,0,0.2)', transform: 'translateY(-6px)' },
  },
  {
    id: 'color',
    label: 'Color Shift',
    description: '배경색이 변합니다',
    base: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
    hover: { backgroundColor: '#2e7d32', color: '#ffffff' },
  },
  {
    id: 'border',
    label: 'Border Glow',
    description: '테두리가 빛납니다',
    base: { backgroundColor: '#fff', border: '2px solid #9c27b0' },
    hover: { boxShadow: '0 0 16px rgba(156,39,176,0.5)', transform: 'scale(1.03)' },
  },
  {
    id: 'rotate',
    label: 'Tilt',
    description: '살짝 기울어집니다',
    base: { backgroundColor: '#fff3e0', color: '#e65100' },
    hover: { transform: 'rotate(-3deg) scale(1.05)', boxShadow: 6 },
  },
  {
    id: 'invert',
    label: 'Invert',
    description: '색상이 반전됩니다',
    base: { backgroundColor: '#212121', color: '#fafafa' },
    hover: { backgroundColor: '#fafafa', color: '#212121', border: '2px solid #212121' },
  },
  {
    id: 'blur-bg',
    label: 'Bright Glow',
    description: '밝게 빛납니다',
    base: { backgroundColor: '#0d47a1', color: 'white' },
    hover: { backgroundColor: '#42a5f5', boxShadow: '0 0 24px rgba(66,165,245,0.6)', transform: 'scale(1.05)' },
  },
  {
    id: 'shrink',
    label: 'Press Down',
    description: '눌리는 효과입니다',
    base: { backgroundColor: '#fce4ec', color: '#c62828', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
    hover: { transform: 'scale(0.95)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' },
  },
];

function Section15() {
  return (
    <SectionWrapper
      title="15. Hover Effects"
      subtitle="각 카드에 마우스를 올려 다양한 호버 효과를 확인하세요."
    >
      <Grid container spacing={3}>
        {hoverCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.id}>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                ...card.base,
                '&:hover': {
                  ...card.hover,
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {card.label}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {card.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
}

export default Section15;
