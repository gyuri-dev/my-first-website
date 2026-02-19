import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { colors } from '../theme';

export default function Projects() {
  return (
    <Box sx={{ minHeight: '80vh', py: 10, bgcolor: colors.bgPrimary }}>
      <Container maxWidth="lg">
        {/* 페이지 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 3, fontSize: 13 }}
          >
            PROJECTS
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ color: colors.textPrimary, mt: 0.5 }}>
            포트폴리오
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
            border: `2px dashed ${colors.secondary}50`,
            bgcolor: colors.bgSecondary,
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: `${colors.secondary}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Typography fontSize={36}>🗂️</Typography>
            </Box>

            <Typography variant="h5" fontWeight="bold" sx={{ color: colors.textPrimary, mb: 2 }}>
              Projects 페이지
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: colors.textSecondary, lineHeight: 1.9, maxWidth: 480, mx: 'auto', mb: 4 }}
            >
              <strong style={{ color: colors.secondary }}>Projects 페이지</strong>가 개발될 공간입니다.
              <br />
              포트폴리오 작품들이 들어갈 예정입니다.
            </Typography>

            <Box
              sx={{
                display: 'inline-block',
                bgcolor: `${colors.secondary}10`,
                border: `1px solid ${colors.secondary}40`,
                borderRadius: 2,
                px: 3,
                py: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.secondary, fontWeight: 600 }}>
                🚧 개발 예정 — 프로젝트 카드, 필터, 상세 페이지가 추가됩니다.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
