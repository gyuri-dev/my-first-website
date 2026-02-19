import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme';

// ─── 공통 섹션 헤더 ───────────────────────────────────────────────────────────
function SectionHeader({ label, title, subtitle }) {
  return (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Typography
        variant="overline"
        sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 3, fontSize: 13 }}
      >
        {label}
      </Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ color: colors.textPrimary, mt: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ color: colors.textSecondary, mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

// ─── 1. Hero 섹션 ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${colors.bgPrimary} 60%, ${colors.bgTertiary} 100%)`,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
        {/* 섹션 안내 뱃지 */}
        <Box
          sx={{
            display: 'inline-block',
            bgcolor: `${colors.primary}18`,
            border: `1px solid ${colors.primary}40`,
            borderRadius: 6,
            px: 2.5,
            py: 0.5,
            mb: 3,
          }}
        >
          <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 2 }}>
            HERO SECTION
          </Typography>
        </Box>

        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ color: colors.textPrimary, mb: 2, lineHeight: 1.2 }}
        >
          여기는{' '}
          <Box component="span" sx={{ color: colors.primary }}>
            Hero 섹션
          </Box>
          입니다.
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: colors.textSecondary, maxWidth: 600, mx: 'auto', mb: 4, lineHeight: 1.8 }}
        >
          메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: colors.primary,
              px: 4,
              py: 1.5,
              fontSize: 16,
              '&:hover': { bgcolor: colors.buttonHover },
            }}
          >
            프로젝트 보기
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              px: 4,
              py: 1.5,
              fontSize: 16,
              '&:hover': { borderColor: colors.primaryDark, bgcolor: `${colors.primary}08` },
            }}
          >
            소개 보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// ─── 2. About Me 섹션 ─────────────────────────────────────────────────────────
function AboutSection() {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: 10, bgcolor: colors.bgSecondary }}>
      <Container maxWidth="md">
        <SectionHeader label="ABOUT ME" title="자기소개" />

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: colors.shadowCard,
            border: `1px solid ${colors.border}`,
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Box
              sx={{
                width: 56,
                height: 4,
                bgcolor: colors.primary,
                borderRadius: 2,
                mb: 3,
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: colors.textSecondary, lineHeight: 1.9, mb: 4 }}
            >
              여기는 <strong style={{ color: colors.textPrimary }}>About Me 섹션</strong>입니다.
              <br />
              간단한 자기소개와 '더 알아보기' 버튼이 들어갈 예정입니다.
            </Typography>

            <Divider sx={{ borderColor: colors.border, mb: 4 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/about')}
                sx={{
                  bgcolor: colors.primary,
                  '&:hover': { bgcolor: colors.buttonHover },
                }}
              >
                더 알아보기
              </Button>
              <Button
                variant="text"
                sx={{ color: colors.textSecondary, '&:hover': { color: colors.primary } }}
              >
                이력서 다운로드
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

// ─── 3. Skill Tree 섹션 ───────────────────────────────────────────────────────
function SkillSection() {
  const skills = [
    { name: 'React', level: 80 },
    { name: 'JavaScript', level: 75 },
    { name: 'TypeScript', level: 60 },
    { name: 'HTML / CSS', level: 85 },
    { name: 'Node.js', level: 55 },
    { name: 'Git', level: 70 },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: colors.bgPrimary }}>
      <Container maxWidth="md">
        <SectionHeader
          label="SKILLS"
          title="Skill Tree"
          subtitle="기술 스택을 트리나 프로그레스바로 시각화할 예정입니다."
        />

        <Card sx={{ borderRadius: 3, boxShadow: colors.shadowCard, border: `1px solid ${colors.border}` }}>
          <CardContent sx={{ p: 5 }}>
            <Box
              sx={{
                display: 'inline-block',
                bgcolor: `${colors.secondary}15`,
                border: `1px solid ${colors.secondary}40`,
                borderRadius: 6,
                px: 2,
                py: 0.5,
                mb: 4,
              }}
            >
              <Typography variant="caption" sx={{ color: colors.secondary, fontWeight: 700, letterSpacing: 2 }}>
                SKILL TREE SECTION
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 4 }}>
              여기는 <strong style={{ color: colors.textPrimary }}>Skill Tree 섹션</strong>입니다.
              기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.
            </Typography>

            {/* 프로그레스 바 미리보기 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {skills.map((skill) => (
                <Box key={skill.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: colors.textPrimary }}>
                      {skill.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textMuted }}>
                      {skill.level}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 8,
                      bgcolor: colors.border,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${skill.level}%`,
                        background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
                        borderRadius: 4,
                        transition: 'width 1s ease',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

// ─── 4. Projects 섹션 ─────────────────────────────────────────────────────────
function ProjectsSection() {
  const navigate = useNavigate();
  const projectCards = [
    { title: 'Project 01', desc: '대표 프로젝트 썸네일이 들어갈 예정입니다.', color: colors.bgTertiary },
    { title: 'Project 02', desc: '대표 프로젝트 썸네일이 들어갈 예정입니다.', color: `${colors.accent}30` },
    { title: 'Project 03', desc: '대표 프로젝트 썸네일이 들어갈 예정입니다.', color: `${colors.secondary}15` },
    { title: 'Project 04', desc: '대표 프로젝트 썸네일이 들어갈 예정입니다.', color: `${colors.primary}10` },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: colors.bgSecondary }}>
      <Container maxWidth="lg">
        <SectionHeader
          label="PROJECTS"
          title="대표 프로젝트"
          subtitle="대표작 썸네일 3-4개와 '더 보기' 버튼이 들어갈 예정입니다."
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 5,
          }}
        >
          {projectCards.map((p) => (
            <Card
              key={p.title}
              sx={{
                borderRadius: 3,
                boxShadow: colors.shadowCard,
                border: `1px solid ${colors.border}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: colors.shadowModal,
                },
              }}
            >
              {/* 썸네일 영역 */}
              <Box
                sx={{
                  height: 140,
                  bgcolor: p.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <Typography variant="h6" sx={{ color: colors.textMuted }}>
                  🖼️
                </Typography>
              </Box>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: colors.textPrimary, mb: 0.5 }}>
                  {p.title}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  {p.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/projects')}
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              px: 5,
              py: 1.5,
              '&:hover': { bgcolor: `${colors.primary}08`, borderColor: colors.primaryDark },
            }}
          >
            전체 프로젝트 보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// ─── 5. Contact 섹션 ──────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <Box sx={{ py: 10, bgcolor: colors.bgTertiary, borderTop: `1px solid ${colors.border}` }}>
      <Container maxWidth="md">
        <SectionHeader
          label="CONTACT"
          title="연락하기"
          subtitle="연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다."
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 3 }}>
          {/* 안내 카드 */}
          <Card sx={{ borderRadius: 3, boxShadow: colors.shadowCard, border: `1px solid ${colors.border}` }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'inline-block',
                  bgcolor: `${colors.accent}40`,
                  border: `1px solid ${colors.accent}80`,
                  borderRadius: 6,
                  px: 2,
                  py: 0.5,
                  mb: 3,
                }}
              >
                <Typography variant="caption" sx={{ color: '#8B6914', fontWeight: 700, letterSpacing: 2 }}>
                  CONTACT SECTION
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.9 }}>
                여기는 <strong style={{ color: colors.textPrimary }}>Contact 섹션</strong>입니다.
                <br /><br />
                연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다.
              </Typography>

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['📧 email@example.com', '🐙 github.com/username', '💼 linkedin.com/in/username'].map((item) => (
                  <Typography key={item} variant="body2" sx={{ color: colors.textSecondary }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* 메시지 폼 placeholder */}
          <Card sx={{ borderRadius: 3, boxShadow: colors.shadowCard, border: `1px solid ${colors.border}` }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: colors.textPrimary, mb: 3 }}>
                메시지 보내기
              </Typography>
              {['이름', '이메일', '메시지'].map((field) => (
                <Box
                  key={field}
                  sx={{
                    mb: 2,
                    height: field === '메시지' ? 100 : 44,
                    bgcolor: colors.bgPrimary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: field === '메시지' ? 'flex-start' : 'center',
                    px: 2,
                    pt: field === '메시지' ? 1.5 : 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    {field} 입력 폼이 들어갈 예정입니다.
                  </Typography>
                </Box>
              ))}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: colors.primary,
                  py: 1.5,
                  mt: 1,
                  '&:hover': { bgcolor: colors.buttonHover },
                }}
              >
                전송하기
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Home 페이지 ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Box>
      <HeroSection />
      <AboutSection />
      <SkillSection />
      <ProjectsSection />
      <ContactSection />
    </Box>
  );
}
