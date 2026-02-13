import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import SectionWrapper from './SectionWrapper';

const variants = ['standard', 'outlined', 'filled'];

function Section02() {
  const [values, setValues] = useState({
    standard: '',
    outlined: '',
    filled: '',
  });

  const handleChange = (variant) => (e) => {
    setValues((prev) => ({ ...prev, [variant]: e.target.value }));
  };

  return (
    <SectionWrapper
      title="02. Input (TextField)"
      subtitle="MUI TextField의 variant별 입력 필드와 실시간 입력값 표시를 확인하세요."
      even
    >
      <Stack spacing={4}>
        {variants.map((variant) => (
          <Box key={variant}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, textTransform: 'capitalize' }}>
              {variant}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                variant={variant}
                label={`${variant} 입력`}
                placeholder={`${variant} 텍스트를 입력하세요`}
                value={values[variant]}
                onChange={handleChange(variant)}
                fullWidth
                sx={{ maxWidth: 400 }}
              />
              <Paper variant="outlined" sx={{ px: 2, py: 1, minWidth: 200, minHeight: 40, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  입력값:{' '}
                  <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
                    {values[variant] || '-'}
                  </Typography>
                </Typography>
              </Paper>
            </Stack>
          </Box>
        ))}
      </Stack>
    </SectionWrapper>
  );
}

export default Section02;
