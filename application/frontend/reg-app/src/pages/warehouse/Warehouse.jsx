import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container, Typography, Box, Grid, TextField, FormControl,
  InputLabel, Select, MenuItem, Button, DialogActions, DialogContentText, DialogContent,
  DialogTitle, Dialog, Snackbar, Alert, CircularProgress, Backdrop
} from '@mui/material';
import {
  getAllItems, createNewItem, updateItem, deleteItem
} from '../../api/itemApi';
import AddItemForm from '../warehouse/components/AddItemForm';
import ItemTable from '../warehouse/components/ItemTable';
import EditItemDialog from '../warehouse/components/EditItemDialog';

const CATEGORY_OPTIONS = ['All', 'Electronics', 'Furniture', 'Clothing', 'Tools'];

const WarehousePage = () => {
  // State management
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get token (consider moving to context/hook in real app)
  const token = useMemo(() => localStorage.getItem('token'), []);

  // Error handler utility
  const handleError = useCallback((error, defaultMessage = 'An error occurred') => {
    console.error(error);
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    setError(errorMessage);
  }, []);

  // Success handler utility
  const showSuccess = useCallback((message) => {
    setSuccess(message);
  }, []);

  // Fetch items with error handling
  const fetchItems = useCallback(async () => {
    if (!token) {
      setError('Authentication token not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getAllItems(token);
      setItems(data);
    } catch (err) {
      handleError(err, 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  // Initial data fetch
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Add item handler with error handling
  const handleAddItem = useCallback(async (itemData) => {
    if (!token) {
      setError('Authentication token not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newItem = await createNewItem(itemData, token);
      // Optimistic update instead of refetching all items
      setItems(prevItems => [...prevItems, newItem]);
      showSuccess('Item added successfully');
    } catch (err) {
      handleError(err, 'Failed to add item');
      // If optimistic update fails, refetch to ensure consistency
      fetchItems();
    } finally {
      setLoading(false);
    }
  }, [token, handleError, showSuccess, fetchItems]);

  // Edit item handler with error handling
  const handleEditItem = useCallback(async (itemId, updatedData) => {
    if (!token) {
      setError('Authentication token not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedItem = await updateItem(itemId, updatedData, token);
      // Optimistic update
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      );
      setEditItem(null);
      showSuccess('Item updated successfully');
    } catch (err) {
      handleError(err, 'Failed to update item');
      // If optimistic update fails, refetch to ensure consistency
      fetchItems();
    } finally {
      setLoading(false);
    }
  }, [token, handleError, showSuccess, fetchItems]);

  // Delete click handler
  const handleDeleteClick = useCallback((itemId) => {
    setItemToDelete(itemId);
  }, []);

  // Confirm delete handler with error handling
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete || !token) {
      setError('Invalid delete operation');
      return;
    }

    setDeleteLoading(true);
    setError('');

    try {
      await deleteItem(itemToDelete, token);
      // Optimistic update
      setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete));
      setItemToDelete(null);
      showSuccess('Item deleted successfully');
    } catch (err) {
      handleError(err, 'Failed to delete item');
      // If optimistic update fails, refetch to ensure consistency
      fetchItems();
    } finally {
      setDeleteLoading(false);
    }
  }, [itemToDelete, token, handleError, showSuccess, fetchItems]);

  // Cancel delete handler
  const handleCancelDelete = useCallback(() => {
    setItemToDelete(null);
  }, []);

  // Close error/success notifications
  const handleCloseError = useCallback(() => setError(''), []);
  const handleCloseSuccess = useCallback(() => setSuccess(''), []);

  // Memoized filtered items to prevent unnecessary recalculations
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [items, categoryFilter, search]);

  // Event handlers with proper destructuring
  const handleSearchChange = useCallback(({ target: { value } }) => {
    setSearch(value);
  }, []);

  const handleCategoryChange = useCallback(({ target: { value } }) => {
    setCategoryFilter(value);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditItem(null);
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom mt={4}>
        Warehouse Management
      </Typography>

      {/* Add Item Form */}
      <AddItemForm onAdd={handleAddItem} disabled={loading} />

      {/* Search and Filter Controls */}
      <Box mt={4} mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search items..."
              value={search}
              onChange={handleSearchChange}
              disabled={loading}
              placeholder="Search by name or description"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={handleCategoryChange}
                label="Category"
                disabled={loading}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Items Table */}
      <ItemTable
        items={filteredItems}
        onEditClick={setEditItem}
        onDeleteClick={handleDeleteClick}
        loading={loading}
      />

      {/* Edit Item Dialog */}
      <EditItemDialog
        open={!!editItem}
        item={editItem}
        onClose={handleEditClose}
        onSave={handleEditItem}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!itemToDelete}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDelete}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={16} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Error Notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Notification */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WarehousePage;