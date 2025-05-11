import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Link} from '@mui/material';
import AuthLayout from '../../../components/layout/AuthLayout';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import LoginForm from './LoginForm';
import AuthDialog from '../../../components/features/auth/AuthDialog';
import ThemeLogo from '../../../components/ui/ThemeLogo';
import { useTheme } from '../../../context/ThemeContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {themeMode, toggleTheme} = useTheme();

  const navigate = useNavigate();
  // const API_BASE_URL = 'http://192.168.1.140:8000/api/v1';
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    setFormValid(username.trim().length > 0 && password.length > 0);
  }, [username, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formValid) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/tokens/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: username.toLowerCase().trim(),
          password: password,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Authentication failed.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('token_timestamp', Date.now().toString());
      navigate('/Dashboard', { replace: true });
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleSupportClick = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  return (
    <AuthLayout>
      <Box display="flex" justifyContent="flex-end">
        <ThemeToggle themeMode={themeMode} toggleTheme={toggleTheme} />
      </Box>
      
      <Box sx={{ 
        textAlign: 'center', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <ThemeLogo size={90} /> 
      </Box>

      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        error={error}
        setError={setError}
        loading={loading}
        formValid={formValid}
        onSubmit={handleSubmit}
        onSupportClick={handleSupportClick}
      />

      <AuthDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Need Help?"
        content={
          <Typography variant="body1" component="div">
            Please contact your IT support team to reset your password, request account access, or fill out the {' '}
            <Link 
              href="/Form"  
              onClick={(e) => {
                e.preventDefault();
                navigate('/Form');
                setDialogOpen(false);
              }}
              sx={{
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
                color: (theme) => theme.palette.primary.main
              }}
            >
              form
            </Link>
            .
          </Typography>
        }
      />
    </AuthLayout>
  );
};

export default LoginPage;