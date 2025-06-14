import React from 'react';
import { 
  Box, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Typography,
  useTheme,
  Tooltip,
  Chip,
  Paper,
  Stack
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  ViewList
} from '@mui/icons-material';

const PaginationControls = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  showCount = true,
  size = 'small',
  sx = {}
}) => {
  const theme = useTheme();
  
  // Enhanced size configuration
  const sizeConfig = {
    small: {
      buttonSize: 'small',
      typography: 'body2',
      padding: '4px 8px',
      selectWidth: 80,
      iconSize: 'small',
      chipHeight: 24,
      spacing: 0.5
    },
    medium: {
      buttonSize: 'medium',
      typography: 'body1',
      padding: '8px 12px',
      selectWidth: 100,
      iconSize: 'medium',
      chipHeight: 32,
      spacing: 1
    },
    large: {
      buttonSize: 'large',
      typography: 'h6',
      padding: '12px 16px',
      selectWidth: 120,
      iconSize: 'medium',
      chipHeight: 40,
      spacing: 1.5
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  
  // Calculate current page info
  const startItem = count === 0 ? 0 : page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, count);
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const currentPage = page + 1; // For display (1-based instead of 0-based)
  
  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  // Determine if pagination is needed
  const paginationNeeded = count > rowsPerPage;

  return (
    <Paper 
      elevation={0} 
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: config.padding,
        borderRadius: theme.shape.borderRadius,
        flexWrap: 'wrap',
        gap: 1,
        ...sx
      }}
    >
      {/* Left side: Item count information */}
      {showCount && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: theme.palette.text.secondary
        }}>
          <ViewList 
            fontSize={config.iconSize} 
            sx={{ 
              mr: 1, 
              color: theme.palette.primary.main,
              opacity: 0.8
            }} 
          />
          <Typography 
            variant={config.typography} 
            sx={{ fontWeight: 500 }}
          >
            {count === 0 ? (
              'No items'
            ) : count === 1 ? (
              '1 item'
            ) : (
              <>
                <Box component="span" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                  {startItem}-{endItem}
                </Box>
                {' of '}
                <Box component="span" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                  {count}
                </Box>
                {' items'}
              </>
            )}
          </Typography>
        </Box>
      )}
      
      {/* Right side: Pagination controls */}
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center"
        divider={
          <Box 
            component="span" 
            sx={{ 
              height: config.chipHeight, 
              borderLeft: `1px solid ${theme.palette.divider}`,
              mx: 0.5
            }}
          />
        }
      >
        {/* Rows per page selector */}
        <FormControl 
          size={config.buttonSize} 
          variant="outlined"
          sx={{ minWidth: config.selectWidth }}
        >
          <InputLabel id="rows-per-page-label">
            Rows
          </InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            label="Rows"
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Page navigation controls - only show when needed */}
        {paginationNeeded && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            {/* First page button */}
            <Tooltip title="First page">
              <span>
                <IconButton
                  onClick={() => onPageChange(0)}
                  disabled={page === 0}
                  aria-label="First page"
                  size={config.buttonSize}
                  color="primary"
                >
                  <FirstPage fontSize={config.iconSize} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Previous page button */}
            <Tooltip title="Previous page">
              <span>
                <IconButton
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 0}
                  aria-label="Previous page"
                  size={config.buttonSize}
                  color="primary"
                >
                  <KeyboardArrowLeft fontSize={config.iconSize} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Current page indicator */}
            <Chip
              label={`${currentPage} of ${totalPages}`}
              size={config.buttonSize}
              variant="outlined"
              sx={{
                height: config.chipHeight,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mx: 0.5,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />

            {/* Next page button */}
            <Tooltip title="Next page">
              <span>
                <IconButton
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  aria-label="Next page"
                  size={config.buttonSize}
                  color="primary"
                >
                  <KeyboardArrowRight fontSize={config.iconSize} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Last page button */}
            <Tooltip title="Last page">
              <span>
                <IconButton
                  onClick={() => onPageChange(Math.max(0, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  aria-label="Last page"
                  size={config.buttonSize}
                  color="primary"
                >
                  <LastPage fontSize={config.iconSize} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default PaginationControls;