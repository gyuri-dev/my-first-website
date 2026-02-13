import { useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import SectionWrapper from './SectionWrapper';

const dropdowns = [
  {
    id: 'framework',
    label: '프레임워크',
    options: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'],
  },
  {
    id: 'language',
    label: '프로그래밍 언어',
    options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'],
  },
  {
    id: 'database',
    label: '데이터베이스',
    options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase'],
  },
];

function Section04() {
  const [values, setValues] = useState({
    framework: '',
    language: '',
    database: '',
  });

  const handleChange = (id) => (e) => {
    setValues((prev) => ({ ...prev, [id]: e.target.value }));
  };

  return (
    <SectionWrapper
      title="04. Dropdown (Select)"
      subtitle="MUI Select 컴포넌트로 옵션을 선택하고 실시간으로 결과를 확인하세요."
      even
    >
      <Stack spacing={4}>
        {dropdowns.map((dropdown) => (
          <Stack key={dropdown.id} direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>{dropdown.label}</InputLabel>
              <Select
                value={values[dropdown.id]}
                label={dropdown.label}
                onChange={handleChange(dropdown.id)}
              >
                {dropdown.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Paper variant="outlined" sx={{ px: 2, py: 1, minWidth: 200, minHeight: 40, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                선택값:{' '}
                <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
                  {values[dropdown.id] || '-'}
                </Typography>
              </Typography>
            </Paper>
          </Stack>
        ))}
      </Stack>

      {/* 전체 선택 결과 요약 */}
      {Object.values(values).some(Boolean) && (
        <Paper sx={{ mt: 4, p: 3, backgroundColor: '#e3f2fd' }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            선택 결과 요약
          </Typography>
          {dropdowns.map((dropdown) => (
            <Typography key={dropdown.id} variant="body2">
              {dropdown.label}: {values[dropdown.id] || '미선택'}
            </Typography>
          ))}
        </Paper>
      )}
    </SectionWrapper>
  );
}

export default Section04;
