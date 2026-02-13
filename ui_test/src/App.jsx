import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Section01 from './components/sections/Section01';
import Section02 from './components/sections/Section02';
import Section03 from './components/sections/Section03';
import Section04 from './components/sections/Section04';
import Section05 from './components/sections/Section05';
import Section06 from './components/sections/Section06';
import Section07 from './components/sections/Section07';
import Section08 from './components/sections/Section08';
import Section09 from './components/sections/Section09';
import Section10 from './components/sections/Section10';
import Section11 from './components/sections/Section11';
import Section12 from './components/sections/Section12';
import Section13 from './components/sections/Section13';
import Section14 from './components/sections/Section14';
import Section15 from './components/sections/Section15';
import Section16 from './components/sections/Section16';

function App() {
  return (
    <Box>
      {/* 헤더 영역 */}
      <Box
        sx={{
          py: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            UI Components Gallery
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            16개의 UI 요소를 섹션별로 확인하세요
          </Typography>
        </Container>
      </Box>

      {/* 섹션들이 순차적으로 추가되는 영역 */}
      <Box>
        <Section01 />
        <Section02 />
        <Section03 />
        <Section04 />
        <Section05 />
        <Section06 />
        <Section07 />
        <Section08 />
        <Section09 />
        <Section10 />
        <Section11 />
        <Section12 />
        <Section13 />
        <Section14 />
        <Section15 />
        <Section16 />
      </Box>
    </Box>
  );
}

export default App;
