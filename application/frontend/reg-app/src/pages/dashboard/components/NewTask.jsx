import { useState } from 'react';
import { Modal, Box} from '@mui/material';
import { uploadFile } from '../../../api/uploadApi';
import { useTheme } from '../../../context/ThemeContext';
import TicketForm from '../../ticket/TicketForm';

const CreateTaskModal = ({ open, handleClose, onCreateTask }) => {
  const [email, setEmail] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { themeMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !summary.trim() || !description.trim()) {
      setErrorMessage('All fields are required');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      let imagePath = null;

      if (file) {
        const uploadData = await uploadFile(file);
        imagePath = uploadData.file_path;
      }

      onCreateTask({ client_email: email, summary, description, image_path: imagePath });

      setEmail('');
      setSummary('');
      setDescription('');
      setFile(null);
      handleClose();
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 600,
          bgcolor: themeMode === 'dark' ? 'background.default' : 'white',
          color: themeMode === 'dark' ? 'text.primary' : 'dark',
          p: 3,
          mx: 'auto',
          mt: '20vh',
          borderRadius: 2,
          boxShadow: 6
        }}
      >
        <TicketForm
          email={email}
          setEmail={setEmail}
          summary={summary}
          setSummary={setSummary}
          description={description}
          setDescription={setDescription}
          file={file}
          setFile={setFile}
          loading={loading}
          errorMessage={errorMessage}
          handleSubmit={handleSubmit}
        />
      </Box>
    </Modal>
  );
};

export default CreateTaskModal;