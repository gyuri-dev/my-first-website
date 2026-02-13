import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import SectionWrapper from './SectionWrapper';

const marks = [
  { value: 0, label: '0' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 75, label: '75' },
  { value: 100, label: '100' },
];

const sliders = [
  { id: 'basic', label: '기본 슬라이더', color: 'primary', step: 1 },
  { id: 'step10', label: '10단위 슬라이더', color: 'secondary', step: 10 },
  { id: 'range', label: '범위 슬라이더', color: 'primary', step: 5, range: true },
];

function Section07() {
  const [values, setValues] = useState({
    basic: 30,
    step10: 50,
    range: [20, 70],
  });

  const handleChange = (id) => (_, newValue) => {
    setValues((prev) => ({ ...prev, [id]: newValue }));
  };

  const formatValue = (val) => {
    return Array.isArray(val) ? `${val[0]} ~ ${val[1]}` : val;
  };

  return (
    <SectionWrapper
      title="07. Slider"
      subtitle="MUI Slider로 값을 조절하고 실시간으로 확인하세요."
    >
      <Stack spacing={5}>
        {sliders.map((slider) => (
          <Box key={slider.id}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {slider.label}
              </Typography>
              <Paper variant="outlined" sx={{ px: 2, py: 0.5 }}>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {formatValue(values[slider.id])}
                </Typography>
              </Paper>
            </Stack>
            <Box sx={{ px: 1 }}>
              <Slider
                value={values[slider.id]}
                onChange={handleChange(slider.id)}
                color={slider.color}
                step={slider.step}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </SectionWrapper>
  );
}

export default Section07;
