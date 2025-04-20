import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const CreateTaskModal = ({ open, handleClose, onCreateTask }) => {
  const [email, setEmail] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!email.trim() || !summary.trim() || !description.trim()) {
      alert("Both fields are required!");
      return;
    }

    onCreateTask({ client_email: email, summary: summary, description: description });
    setEmail('');
    setSummary('');
    setDescription('');
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ width: 600, bgcolor: 'white', p: 3, mx: 'auto', mt: '20vh', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Create a New Task</Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Summary"
          variant="outlined"
          margin="normal"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={7}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mt: 2 }}>
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateTaskModal;
