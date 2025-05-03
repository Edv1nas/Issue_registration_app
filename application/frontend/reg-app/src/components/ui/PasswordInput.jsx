import { useState } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordInput = ({ value, onChange, error, disabled, label = 'Password *' }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel htmlFor="password" error={error}>
        {label}
      </InputLabel>
      <OutlinedInput
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        autoComplete="current-password"
        disabled={disabled}
        error={error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
};

export default PasswordInput;