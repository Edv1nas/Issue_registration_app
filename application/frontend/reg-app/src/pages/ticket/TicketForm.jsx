import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
  Stack,
  Avatar
} from '@mui/material';
import {
  Email as EmailIcon,
  Subject as SubjectIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Clear as ClearIcon
} from '@mui/icons-material';


const TicketForm = ({
    email,
    setEmail,
    summary,
    setSummary,
    description,
    setDescription,
    file,
    setFile,
    loading,
    errorMessage,
    handleSubmit,
}) => {

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            IT Support Form
        </Typography>

        {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
            </Typography>
        )}

        <Stack spacing={3}>
            <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <EmailIcon color="action" />
                </InputAdornment>
                ),
            }}
            disabled={loading}
            />

            <TextField
            fullWidth
            label="Summary"
            variant="outlined"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <SubjectIcon color="action" />
                </InputAdornment>
                ),
            }}
            disabled={loading}
            />

            <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment 
                        position="start"
                        sx={{
                            alignItems: 'flex-start'
                        }}
                    >
                    <DescriptionIcon color="action" />
                </InputAdornment>
                ),
                sx: {
                alignItems: 'flex-start'
                }
            }}
            disabled={loading}
            />

            <FormControl fullWidth>
            <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFileIcon />}
                disabled={loading}
            >
                Attach File
                <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                />
            </Button>
            {file && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                    <AttachFileIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {file.name}
                </Typography>
                <IconButton size="small" onClick={handleRemoveFile} disabled={loading}>
                    <ClearIcon fontSize="small" />
                </IconButton>
                </Box>
            )}
            <FormHelperText>Max file size: 5MB (Images, PDF, Word)</FormHelperText>
            </FormControl>

            <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ py: 1.5 }}
            >
            {loading ? 'Submitting...' : 'Submit Ticket'}
            </Button>
        </Stack>
        </Box>
    );
    };

export default TicketForm;