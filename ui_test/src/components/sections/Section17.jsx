import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionWrapper from './SectionWrapper';

const menuItems = ['홈', '소개', '상품', '연락처', '설정'];

function Section17() {
  return (
    <SectionWrapper
      title="17. Flex Navigation"
      subtitle="Flexbox의 justify-content: space-between으로 로고와 메뉴를 양 끝 정렬한 네비게이션입니다."
    >
      {/* 네비게이션 박스 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: 60,
          backgroundColor: '#2d3748',
          borderRadius: 1,
          px: 3,
        }}
      >
        {/* 로고 박스 */}
        <Box>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            MyWebsite
          </Typography>
        </Box>

        {/* 메뉴들 박스 */}
        <Box sx={{ display: 'flex', gap: '15px' }}>
          {menuItems.map((item) => (
            <Typography
              key={item}
              sx={{
                color: '#a0aec0',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#ffffff',
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </SectionWrapper>
  );
}

export default Section17;
