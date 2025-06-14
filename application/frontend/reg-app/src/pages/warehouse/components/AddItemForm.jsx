import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  MenuItem, 
  Grid, 
  Typography, 
  Paper,
  InputAdornment
} from '@mui/material';

const CATEGORY_OPTIONS = ['Electronics', 'Furniture', 'Clothing', 'Tools'];

const AddItemForm = ({ onAdd, disabled = false }) => {
  // Form state
  const [form, setForm] = useState({
    category: '',
    name: '',
    description: '',
    unit_price: ''
  });

  // Error state
  const [errors, setErrors] = useState({});

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

  // Validate form
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

    // Unit price validation
    if (!form.unit_price || form.unit_price.trim() === '') {
      newErrors.unit_price = 'Unit price is required';
    } else {
      const price = parseFloat(form.unit_price);
      if (isNaN(price)) {
        newErrors.unit_price = 'Please enter a valid number';
      } else if (price <= 0) {
        newErrors.unit_price = 'Price must be greater than zero';
      } else if (price > 999999.99) {
        newErrors.unit_price = 'Price cannot exceed 999,999.99';
      }

      // Check for more than 2 decimal places
      if (form.unit_price.includes('.') && form.unit_price.split('.')[1]?.length > 2) {
        newErrors.unit_price = 'Price can have at most 2 decimal places';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const newItem = {
      category: form.category,
      name: form.name.trim(),
      description: form.description.trim() || null,
      unit_price: parseFloat(form.unit_price)
    };

    // Call parent add handler
    onAdd(newItem);

    // Reset form
    setForm({
      category: '',
      name: '',
      description: '',
      unit_price: ''
    });

    // Clear errors
    setErrors({});
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add New Item
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
              disabled={disabled}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
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
              disabled={disabled}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                inputProps: { 
                  min: 0.01, 
                  step: 0.01,
                  max: 999999.99
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={1}
              margin="normal"
              placeholder="Optional description"
              disabled={disabled}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={disabled}
              >
                Add Item
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddItemForm;