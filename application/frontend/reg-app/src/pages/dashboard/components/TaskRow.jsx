import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Select, MenuItem, Typography, Box} from '@mui/material';
import { updateTaskStatus } from '../../../api/statusChange';

// const dateViewValue = (value) => value ? new Date(value).toLocaleString() : 'Never';

const dateViewValue = (value) => {
  if (!value) return 'Never';
  
  const date = new Date(value);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Waiting for support':
      return 'textSecondary'; 
    case 'In progress':
      return 'warning.main'; 
    case 'Done':
      return 'success.main'; 
    default:
      return 'textPrimary'; 
  }
};

const statusOptions = ['Waiting for support', 'In progress', 'Done'];

const TaskRow = ({ task, expandedTask, toggleExpand }) => {
  const [status, setStatus] = useState(task.status.name);
  const [editing, setEditing] = useState(false);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    try {
      await updateTaskStatus(task.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };


return (
  <TableRow key={task.id}>
    <TableCell
      align="left"
      onClick={() => toggleExpand(task.id)}
      sx={{ cursor: 'pointer' }}
    >
      {"IS-" + task.id}
    </TableCell>

    <TableCell align="left">{task.client_email}</TableCell>
    <TableCell align="left">{task.summary}</TableCell>

    <TableCell align="left" sx={{ minWidth: 180 }}>
      <Box sx={{ minHeight: 32, display: 'flex', alignItems: 'center' }}>
        {editing ? (
          <Select
            value={status}
            onChange={handleStatusChange}
            onBlur={() => setEditing(false)}
            autoFocus
            variant="standard"
            disableUnderline
            sx={{
              color: getStatusColor(status),
              fontSize: '0.875rem',
              padding: 0,
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography
            sx={{
              color: getStatusColor(status),
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
            onClick={() => setEditing(true)}
          >
            {status}
          </Typography>
        )}
      </Box>
    </TableCell>


    <TableCell align="left">{task.priority}</TableCell>
    <TableCell align="left">{task.assignee}</TableCell>
    <TableCell align="left">{dateViewValue(task.created_at)}</TableCell>
    <TableCell align="left">{dateViewValue(task.updated_at)}</TableCell>
  </TableRow>
);
};

export default TaskRow;
