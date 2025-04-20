import React, { useState } from 'react';
import {Container, TextField, Button, Typography, Box,Alert, CircularProgress, Paper} from '@mui/material';
import { createTask } from '../../api/taskApi';

const TicketPage = () => {
  const [email, setEmail] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!email.trim() || !summary.trim() || !description.trim()) {
      setErrorMessage('All fields are required.');
      setLoading(false);
      return;
    }

    const ticketData = {
      client_email: email.trim(),
      summary: summary.trim(),
      description: description.trim(),
    };

    try {
      const token = localStorage.getItem('token') || '';
      await createTask(ticketData, token);

      setIsSubmitted(true);
      setEmail('');
      setSummary('');
      setDescription('');
    } catch (error) {
      setErrorMessage(error.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTicket = () => {
    setIsSubmitted(false);
    setEmail('');
    setSummary('');
    setDescription('');
    setErrorMessage('');
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
          {!isSubmitted ? (
            <>
              <Typography variant="h4" gutterBottom>Submit an IT Issue</Typography>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Issue Description"
                  multiline
                  rows={7}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  margin="normal"
                  required
                />
                <Box mt={2}>
                  <Button variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
                    {loading ? <CircularProgress size={24} /> : 'Submit Ticket'}
                  </Button>
                </Box>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>Thank You!</Typography>
              <Typography>Your IT issue has been successfully submitted.</Typography>
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleNewTicket} fullWidth>
                  Submit Another Ticket
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default TicketPage;
