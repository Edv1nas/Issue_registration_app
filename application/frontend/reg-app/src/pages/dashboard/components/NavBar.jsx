import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateTaskModal from './CreateTaskModel';

const Navbar = ({ onCreateTask }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IT Issue Tracker
          </Typography>
          <Button color="inherit" onClick={() => setOpen(true)}>
            Create Task
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <CreateTaskModal open={open} handleClose={() => setOpen(false)} onCreateTask={onCreateTask} />
    </>
  );
};

export default Navbar;

