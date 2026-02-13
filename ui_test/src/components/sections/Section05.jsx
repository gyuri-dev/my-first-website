import { useState } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import SectionWrapper from './SectionWrapper';

const items = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'nuxtjs', label: 'Nuxt.js' },
];

function Section05() {
  const [checked, setChecked] = useState({});

  const selectedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = selectedCount === items.length;
  const indeterminate = selectedCount > 0 && selectedCount < items.length;

  const handleToggle = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = () => {
    if (allChecked) {
      setChecked({});
    } else {
      const all = {};
      items.forEach((item) => { all[item.id] = true; });
      setChecked(all);
    }
  };

  const selectedItems = items.filter((item) => checked[item.id]);

  return (
    <SectionWrapper
      title="05. Checkbox"
      subtitle="MUI Checkbox로 다중 선택과 전체 선택/해제 기능을 확인하세요."
    >
      <Box>
        {/* 전체 선택 */}
        <FormControlLabel
          control={
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              onChange={handleToggleAll}
            />
          }
          label={<Typography fontWeight="bold">전체 선택</Typography>}
        />
        <Divider sx={{ my: 1 }} />

        {/* 개별 항목 */}
        <FormGroup sx={{ pl: 2 }}>
          {items.map((item) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={!!checked[item.id]}
                  onChange={() => handleToggle(item.id)}
                />
              }
              label={item.label}
            />
          ))}
        </FormGroup>

        {/* 선택 결과 */}
        <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            선택된 항목: <strong>{selectedCount}</strong> / {items.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  color="primary"
                  size="small"
                  onDelete={() => handleToggle(item.id)}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.disabled">
                선택된 항목이 없습니다.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </SectionWrapper>
  );
}

export default Section05;
