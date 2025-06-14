import React, { useState, useEffect, useCallback } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Select, MenuItem, Typography, Box } from '@mui/material';
import { updateTaskStatus } from '../../../api/statusChangeApi';
import { updateTaskPriority } from '../../../api/priorityChangeApi';
import { updateTaskAssingnee } from '../../../api/assigneeChangeApi';
import { fetchUsers } from '../../../api/usersApi';

// Constants
const STATUS_OPTIONS = ['Waiting for support', 'In progress', 'Done'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

const STATUS_COLORS = {
  'Waiting for support': 'textSecondary',
  'In progress': 'warning.main',
  'Done': 'success.main',
};

const PRIORITY_COLORS = {
  'Low': 'textSecondary',
  'Medium': 'info.main',
  'High': 'warning.main',
  'Critical': 'error.main',
};

// Utility functions
const formatDate = (value) => {
  if (!value) return 'Never';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status) => STATUS_COLORS[status] || 'textPrimary';
const getPriorityColor = (priority) => PRIORITY_COLORS[priority] || 'textPrimary';

// Reusable EditableCell component
const EditableCell = ({ 
  value, 
  options, 
  isEditing, 
  setIsEditing, 
  onChange, 
  getColor, 
  displayValue,
  width 
}) => (
  <TableCell align="left" sx={{ width }}>
    <Box sx={{ minHeight: 32, display: 'flex', alignItems: 'center' }}>
      {isEditing ? (
        <Select
          value={value}
          onChange={onChange}
          onBlur={() => setIsEditing(false)}
          autoFocus
          variant="standard"
          disableUnderline
          sx={{ 
            color: getColor ? getColor(value) : 'inherit', 
            fontSize: '0.875rem', 
            padding: 0 
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value || option} value={option.value || option}>
              {option.label || option}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Typography
          sx={{ 
            color: getColor ? getColor(value) : 'inherit', 
            cursor: 'pointer', 
            fontSize: '0.875rem' 
          }}
          onClick={() => setIsEditing(true)}
        >
          {displayValue || value}
        </Typography>
      )}
    </Box>
  </TableCell>
);

const TaskRow = ({ task, expandedTask, toggleExpand }) => {
  // State management
  const [status, setStatus] = useState(task.status.name);
  const [priority, setPriority] = useState(task.priority?.name || '');
  const [assignee, setAssignee] = useState(task.assigned_account?.id || '');
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  // Editing states
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState(false);

  // Load users on mount
  useEffect(() => {
    fetchUsers()
      .then(setAssigneeOptions)
      .catch((error) => console.error('Failed to fetch users:', error));
  }, []);

  // Generic update handler
  const handleUpdate = useCallback(async (updateFn, setValue, newValue, errorMessage) => {
    setValue(newValue);
    try {
      await updateFn(task.id, newValue);
    } catch (error) {
      console.error(errorMessage, error);
      // Optionally revert the state on error
    }
  }, [task.id]);

  // Specific handlers
  const handleStatusChange = useCallback((event) => {
    handleUpdate(
      updateTaskStatus, 
      setStatus, 
      event.target.value, 
      'Failed to update status:'
    );
  }, [handleUpdate]);

  const handlePriorityChange = useCallback((event) => {
    handleUpdate(
      updateTaskPriority, 
      setPriority, 
      event.target.value, 
      'Failed to update priority:'
    );
  }, [handleUpdate]);

  const handleAssigneeChange = useCallback((event) => {
    handleUpdate(
      updateTaskAssingnee, 
      setAssignee, 
      event.target.value, 
      'Failed to update assignee:'
    );
  }, [handleUpdate]);

  // Prepare assignee options for EditableCell
  const assigneeSelectOptions = assigneeOptions.map(user => ({
    value: user.id,
    label: user.username
  }));

  const currentAssigneeName = assigneeOptions.find(user => user.id === assignee)?.username || 'Unassigned';

  return (
    <TableRow key={task.id}>
      <TableCell 
        align="left" 
        onClick={() => toggleExpand(task.id)} 
        sx={{ cursor: 'pointer', width: 90 }}
      >
        {`IS-${task.id}`}
      </TableCell>

      <TableCell align="left" sx={{ width: 150 }}>
        {task.client_email}
      </TableCell>

      <TableCell align="left" sx={{ width: 150 }}>
        {task.summary}
      </TableCell>

      <EditableCell
        value={status}
        options={STATUS_OPTIONS}
        isEditing={editingStatus}
        setIsEditing={setEditingStatus}
        onChange={handleStatusChange}
        getColor={getStatusColor}
        width={180}
      />

      <EditableCell
        value={assignee}
        options={assigneeSelectOptions}
        isEditing={editingAssignee}
        setIsEditing={setEditingAssignee}
        onChange={handleAssigneeChange}
        displayValue={currentAssigneeName}
        width={110}
      />

      <EditableCell
        value={priority}
        options={PRIORITY_OPTIONS}
        isEditing={editingPriority}
        setIsEditing={setEditingPriority}
        onChange={handlePriorityChange}
        getColor={getPriorityColor}
        width={110}
      />

      <TableCell align="left" sx={{ width: 110 }}>
        {formatDate(task.created_at)}
      </TableCell>

      <TableCell align="left" sx={{ width: 110 }}>
        {formatDate(task.updated_at)}
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;