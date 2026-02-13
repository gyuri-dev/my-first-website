import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Fade from '@mui/material/Fade';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArticleIcon from '@mui/icons-material/Article';
import SectionWrapper from './SectionWrapper';

const contentItems = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `아이템 #${i + 1}`,
  description: `이것은 스크롤 테스트를 위한 ${i + 1}번째 콘텐츠 항목입니다. 스크롤하여 더 많은 항목을 확인하세요.`,
}));

function Section11() {
  const [showTop, setShowTop] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const percent = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    setScrollPercent(percent);
    setShowTop(el.scrollTop > 100);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SectionWrapper
      title="11. Scroll"
      subtitle="고정 높이 영역에서 스크롤 동작과 Top 버튼을 확인하세요."
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        스크롤 위치: <strong>{scrollPercent}%</strong>
      </Typography>

      {/* 프로그레스 바 */}
      <Box sx={{ width: '100%', height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, mb: 2 }}>
        <Box sx={{ width: `${scrollPercent}%`, height: '100%', backgroundColor: 'primary.main', borderRadius: 2, transition: 'width 0.1s' }} />
      </Box>

      <Box sx={{ position: 'relative' }}>
        <Paper
          ref={scrollRef}
          onScroll={handleScroll}
          variant="outlined"
          sx={{
            height: 300,
            overflowY: 'auto',
            px: 1,
          }}
        >
          {contentItems.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemIcon>
                <ArticleIcon color={item.id % 2 === 0 ? 'primary' : 'secondary'} />
              </ListItemIcon>
              <ListItemText primary={item.title} secondary={item.description} />
            </ListItem>
          ))}
        </Paper>

        {/* Top 버튼 */}
        <Fade in={showTop}>
          <Fab
            size="small"
            color="primary"
            onClick={scrollToTop}
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Fade>
      </Box>
    </SectionWrapper>
  );
}

export default Section11;
