import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const ThemeToggle = ({ themeMode, toggleTheme }) => {
  return (
    <IconButton onClick={toggleTheme} aria-label="toggle theme">
      {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggle;