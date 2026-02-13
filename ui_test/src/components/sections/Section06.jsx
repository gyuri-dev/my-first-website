import { useState } from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import SectionWrapper from './SectionWrapper';

const groups = [
  {
    id: 'plan',
    label: '요금제 선택',
    options: [
      { value: 'free', label: 'Free - 무료' },
      { value: 'basic', label: 'Basic - ₩9,900/월' },
      { value: 'pro', label: 'Pro - ₩19,900/월' },
      { value: 'enterprise', label: 'Enterprise - 별도 문의' },
    ],
  },
  {
    id: 'shipping',
    label: '배송 방법',
    options: [
      { value: 'standard', label: '일반 배송 (3~5일)' },
      { value: 'express', label: '빠른 배송 (1~2일)' },
      { value: 'pickup', label: '매장 픽업' },
    ],
  },
  {
    id: 'theme',
    label: '테마 설정',
    options: [
      { value: 'light', label: '라이트 모드' },
      { value: 'dark', label: '다크 모드' },
      { value: 'system', label: '시스템 설정 따르기' },
    ],
  },
];

function Section06() {
  const [values, setValues] = useState({
    plan: '',
    shipping: '',
    theme: '',
  });

  const handleChange = (id) => (e) => {
    setValues((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const getSelectedLabel = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    const option = group.options.find((o) => o.value === values[groupId]);
    return option ? option.label : '-';
  };

  return (
    <SectionWrapper
      title="06. Radio Button"
      subtitle="MUI RadioGroup으로 단일 선택 옵션을 확인하세요."
      even
    >
      <Stack spacing={4}>
        {groups.map((group) => (
          <Stack key={group.id} direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
            <FormControl sx={{ minWidth: 280 }}>
              <FormLabel>{group.label}</FormLabel>
              <RadioGroup value={values[group.id]} onChange={handleChange(group.id)}>
                {group.options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Paper variant="outlined" sx={{ px: 2, py: 1, minWidth: 200, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                선택:{' '}
                <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
                  {getSelectedLabel(group.id)}
                </Typography>
              </Typography>
            </Paper>
          </Stack>
        ))}
      </Stack>
    </SectionWrapper>
  );
}

export default Section06;
