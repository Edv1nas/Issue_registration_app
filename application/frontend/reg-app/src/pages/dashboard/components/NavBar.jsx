import { useState, useCallback } from 'react';
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import NewTask from './NewTask';
import ThemeLogo from '../../../components/ui/ThemeLogo';

// Constants
const ICON_BUTTON_STYLES = {
  size: 'large',
  sx: { '&:hover': { bgcolor: 'action.selected' } }
};

const APPBAR_STYLES = {
  position: 'fixed',
  sx: {
    zIndex: (theme) => theme.zIndex.drawer + 1,
    bgcolor: 'background.paper',
    color: 'text.primary'
  }
};

// Reusable ActionButton component
const ActionButton = ({ tooltip, onClick, icon, ...props }) => (
  <Tooltip title={tooltip}>
    <IconButton
      color="inherit"
      onClick={onClick}
      {...ICON_BUTTON_STYLES}
      {...props}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

// Left section component
const LeftSection = ({ onToggleSidebar }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    {onToggleSidebar && (
      <ActionButton
        tooltip="Toggle Sidebar"
        onClick={onToggleSidebar}
        icon={<MenuIcon />}
        edge="start"
      />
    )}
    <ThemeLogo size={35} />
  </Box>
);

// Right section component
const RightSection = ({ onNewTask, themeMode, onToggleTheme, onLogout }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <ActionButton
      tooltip="New Task"
      onClick={onNewTask}
      icon={<AddIcon />}
    />

    <ActionButton
      tooltip={`Toggle ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
      onClick={onToggleTheme}
      icon={themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    />

    <ActionButton
      tooltip="Logout"
      onClick={onLogout}
      icon={<LogoutIcon />}
    />
  </Box>
);

const Navbar = ({ onCreateTask, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const { themeMode, toggleTheme } = useTheme();

  // Event handlers
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  const handleNewTaskOpen = useCallback(() => {
    setIsNewTaskOpen(true);
  }, []);

  const handleNewTaskClose = useCallback(() => {
    setIsNewTaskOpen(false);
  }, []);

  return (
    <>
      <AppBar {...APPBAR_STYLES}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <LeftSection onToggleSidebar={onToggleSidebar} />
          
          <RightSection
            onNewTask={handleNewTaskOpen}
            themeMode={themeMode}
            onToggleTheme={toggleTheme}
            onLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>

      <NewTask
        open={isNewTaskOpen}
        handleClose={handleNewTaskClose}
        onCreateTask={onCreateTask}
      />
    </>
  );
};

export default Navbar;