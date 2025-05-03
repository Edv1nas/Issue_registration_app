import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,} from '@mui/material';

const AuthDialog = ({ open, onClose, title, content }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;