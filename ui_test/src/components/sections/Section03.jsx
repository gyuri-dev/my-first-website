import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import SectionWrapper from './SectionWrapper';

const menuItems = ['홈', '소개', '서비스', '연락처'];

function Section03() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuClick = (menu) => {
    alert(`"${menu}" 메뉴가 클릭되었습니다!`);
    setDrawerOpen(false);
  };

  return (
    <SectionWrapper
      title="03. Navigation"
      subtitle="MUI AppBar + Toolbar 기반 네비게이션입니다. 브라우저 너비를 줄여 햄버거 메뉴를 확인하세요."
    >
      <AppBar position="static" sx={{ borderRadius: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My App
          </Typography>

          {/* 데스크톱 메뉴 */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            {menuItems.map((item) => (
              <Button key={item} color="inherit" onClick={() => handleMenuClick(item)}>
                {item}
              </Button>
            ))}
          </Box>

          {/* 모바일 햄버거 */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 모바일 Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={() => handleMenuClick(item)}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </SectionWrapper>
  );
}

export default Section03;
