import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { colors } from '../theme';

export default function About() {
  return (
    <Box sx={{ minHeight: '80vh', py: 10, bgcolor: colors.bgPrimary }}>
      <Container maxWidth="md">
        {/* 페이지 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 3, fontSize: 13 }}
          >
            ABOUT ME
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ color: colors.textPrimary, mt: 0.5 }}>
            자기소개
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              bgcolor: colors.primary,
              borderRadius: 2,
              mx: 'auto',
              mt: 2,
            }}
          />
        </Box>

        {/* 안내 카드 */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: colors.shadowModal,
            border: `2px dashed ${colors.primary}50`,
            bgcolor: colors.bgSecondary,
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: `${colors.primary}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Typography fontSize={36}>👤</Typography>
            </Box>

            <Typography variant="h5" fontWeight="bold" sx={{ color: colors.textPrimary, mb: 2 }}>
              About Me 페이지
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: colors.textSecondary, lineHeight: 1.9, maxWidth: 480, mx: 'auto', mb: 4 }}
            >
              <strong style={{ color: colors.primary }}>About Me 페이지</strong>가 개발될 공간입니다.
              <br />
              상세한 자기소개가 들어갈 예정입니다.
            </Typography>

            <Box
              sx={{
                display: 'inline-block',
                bgcolor: `${colors.primary}12`,
                border: `1px solid ${colors.primary}40`,
                borderRadius: 2,
                px: 3,
                py: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.textBrand, fontWeight: 600 }}>
                🚧 개발 예정 — 학력, 경력, 수상 내역 등이 추가됩니다.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
