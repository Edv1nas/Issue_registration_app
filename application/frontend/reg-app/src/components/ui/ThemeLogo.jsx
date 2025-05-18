// components/ui/ThemeLogo.jsx
import { useTheme } from '@mui/material/styles';
import logo from '../../assets/images/tkn_logox.png';

const ThemeLogo = ({ size = 80 }) => {
  const theme = useTheme();
  
  return (
    <img 
      src={logo}
      alt="Company Logo"
      style={{
        height: `${size}px`,
        width: 'auto',
        filter: theme.palette.mode === 'light' 
          ? 'brightness(0)'
          : 'brightness(0) invert(1)'
      }}
    />
  );
};

export default ThemeLogo;