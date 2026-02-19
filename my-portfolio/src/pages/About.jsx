import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { colors } from '../theme';

// ─── 공통: 섹션 헤더 ─────────────────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography
        variant="overline"
        sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 3, fontSize: 12 }}
      >
        {label}
      </Typography>
      <Typography variant="h5" fontWeight="bold" sx={{ color: colors.textPrimary, mt: 0.5 }}>
        {title}
      </Typography>
      <Box sx={{ width: 40, height: 3, bgcolor: colors.primary, borderRadius: 2, mt: 1.5 }} />
    </Box>
  );
}

// ─── 1. 프로필 히어로 ─────────────────────────────────────────────────────────
function ProfileHero() {
  return (
    <Box
      sx={{
        py: 10,
        background: `linear-gradient(135deg, ${colors.bgTertiary} 0%, ${colors.bgPrimary} 100%)`,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 5,
          }}
        >
          {/* 프로필 이미지 */}
          <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
            <Box
              sx={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                bgcolor: `${colors.primary}20`,
                border: `4px solid ${colors.primary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                overflow: 'hidden',
              }}
            >
              <Typography sx={{ fontSize: 64 }}>👤</Typography>
            </Box>
            {/* SNS 링크 */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              {['GitHub', 'LinkedIn', 'Blog'].map((sns) => (
                <Chip
                  key={sns}
                  label={sns}
                  size="small"
                  sx={{
                    bgcolor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textSecondary,
                    fontSize: 11,
                    cursor: 'pointer',
                    '&:hover': { borderColor: colors.primary, color: colors.primary },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 소개 텍스트 */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box
              sx={{
                display: 'inline-block',
                bgcolor: `${colors.primary}18`,
                border: `1px solid ${colors.primary}40`,
                borderRadius: 6,
                px: 2,
                py: 0.4,
                mb: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 700, letterSpacing: 2 }}>
                FRONTEND DEVELOPER
              </Typography>
            </Box>

            <Typography variant="h3" fontWeight="bold" sx={{ color: colors.textPrimary, mb: 1 }}>
              홍길동
            </Typography>
            <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 3, fontWeight: 400 }}>
              사용자 경험을 고민하는 프론트엔드 개발자
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: colors.textSecondary, lineHeight: 2, mb: 4, maxWidth: 480 }}
            >
              React와 MUI를 주력으로 사용하며, 디자인과 개발의 경계를 탐구합니다.
              사람들이 편리하게 사용할 수 있는 인터페이스를 만드는 것을 즐깁니다.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Button
                variant="contained"
                sx={{ bgcolor: colors.primary, '&:hover': { bgcolor: colors.buttonHover } }}
              >
                이력서 다운로드
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: colors.primary, color: colors.primary, '&:hover': { bgcolor: `${colors.primary}08` } }}
              >
                연락하기
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ─── 2. 나의 이야기 ───────────────────────────────────────────────────────────
function MyStory() {
  const stories = [
    {
      icon: '🌱',
      title: '시작',
      text: '대학에서 처음 프로그래밍을 접하면서 "코드 한 줄이 화면을 바꾼다"는 사실에 매료되었습니다. HTML/CSS로 만든 첫 웹페이지가 브라우저에 나타났을 때의 감동을 잊지 못합니다.',
    },
    {
      icon: '⚡',
      title: '성장',
      text: 'JavaScript와 React를 공부하며 동적인 인터페이스를 구현하는 즐거움을 발견했습니다. 여러 프로젝트를 통해 단순히 동작하는 코드가 아닌, 유지보수하기 좋은 코드의 중요성을 배웠습니다.',
    },
    {
      icon: '🎯',
      title: '지향점',
      text: '기술을 위한 기술이 아닌, 사람을 위한 기술을 만들고 싶습니다. 접근성과 사용자 경험을 항상 염두에 두고, 누구나 쉽게 사용할 수 있는 인터페이스를 설계하는 개발자가 되겠습니다.',
    },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: colors.bgSecondary }}>
      <Container maxWidth="md">
        <SectionHeader label="MY STORY" title="나의 이야기" />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {stories.map((s) => (
            <Card
              key={s.title}
              sx={{
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadowCard,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: `${colors.primary}15`,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 26,
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: colors.primary, mb: 1 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.9 }}>
                      {s.text}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// ─── 3. 기술 스택 ─────────────────────────────────────────────────────────────
function TechSkills() {
  const categories = [
    {
      label: 'Frontend',
      color: colors.primary,
      skills: ['React', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'MUI', 'Tailwind CSS'],
    },
    {
      label: 'Backend & DB',
      color: colors.secondary,
      skills: ['Node.js', 'Express', 'Firebase', 'MySQL', 'MongoDB'],
    },
    {
      label: 'Tools & DevOps',
      color: '#6B5B4E',
      skills: ['Git', 'GitHub', 'Vite', 'VS Code', 'Figma', 'GitHub Actions'],
    },
    {
      label: 'Learning',
      color: colors.accent,
      skills: ['Next.js', 'React Native', 'GraphQL'],
    },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: colors.bgPrimary }}>
      <Container maxWidth="md">
        <SectionHeader label="TECH SKILLS" title="기술 스택" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
          }}
        >
          {categories.map((cat) => (
            <Card
              key={cat.label}
              sx={{ borderRadius: 3, border: `1px solid ${colors.border}`, boxShadow: colors.shadowCard }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: cat.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: cat.color }}>
                    {cat.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {cat.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{
                        bgcolor: `${cat.color}12`,
                        color: cat.color === colors.accent ? '#8B6914' : cat.color,
                        border: `1px solid ${cat.color}30`,
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// ─── 4. 타임라인 (학력 + 경력) ───────────────────────────────────────────────
function Timeline() {
  const items = [
    {
      period: '2026.03 ~ 현재',
      type: '재직',
      typeColor: colors.primary,
      title: '○○ 스타트업',
      role: 'Frontend Developer',
      desc: 'React 기반 SaaS 대시보드 개발, 사용자 경험 개선 및 성능 최적화 담당.',
    },
    {
      period: '2025.06 ~ 2025.12',
      type: '인턴',
      typeColor: colors.secondary,
      title: '△△ IT 기업',
      role: 'Frontend Intern',
      desc: '메인 서비스 UI 컴포넌트 개발 참여, React + TypeScript 환경에서 협업.',
    },
    {
      period: '2021.03 ~ 2025.02',
      type: '학력',
      typeColor: '#6B5B4E',
      title: '○○ 대학교',
      role: '컴퓨터공학과 졸업',
      desc: '웹 개발, 알고리즘, 데이터베이스 등을 전공. 졸업 프로젝트: 반응형 소셜 플랫폼 개발.',
    },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: colors.bgSecondary }}>
      <Container maxWidth="md">
        <SectionHeader label="TIMELINE" title="학력 및 경력" />

        <Box sx={{ position: 'relative' }}>
          {/* 타임라인 세로선 */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 20, sm: 28 },
              top: 0,
              bottom: 0,
              width: 2,
              bgcolor: colors.border,
              zIndex: 0,
            }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {items.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  gap: { xs: 3, sm: 4 },
                  alignItems: 'flex-start',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* 타임라인 점 */}
                <Box
                  sx={{
                    width: { xs: 40, sm: 56 },
                    height: 40,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: item.typeColor,
                      border: `3px solid ${colors.bgSecondary}`,
                      boxShadow: `0 0 0 2px ${item.typeColor}`,
                    }}
                  />
                </Box>

                {/* 카드 */}
                <Card
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    border: `1px solid ${colors.border}`,
                    borderLeft: `3px solid ${item.typeColor}`,
                    boxShadow: colors.shadowCard,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            bgcolor: `${item.typeColor}15`,
                            color: item.typeColor,
                            border: `1px solid ${item.typeColor}30`,
                            fontWeight: 700,
                            fontSize: 11,
                          }}
                        />
                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: colors.textPrimary }}>
                          {item.title}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: colors.textMuted, whiteSpace: 'nowrap' }}>
                        {item.period}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: colors.primary, fontWeight: 600, mb: 1 }}>
                      {item.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.8 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ─── 5. 수상 및 자격증 ────────────────────────────────────────────────────────
function Awards() {
  const awards = [
    { icon: '🏆', title: '○○ 해커톤 우수상', org: '○○ 기관 주최', year: '2024', color: colors.accent },
    { icon: '📜', title: '정보처리기사', org: '한국산업인력공단', year: '2024', color: colors.primary },
    { icon: '🎖️', title: '웹개발 경진대회 장려상', org: '○○ 대학교', year: '2023', color: colors.secondary },
    { icon: '📜', title: 'SQLD (SQL 개발자)', org: '한국데이터산업진흥원', year: '2023', color: '#6B5B4E' },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: colors.bgTertiary, borderTop: `1px solid ${colors.border}` }}>
      <Container maxWidth="md">
        <SectionHeader label="AWARDS & CERTIFICATES" title="수상 및 자격증" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
          }}
        >
          {awards.map((a) => (
            <Card
              key={a.title}
              sx={{
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadowCard,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: colors.shadowModal },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: `${a.color}18`,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {a.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: colors.textPrimary }}>
                      {a.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block' }}>
                      {a.org}
                    </Typography>
                  </Box>
                  <Chip
                    label={a.year}
                    size="small"
                    sx={{
                      ml: 'auto',
                      bgcolor: `${a.color}15`,
                      color: a.color === colors.accent ? '#8B6914' : a.color,
                      fontWeight: 700,
                      fontSize: 11,
                      flexShrink: 0,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* 성격/강점 */}
        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadowCard,
            bgcolor: colors.bgSecondary,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: colors.textPrimary, mb: 2.5 }}>
              성격 & 강점
            </Typography>
            <Divider sx={{ borderColor: colors.border, mb: 2.5 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {[
                { label: '🔍 꼼꼼한 코드 리뷰', color: colors.primary },
                { label: '🤝 원활한 팀 협업', color: colors.secondary },
                { label: '📚 지속적인 학습', color: '#6B5B4E' },
                { label: '💡 창의적 문제 해결', color: colors.primary },
                { label: '⏱️ 일정 관리', color: colors.secondary },
                { label: '🎨 디자인 감각', color: '#6B5B4E' },
              ].map((tag) => (
                <Chip
                  key={tag.label}
                  label={tag.label}
                  sx={{
                    bgcolor: `${tag.color}12`,
                    color: tag.color,
                    border: `1px solid ${tag.color}30`,
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

// ─── About Me 페이지 ──────────────────────────────────────────────────────────
export default function About() {
  return (
    <Box>
      <ProfileHero />
      <MyStory />
      <TechSkills />
      <Timeline />
      <Awards />
    </Box>
  );
}
