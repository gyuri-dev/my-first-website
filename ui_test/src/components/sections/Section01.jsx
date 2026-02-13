import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import SectionWrapper from './SectionWrapper';

const variants = ['contained', 'outlined', 'text'];
const colors = [
  { name: 'primary', label: 'Primary' },
  { name: 'secondary', label: 'Secondary' },
  { name: 'error', label: 'Error' },
];

function Section01() {
  const handleClick = (variant, color) => {
    alert(`${variant} / ${color} 버튼이 클릭되었습니다!`);
  };

  return (
    <SectionWrapper
      title="01. Button"
      subtitle="MUI Button의 variant와 color 조합을 확인하세요."
    >
      <Stack spacing={4}>
        {variants.map((variant) => (
          <Box key={variant}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, textTransform: 'capitalize' }}>
              {variant}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {colors.map((color) => (
                <Button
                  key={color.name}
                  variant={variant}
                  color={color.name}
                  onClick={() => handleClick(variant, color.label)}
                >
                  {color.label}
                </Button>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </SectionWrapper>
  );
}

export default Section01;
