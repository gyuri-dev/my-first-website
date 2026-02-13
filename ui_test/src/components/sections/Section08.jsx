import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import SectionWrapper from './SectionWrapper';

const dialogs = [
  {
    id: 'basic',
    buttonLabel: '기본 모달',
    buttonColor: 'primary',
    title: '알림',
    content: '이것은 기본 모달 다이얼로그입니다. 배경을 클릭하거나 닫기 버튼으로 닫을 수 있습니다.',
  },
  {
    id: 'confirm',
    buttonLabel: '삭제 확인 모달',
    buttonColor: 'error',
    title: '삭제 확인',
    content: '정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
  },
  {
    id: 'info',
    buttonLabel: '정보 모달',
    buttonColor: 'secondary',
    title: '서비스 안내',
    content: '본 서비스는 React와 MUI를 기반으로 제작되었습니다. 다양한 UI 컴포넌트를 테스트하고 확인할 수 있습니다.',
  },
];

function Section08() {
  const [open, setOpen] = useState({});

  const handleOpen = (id) => setOpen((prev) => ({ ...prev, [id]: true }));
  const handleClose = (id) => setOpen((prev) => ({ ...prev, [id]: false }));

  const handleConfirm = (id, title) => {
    alert(`"${title}" 모달에서 확인을 클릭했습니다!`);
    handleClose(id);
  };

  return (
    <SectionWrapper
      title="08. Modal (Dialog)"
      subtitle="MUI Dialog로 다양한 모달 팝업을 확인하세요."
      even
    >
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {dialogs.map((dialog) => (
          <Button
            key={dialog.id}
            variant="contained"
            color={dialog.buttonColor}
            onClick={() => handleOpen(dialog.id)}
          >
            {dialog.buttonLabel}
          </Button>
        ))}
      </Stack>

      {dialogs.map((dialog) => (
        <Dialog
          key={dialog.id}
          open={!!open[dialog.id]}
          onClose={() => handleClose(dialog.id)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">{dialog.title}</Typography>
            <IconButton onClick={() => handleClose(dialog.id)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{dialog.content}</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => handleClose(dialog.id)} color="inherit">
              취소
            </Button>
            <Button
              onClick={() => handleConfirm(dialog.id, dialog.title)}
              variant="contained"
              color={dialog.buttonColor}
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      ))}
    </SectionWrapper>
  );
}

export default Section08;
