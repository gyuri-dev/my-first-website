import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SectionWrapper from './SectionWrapper';

const menuItems = [
  { label: '홈', icon: <HomeIcon /> },
  { label: '대시보드', icon: <DashboardIcon /> },
  { label: '주문 관리', icon: <ShoppingCartIcon /> },
  { label: '고객 관리', icon: <PeopleIcon /> },
  { label: '통계', icon: <BarChartIcon /> },
];

const bottomItems = [
  { label: '설정', icon: <SettingsIcon /> },
  { label: '도움말', icon: <HelpIcon /> },
  { label: '로그아웃', icon: <LogoutIcon />, color: 'error.main' },
];

function Section14() {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState('left');
  const [selected, setSelected] = useState(null);

  const handleSelect = (label) => {
    setSelected(label);
  };

  const handleAnchorChange = (_, value) => {
    if (value) setAnchor(value);
  };

  const drawerContent = (
    <Box sx={{ width: 260, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">메뉴</Typography>
        <Button size="small" onClick={() => setOpen(false)}>
          {anchor === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Button>
      </Box>
      <Divider />

      {/* 메인 메뉴 */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={selected === item.label}
              onClick={() => handleSelect(item.label)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* 하단 메뉴 */}
      <List>
        {bottomItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => handleSelect(item.label)}>
              <ListItemIcon sx={item.color ? { color: item.color } : undefined}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={item.color ? { color: item.color } : undefined}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <SectionWrapper
      title="14. Sidebar (Drawer)"
      subtitle="MUI Drawer로 사이드바를 열고 메뉴를 선택하세요."
      even
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        {/* 위치 선택 */}
        <ToggleButtonGroup value={anchor} exclusive onChange={handleAnchorChange} size="small">
          <ToggleButton value="left">
            <MenuOpenIcon sx={{ mr: 0.5, transform: 'scaleX(1)' }} /> 왼쪽
          </ToggleButton>
          <ToggleButton value="right">
            <MenuOpenIcon sx={{ mr: 0.5, transform: 'scaleX(-1)' }} /> 오른쪽
          </ToggleButton>
        </ToggleButtonGroup>

        {/* 열기 버튼 */}
        <Button variant="contained" onClick={() => setOpen(true)}>
          사이드바 열기
        </Button>

        {/* 선택 결과 */}
        <Paper variant="outlined" sx={{ px: 2, py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">선택된 메뉴:</Typography>
          {selected ? (
            <Chip label={selected} size="small" color="primary" />
          ) : (
            <Typography variant="body2" color="text.disabled">-</Typography>
          )}
        </Paper>
      </Stack>

      <Drawer anchor={anchor} open={open} onClose={() => setOpen(false)}>
        {drawerContent}
      </Drawer>
    </SectionWrapper>
  );
}

export default Section14;
