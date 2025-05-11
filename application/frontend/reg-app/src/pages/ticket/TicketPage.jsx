import React, { useState } from 'react';
import { Container, Box, Paper } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { createTask, updateTask } from '../../api/taskApi';
import { uploadFile } from '../../api/uploadApi';
import TicketForm from './TicketForm';
import SubmissionSuccess from '../../components/features/ticket/SubmissionSuccess';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';



const TicketPage = () => {
  const [email, setEmail] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!email.trim() || !summary.trim() || !description.trim()) {
      setErrorMessage('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        client_email: email.trim(),
        summary: summary.trim(),
        description: description.trim(),
      };

      const token = localStorage.getItem('token') || '';
      if (!token) {
        setErrorMessage('Authentication required.');
        setLoading(false);
        return;
      }

      const createdTask = await createTask(taskData, token); 

      let imagePath = null;

      if (file) {
        const uploadData = await uploadFile(file, createdTask.id);
        imagePath = uploadData.file_path;

        await updateTask(createdTask.id, { image_path: imagePath }, token);
      }

      setIsSubmitted(true);
      resetForm();
      
    } catch (error) {
      setErrorMessage(error.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setSummary('');
    setDescription('');
    setFile(null);
    setErrorMessage('');
  };

  const handleNewTicket = () => {
    setIsSubmitted(false);
    resetForm();
  };

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
        py={4}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            width: '100%', 
            textAlign: 'center',
            backgroundColor: themeMode === 'dark' ? 'background.paper' : undefined,
            position: 'relative'
          }}
        >
          <Box display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mb={3}
          >
            <IconButton 
              onClick={() => navigate('/')}
              sx={{
                color: themeMode === 'dark' ? 'text.secondary' : 'text.primary',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <ThemeToggle themeMode={themeMode} toggleTheme={toggleTheme} />
          </Box>
          
          {!isSubmitted ? (
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
              themeMode={themeMode}
            />
          ) : (
            <SubmissionSuccess 
              handleNewTicket={handleNewTicket} 
              themeMode={themeMode}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
}; 

export default TicketPage;