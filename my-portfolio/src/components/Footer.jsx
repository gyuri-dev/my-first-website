import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { colors } from '../theme';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.bgTertiary,
        borderTop: `1px solid ${colors.border}`,
        py: 4,
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="body2" sx={{ color: colors.textMuted }}>
        © 2026 My Portfolio. Built with React + MUI.
      </Typography>
      <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block', mt: 0.5 }}>
        Color System based on Dunkin' Design Palette
      </Typography>
    </Box>
  );
}
