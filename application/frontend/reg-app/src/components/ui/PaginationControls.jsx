import React from 'react';
import { 
  Box, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Typography,
  useTheme
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
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
  
  const sizeConfig = {
    small: {
      buttonSize: 'small',
      typography: 'body2',
      padding: '4px',
      selectWidth: 100,
      iconColor: theme.palette.text.secondary
    },
    medium: {
      buttonSize: 'medium',
      typography: 'body1',
      padding: '8px',
      selectWidth: 120,
      iconColor: theme.palette.text.primary
    },
    large: {
      buttonSize: 'large',
      typography: 'h6',
      padding: '12px',
      selectWidth: 140,
      iconColor: theme.palette.text.primary
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        p: config.padding,
        borderTop: `1px solid ${theme.palette.divider}`,
        ...sx
      }}
    >
      {showCount && (
        <Typography 
          variant={config.typography} 
          sx={{ 
            mr: 2,
            color: theme.palette.text.secondary
          }}
        >
          {count === 0 ? 'No items' : `Showing ${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, count)} of ${count}`}
        </Typography>
      )}
      
      <FormControl 
        size={config.buttonSize} 
        sx={{ 
          m: 1, 
          minWidth: config.selectWidth 
        }}
      >
        <InputLabel sx={{ color: theme.palette.text.secondary }}>
          Rows
        </InputLabel>
        <Select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          label="Rows"
          sx={{
            color: theme.palette.text.primary,
            '& .MuiSelect-icon': {
              color: theme.palette.text.secondary
            }
          }}
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          aria-label="First page"
          size={config.buttonSize}
          sx={{ color: config.iconColor }}
        >
          <FirstPage fontSize={size} />
        </IconButton>

        <IconButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
          size={config.buttonSize}
          sx={{ color: config.iconColor }}
        >
          <KeyboardArrowLeft fontSize={size} />
        </IconButton>

        <IconButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next page"
          size={config.buttonSize}
          sx={{ color: config.iconColor }}
        >
          <KeyboardArrowRight fontSize={size} />
        </IconButton>

        <IconButton
          onClick={() => onPageChange(Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last page"
          size={config.buttonSize}
          sx={{ color: config.iconColor }}
        >
          <LastPage fontSize={size} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PaginationControls;