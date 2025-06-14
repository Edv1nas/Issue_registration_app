import { useState, useCallback } from 'react';
import { Modal, Box } from '@mui/material';
import { uploadFile } from '../../../api/uploadApi';
import { useTheme } from '../../../context/ThemeContext';
import TicketForm from '../../ticket/TicketForm';

// Constants
const MODAL_STYLES = {
  width: 600,
  p: 3,
  mx: 'auto',
  mt: '20vh',
  borderRadius: 2,
  boxShadow: 6
};

const INITIAL_FORM_STATE = {
  email: '',
  summary: '',
  description: '',
  file: null
};

// Utility functions
const validateForm = (email, summary, description) => {
  if (!email.trim() || !summary.trim() || !description.trim()) {
    return 'All fields are required';
  }
  return null;
};

const getModalBoxStyles = (themeMode) => ({
  ...MODAL_STYLES,
  bgcolor: themeMode === 'dark' ? 'background.default' : 'white',
  color: themeMode === 'dark' ? 'text.primary' : 'dark',
});

// Custom hook for form state management
const useFormState = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrorMessage('');
  }, []);

  const setError = useCallback((error) => {
    setErrorMessage(error);
  }, []);

  return {
    formData,
    loading,
    errorMessage,
    setLoading,
    updateField,
    resetForm,
    setError
  };
};

const CreateTaskModal = ({ open, handleClose, onCreateTask }) => {
  const { themeMode } = useTheme();
  const {
    formData,
    loading,
    errorMessage,
    setLoading,
    updateField,
    resetForm,
    setError
  } = useFormState();

  const { email, summary, description, file } = formData;

  // Form field handlers
  const setEmail = useCallback((value) => updateField('email', value), [updateField]);
  const setSummary = useCallback((value) => updateField('summary', value), [updateField]);
  const setDescription = useCallback((value) => updateField('description', value), [updateField]);
  const setFile = useCallback((value) => updateField('file', value), [updateField]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file) => {
    if (!file) return null;
    
    try {
      const uploadData = await uploadFile(file);
      return uploadData.file_path;
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm(email, summary, description);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Handle file upload if present
      const imagePath = await handleFileUpload(file);

      // Create task
      await onCreateTask({
        client_email: email,
        summary,
        description,
        image_path: imagePath
      });

      // Reset form and close modal
      resetForm();
      handleClose();
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [email, summary, description, file, onCreateTask, handleClose, resetForm, setError, setLoading, handleFileUpload]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    if (!loading) {
      resetForm();
      handleClose();
    }
  }, [loading, resetForm, handleClose]);

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={getModalBoxStyles(themeMode)}>
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