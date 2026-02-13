import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function SectionWrapper({ title, subtitle, children, even = false }) {
  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: even ? '#ffffff' : '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {subtitle}
          </Typography>
        )}
        <Divider sx={{ mb: 4 }} />
        {children}
      </Container>
    </Box>
  );
}

export default SectionWrapper;
