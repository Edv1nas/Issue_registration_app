import React, { useState, useEffect} from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Select, MenuItem, Typography, Box } from '@mui/material';
import { updateTaskStatus } from '../../../api/statusChangeApi';
import { updateTaskPriority } from '../../../api/priorityChangeApi';
import { updateTaskAssingnee } from '../../../api/assigneeChangeApi';
import { fetchUsers } from '../../../api/usersApi';

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

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Low':
      return 'textSecondary';
    case 'Medium':
      return 'info.main';
    case 'High':
      return 'warning.main';
    case 'Critical':
      return 'error.main';
    default:
      return 'textPrimary';
  }
};

const statusOptions = ['Waiting for support', 'In progress', 'Done'];
const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

const TaskRow = ({ task, expandedTask, toggleExpand }) => {
  const [status, setStatus] = useState(task.status.name);
  const [priority, setPriority] = useState(task.priority?.name || '');
  const [assignee, setAssignee] = useState(task.assigned_account?.id || '');

  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  useEffect(() => {
  fetchUsers().then(setAssigneeOptions).catch(console.error);
}, []);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    try {
      await updateTaskStatus(task.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriorityChange = async (event) => {
    const newPriority = event.target.value;
    setPriority(newPriority);
    try {
      await updateTaskPriority(task.id, newPriority);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleAssigneeChange = async (event) => {
    const newAssigneeId = event.target.value;
    setAssignee(newAssigneeId);
    try {
      await updateTaskAssingnee(task.id, newAssigneeId);
    } catch (error) {
      console.error('Failed to update assignee:', error);
    }
  };

  return (
    <TableRow key={task.id}>
      <TableCell align="left" onClick={() => toggleExpand(task.id)} sx={{ cursor: 'pointer', width: 90 }}>
        {"IS-" + task.id}
      </TableCell>

      <TableCell align="left" sx={{ width: 150 }}>{task.client_email}</TableCell>
      <TableCell align="left" sx={{ width: 150 }}>{task.summary}</TableCell>

      <TableCell align="left" sx={{ width: 180 }}>
        <Box sx={{ minHeight: 32, display: 'flex', alignItems: 'center' }}>
          {editingStatus ? (
            <Select
              value={status}
              onChange={handleStatusChange}
              onBlur={() => setEditingStatus(false)}
              autoFocus
              variant="standard"
              disableUnderline
              sx={{ color: getStatusColor(status), fontSize: '0.875rem', padding: 0 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              sx={{ color: getStatusColor(status), cursor: 'pointer', fontSize: '0.875rem' }}
              onClick={() => setEditingStatus(true)}
            >
              {status}
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell align="left" sx={{ width: 110 }}>
        <Box sx={{ minHeight: 32, display: 'flex', alignItems: 'center' }}>
          {editingAssignee ? (
            <Select
              value={assignee}
              onChange={handleAssigneeChange}
              onBlur={() => setEditingAssignee(false)}
              autoFocus
              variant="standard"
              disableUnderline
              sx={{ fontSize: '0.875rem', padding: 0 }}
            >
              {assigneeOptions.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
              onClick={() => setEditingAssignee(true)}
            >
              {assigneeOptions.find((user) => user.id === assignee)?.username || 'Unassigned'}
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell align="left" sx={{ width: 110 }}>
        <Box sx={{ minHeight: 32, display: 'flex', alignItems: 'center' }}>
          {editingPriority ? (
            <Select
              value={priority}
              onChange={handlePriorityChange}
              onBlur={() => setEditingPriority(false)}
              autoFocus
              variant="standard"
              disableUnderline
              sx={{ color: getPriorityColor(priority), fontSize: '0.875rem', padding: 0 }}
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              sx={{ color: getPriorityColor(priority), cursor: 'pointer', fontSize: '0.875rem' }}
              onClick={() => setEditingPriority(true)}
            >
              {priority}
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell align="left" sx={{ width: 110 }}>{dateViewValue(task.created_at)}</TableCell>
      <TableCell align="left" sx={{ width: 110 }}>{dateViewValue(task.updated_at)}</TableCell>
    </TableRow>
  );
};

export default TaskRow;
