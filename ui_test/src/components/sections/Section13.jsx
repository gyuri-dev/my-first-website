import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SectionWrapper from './SectionWrapper';

const menus = [
  {
    id: 'nav',
    label: '네비게이션 메뉴',
    items: [
      { label: '홈', icon: <HomeIcon /> },
      { label: '프로필', icon: <PersonIcon /> },
      { label: '설정', icon: <SettingsIcon /> },
      { divider: true },
      { label: '공유하기', icon: <ShareIcon /> },
      { label: '다운로드', icon: <DownloadIcon /> },
    ],
  },
  {
    id: 'edit',
    label: '편집 메뉴',
    items: [
      { label: '잘라내기', icon: <ContentCutIcon /> },
      { label: '복사하기', icon: <ContentCopyIcon /> },
      { label: '붙여넣기', icon: <ContentPasteIcon /> },
      { divider: true },
      { label: '인쇄', icon: <PrintIcon /> },
      { label: '삭제', icon: <DeleteIcon />, color: 'error.main' },
    ],
  },
];

function Section13() {
  const [anchors, setAnchors] = useState({});
  const [selected, setSelected] = useState({});

  const handleOpen = (id, event) => {
    setAnchors((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleClose = (id) => {
    setAnchors((prev) => ({ ...prev, [id]: null }));
  };

  const handleSelect = (id, label) => {
    setSelected((prev) => ({ ...prev, [id]: label }));
    handleClose(id);
  };

  return (
    <SectionWrapper
      title="13. Menu"
      subtitle="MUI Menu 컴포넌트로 다양한 드롭다운 메뉴를 확인하세요."
    >
      <Stack spacing={4}>
        {menus.map((menu) => (
          <Stack key={menu.id} direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              endIcon={<ArrowDropDownIcon />}
              onClick={(e) => handleOpen(menu.id, e)}
            >
              {menu.label}
            </Button>

            <Menu
              anchorEl={anchors[menu.id]}
              open={Boolean(anchors[menu.id])}
              onClose={() => handleClose(menu.id)}
            >
              {menu.items.map((item, idx) =>
                item.divider ? (
                  <Divider key={idx} />
                ) : (
                  <MenuItem
                    key={item.label}
                    onClick={() => handleSelect(menu.id, item.label)}
                    selected={selected[menu.id] === item.label}
                    sx={item.color ? { color: item.color } : undefined}
                  >
                    <ListItemIcon sx={item.color ? { color: item.color } : undefined}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>{item.label}</ListItemText>
                  </MenuItem>
                )
              )}
            </Menu>

            <Paper variant="outlined" sx={{ px: 2, py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">선택:</Typography>
              {selected[menu.id] ? (
                <Chip label={selected[menu.id]} size="small" color="primary" />
              ) : (
                <Typography variant="body2" color="text.disabled">-</Typography>
              )}
            </Paper>
          </Stack>
        ))}
      </Stack>
    </SectionWrapper>
  );
}

export default Section13;
