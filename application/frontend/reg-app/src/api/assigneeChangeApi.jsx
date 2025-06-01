const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const updateTaskAssingnee = async (taskId, userID) => {
  const response = await fetch(`${API_BASE_URL}/tasks/tasks/${taskId}/assignee?user_id=${userID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Assignee update failed:', errorData);
    throw new Error('Failed to update assignee');
  }

  return await response.json();
};

