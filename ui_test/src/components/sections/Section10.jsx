import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import InboxIcon from '@mui/icons-material/Inbox';
import SectionWrapper from './SectionWrapper';

const initialItems = [
  { id: 'item-1', label: 'React 학습하기', color: '#e3f2fd' },
  { id: 'item-2', label: 'MUI 컴포넌트 테스트', color: '#f3e5f5' },
  { id: 'item-3', label: 'API 연동 작업', color: '#e8f5e9' },
  { id: 'item-4', label: '코드 리뷰 진행', color: '#fff3e0' },
  { id: 'item-5', label: '배포 준비', color: '#fce4ec' },
];

function Section10() {
  const [sourceItems, setSourceItems] = useState(initialItems);
  const [droppedItems, setDroppedItems] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e, item) => {
    setDraggingId(item.id);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData('text/plain');
    const item = sourceItems.find((i) => i.id === id);
    if (item) {
      setSourceItems((prev) => prev.filter((i) => i.id !== id));
      setDroppedItems((prev) => [...prev, item]);
    }
  };

  const handleDropBack = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const item = droppedItems.find((i) => i.id === id);
    if (item) {
      setDroppedItems((prev) => prev.filter((i) => i.id !== id));
      setSourceItems((prev) => [...prev, item]);
    }
  };

  const handleReset = () => {
    setSourceItems(initialItems);
    setDroppedItems([]);
  };

  return (
    <SectionWrapper
      title="10. Drag & Drop"
      subtitle="아이템을 드래그하여 드롭 영역으로 이동하세요. 다시 되돌릴 수도 있습니다."
      even
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* 소스 영역 */}
        <Paper
          variant="outlined"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropBack}
          sx={{ flex: 1, p: 3, minHeight: 250 }}
        >
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            할 일 목록
          </Typography>
          <Stack spacing={1.5}>
            {sourceItems.map((item) => (
              <Paper
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                elevation={draggingId === item.id ? 6 : 1}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: item.color,
                  cursor: 'grab',
                  opacity: draggingId === item.id ? 0.5 : 1,
                  transition: 'box-shadow 0.2s, opacity 0.2s, transform 0.2s',
                  transform: draggingId === item.id ? 'scale(1.03)' : 'none',
                  '&:hover': { boxShadow: 3 },
                  '&:active': { cursor: 'grabbing' },
                }}
              >
                <DragIndicatorIcon fontSize="small" color="action" />
                <Typography variant="body2">{item.label}</Typography>
              </Paper>
            ))}
            {sourceItems.length === 0 && (
              <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ py: 4 }}>
                모든 아이템이 이동되었습니다.
              </Typography>
            )}
          </Stack>
        </Paper>

        {/* 드롭 영역 */}
        <Paper
          variant="outlined"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          sx={{
            flex: 1,
            p: 3,
            minHeight: 250,
            border: dragOver ? '2px dashed #1976d2' : '2px dashed #ccc',
            backgroundColor: dragOver ? '#e3f2fd' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            완료 목록
            {droppedItems.length > 0 && (
              <Chip label={droppedItems.length} size="small" color="primary" sx={{ ml: 1 }} />
            )}
          </Typography>
          <Stack spacing={1.5}>
            {droppedItems.map((item) => (
              <Paper
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                elevation={draggingId === item.id ? 6 : 1}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: item.color,
                  cursor: 'grab',
                  opacity: draggingId === item.id ? 0.5 : 1,
                  transition: 'box-shadow 0.2s, opacity 0.2s, transform 0.2s',
                  transform: draggingId === item.id ? 'scale(1.03)' : 'none',
                  '&:hover': { boxShadow: 3 },
                  '&:active': { cursor: 'grabbing' },
                }}
              >
                <DragIndicatorIcon fontSize="small" color="action" />
                <Typography variant="body2">{item.label}</Typography>
              </Paper>
            ))}
            {droppedItems.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.disabled' }}>
                <InboxIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2">여기에 아이템을 드롭하세요</Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      </Stack>

      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Chip label="초기화" onClick={handleReset} variant="outlined" />
      </Box>
    </SectionWrapper>
  );
}

export default Section10;
