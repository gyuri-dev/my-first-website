import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SectionWrapper from './SectionWrapper';

const cards = [
  {
    id: 1,
    title: 'React',
    description: '사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다. 컴포넌트 기반 아키텍처로 재사용 가능한 UI를 구축할 수 있습니다.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    color: '#61dafb',
  },
  {
    id: 2,
    title: 'Material UI',
    description: 'Google의 Material Design을 React에서 구현한 UI 프레임워크입니다. 풍부한 컴포넌트와 테마 시스템을 제공합니다.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    color: '#1976d2',
  },
  {
    id: 3,
    title: 'Vite',
    description: '차세대 프론트엔드 빌드 도구로, 빠른 개발 서버와 최적화된 프로덕션 빌드를 제공합니다.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    color: '#646cff',
  },
  {
    id: 4,
    title: 'TypeScript',
    description: 'JavaScript에 정적 타입을 추가한 언어로, 대규모 애플리케이션 개발 시 안정성과 생산성을 높여줍니다.',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
    color: '#3178c6',
  },
];

function Section09() {
  const handleClick = (title) => {
    alert(`"${title}" 카드의 자세히 보기를 클릭했습니다!`);
  };

  return (
    <SectionWrapper
      title="09. Card"
      subtitle="MUI Card 컴포넌트로 콘텐츠를 카드 형태로 표시합니다."
    >
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.3s, transform 0.3s',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image={card.image}
                alt={card.title}
                sx={{ backgroundColor: card.color }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button size="small" onClick={() => handleClick(card.title)}>
                  자세히 보기
                </Button>
                <Button size="small" color="secondary">
                  공유
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
}

export default Section09;
