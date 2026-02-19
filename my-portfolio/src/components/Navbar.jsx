import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { colors } from '../theme';

const navItems = [
  { label: 'Home',       path: '/' },
  { label: 'About Me',   path: '/about' },
  { label: 'Projects',   path: '/projects' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: colors.bgSecondary }}>
      <Toolbar sx={{ maxWidth: 1100, mx: 'auto', width: '100%', px: { xs: 2, md: 4 } }}>
        {/* 로고 */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ flexGrow: 1, color: colors.primary, cursor: 'pointer', letterSpacing: 1 }}
          onClick={() => navigate('/')}
        >
          My Portfolio
        </Typography>

        {/* 데스크탑 메뉴 */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: isActive(item.path) ? colors.primary : colors.textSecondary,
                  fontWeight: isActive(item.path) ? 700 : 500,
                  borderBottom: isActive(item.path) ? `2px solid ${colors.primary}` : '2px solid transparent',
                  borderRadius: 0,
                  px: 2,
                  '&:hover': { color: colors.primary, bgcolor: 'transparent' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* 모바일 햄버거 */}
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: colors.textPrimary }}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* 모바일 Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 220, pt: 2, bgcolor: colors.bgSecondary, height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ px: 3, pb: 2, color: colors.primary }}>
            My Portfolio
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: `${colors.primary}15`,
                      color: colors.primary,
                      '& .MuiListItemText-primary': { fontWeight: 700 },
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
