import {
  Box, TextField, Typography, Alert, Link,} from '@mui/material';
import PasswordInput from '../../../components/ui/PasswordInput';
import LoadingButton from '../../../components/ui/LoadingButton';

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  error,
  setError,
  loading,
  formValid,
  onSubmit,
  onSupportClick,
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        error={!!error && !username}
      />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error && !password}
        disabled={loading}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !formValid}
        loading={loading}
        sx={{ mt: 3, mb: 2, py: 1.5 }}
      >
        Sign In
      </LoadingButton>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link href="#" variant="body2" onClick={onSupportClick}>
          Forgot password?
        </Link>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link href="#" variant="body2" onClick={onSupportClick}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;