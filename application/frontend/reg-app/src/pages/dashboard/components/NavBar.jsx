import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
}from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import CreateTaskModal from './CreateTaskModel';

const Navbar = ({ onCreateTask }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { themeMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

return (
  <>
    <AppBar position="static" sx={{ 
      zIndex: (theme) => theme.zIndex.drawer + 1,
      bgcolor: 'background.paper',
      color: 'text.primary'
    }}>
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 0.5
          }}
        >
          IT Issue Tracker
        </Typography>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Tooltip title="Create New Task">
            <IconButton 
              color="inherit" 
              onClick={() => setOpen(true)}
              size="large"
              sx={{
                '&:hover': {
                  bgcolor: 'action.selected'
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={`Toggle ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              size="large"
              sx={{
                '&:hover': {
                  bgcolor: 'action.selected'
                }
              }}
            >
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              size="large"
              sx={{
                '&:hover': {
                  bgcolor: 'action.selected'
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>

    <CreateTaskModal 
      open={open} 
      handleClose={() => setOpen(false)} 
      onCreateTask={onCreateTask} 
    />
  </>
);
};

export default Navbar;