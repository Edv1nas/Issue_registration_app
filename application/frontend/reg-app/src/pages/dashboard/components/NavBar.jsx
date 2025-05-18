import { useState } from 'react';
import { 
  AppBar, 
  Toolbar,  
  IconButton, 
  Box,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon
}from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import NewTask from './NewTask';
import ThemeLogo from '../../../components/ui/ThemeLogo';

const Navbar = ({ onCreateTask, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { themeMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

return (
  <>
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onToggleSidebar && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onToggleSidebar}
              size="large"
            >
              <MenuIcon />
            </IconButton>
          )}
          <ThemeLogo size={35} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="New Task">
            <IconButton
              color="inherit"
              onClick={() => setOpen(true)}
              size="large"
              sx={{ '&:hover': { bgcolor: 'action.selected' } }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={`Toggle ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              size="large"
              sx={{ '&:hover': { bgcolor: 'action.selected' } }}
            >
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              onClick={handleLogout}
              size="large"
              sx={{ '&:hover': { bgcolor: 'action.selected' } }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>

    <NewTask
      open={open}
      handleClose={() => setOpen(false)}
      onCreateTask={onCreateTask}
    />
  </>
);
};

export default Navbar;