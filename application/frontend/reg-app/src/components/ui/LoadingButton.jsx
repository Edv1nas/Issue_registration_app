import { Button, CircularProgress } from '@mui/material';

const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <Button {...props}>
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default LoadingButton;