import React from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SubmissionSuccess = ({ handleNewTicket, themeMode }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      p: 4
    }}>
      <CheckCircleOutlineIcon 
        color="success" 
        sx={{ 
          fontSize: 80,
          mb: 2,
          color: themeMode === 'dark' ? '#4caf50' : '#2e7d32'
        }} 
      />
      
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Form Submitted Successfully!
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        Your support form has been received. We'll get back to you soon.
      </Typography>

      <Button
        variant="contained"
        onClick={handleNewTicket}
        sx={{
          px: 4,
          py: 1.5,
          backgroundColor: themeMode === 'dark' ? '#4caf50' : '#2e7d32',
          '&:hover': {
            backgroundColor: themeMode === 'dark' ? '#3d8b40' : '#1b5e20'
          }
        }}
      >
        Submit Another Form
      </Button>

    </Box>
  );
};

export default SubmissionSuccess;