import React, { useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, IconButton,
  Paper, TableContainer, Typography, Box, Tooltip,
  Chip, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import NoDataIcon from '@mui/icons-material/Inbox';
import PaginationControls from '../../../components/ui/PaginationControls'; // Import your custom pagination component

// Category color mapping for visual distinction
const CATEGORY_COLORS = {
  'Electronics': 'primary',
  'Furniture': 'success',
  'Clothing': 'secondary',
  'Tools': 'warning'
};

const ItemTable = ({ 
  items = [], 
  onEditClick, 
  onDeleteClick, 
  loading = false 
}) => {
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle page change
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Calculate paginated items
  const paginatedItems = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format currency with Euro symbol
  const formatPrice = (price) => {
    return `${price.toFixed(2)} €`;
  };

  // Truncate long text with ellipsis
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    return text.length > maxLength 
      ? `${text.substring(0, maxLength)}...` 
      : text;
  };

  return (
    <Paper elevation={2}>
      <TableContainer>
        <Table aria-label="Items table">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Loading items...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <NoDataIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No items found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add a new item or adjust your search filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Chip 
                      label={item.category} 
                      size="small" 
                      color={CATEGORY_COLORS[item.category] || 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.description ? (
                      <Tooltip title={item.description} arrow placement="top">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 0.5 }}>
                            {truncateText(item.description)}
                          </Typography>
                          {item.description.length > 50 && (
                            <InfoIcon fontSize="small" color="action" />
                          )}
                        </Box>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Updated unit price without color styling */}
                    <Typography variant="body2" fontWeight="medium">
                      {formatPrice(item.unit_price)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit item">
                      <IconButton 
                        onClick={() => onEditClick(item)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete item">
                      <IconButton 
                        onClick={() => onDeleteClick(item.id)} 
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Custom Pagination Controls */}
      {!loading && items.length > 0 && (
        <PaginationControls
          count={items.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          showCount={true}
          size="small"
        />
      )}
    </Paper>
  );
};

export default ItemTable;