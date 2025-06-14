import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, CircularProgress,
  InputAdornment
} from '@mui/material';

const CATEGORY_OPTIONS = ['Electronics', 'Furniture', 'Clothing', 'Tools'];

const EditItemDialog = ({ open, item, onClose, onSave, loading = false }) => {
  // Form state
  const [form, setForm] = useState({
    category: '',
    name: '',
    description: '',
    unit_price: ''
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Initialize form when dialog opens with item data
  useEffect(() => {
    if (open && item) {
      setForm({
        category: item.category || '',
        name: item.name || '',
        description: item.description || '',
        unit_price: item.unit_price !== undefined ? String(item.unit_price) : ''
      });
      // Clear errors when form is initialized
      setErrors({});
    }
  }, [item, open]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form state
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when it changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // Category validation
    if (!form.category) {
      newErrors.category = 'Category is required';
    }

    // Name validation
    if (!form.name || form.name.trim() === '') {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Description validation - optional field
    // No validation needed as it's optional

    // Unit price validation
    if (!form.unit_price || form.unit_price.trim() === '') {
      newErrors.unit_price = 'Unit price is required';
    } else {
      const price = parseFloat(form.unit_price);
      if (isNaN(price) || price < 0) {
        newErrors.unit_price = 'Please enter a valid positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save button click
  const handleSave = () => {
    // Validate form
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Prepare data for API
    const payload = {
      category: form.category,
      name: form.name.trim(),
      // Allow empty description (will be null)
      description: form.description.trim() || null,
      unit_price: parseFloat(form.unit_price) || 0
    };

    // Call parent save handler
    onSave(item.id, payload);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Edit Item
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {/* Category Field */}
          <TextField
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.category}
            helperText={errors.category || ''}
            disabled={loading}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Name Field */}
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.name}
            helperText={errors.name || ''}
            disabled={loading}
          />

          {/* Description Field */}
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            error={!!errors.description}
            helperText={errors.description || 'Optional'}
            disabled={loading}
            placeholder="Enter item description (optional)"
          />

          {/* Unit Price Field */}
          <TextField
            label="Unit Price"
            name="unit_price"
            value={form.unit_price}
            onChange={handleChange}
            fullWidth
            required
            type="number"
            margin="normal"
            error={!!errors.unit_price}
            helperText={errors.unit_price || ''}
            disabled={loading}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0, step: "0.01" }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
          color="primary"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemDialog;