const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchTasks = async (token) => {
  const response = await fetch(`${API_BASE_URL}/tasks/tasks/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return await response.json();
};

export const createTask = async (taskData, token) => {
  const response = await fetch(`${API_BASE_URL}/tasks/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return await response.json();
};

export const fetchTaskDetails = async (taskId, token) => {
  const response = await fetch(`${API_BASE_URL}/tasks/tasks/${taskId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch task details');
  return await response.json();
};

export const updateTask = async (taskId, taskData, token) => {
  const response = await fetch(`${API_BASE_URL}/tasks/tasks/${taskId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return await response.json();
};