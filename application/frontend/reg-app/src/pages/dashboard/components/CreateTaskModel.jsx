import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const CreateTaskModal = ({ open, handleClose, onCreateTask }) => {
  const [email, setEmail] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleCreate = async () => {
    if (!email.trim() || !summary.trim() || !description.trim()) {
      alert("All fields are required!");
      return;
    }

    try {
      let imagePath = null;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('api/v1/images/upload-image/', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        const uploadData = await uploadResponse.json();
        imagePath = uploadData.file_path;
      }

      onCreateTask({ client_email: email, summary, description, image_path: imagePath });
      setEmail('');
      setSummary('');
      setDescription('');
      setFile(null);
      handleClose();
    } catch (error) {
      alert(error.message);
    }
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
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>
        {file && <Typography variant="body2" mt={1}>Selected: {file.name}</Typography>}
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mt: 2 }}>
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateTaskModal;
