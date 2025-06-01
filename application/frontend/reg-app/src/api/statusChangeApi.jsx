const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const updateTaskStatus = async (taskId, statusName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tasks/tasks/${taskId}/status?status_name=${encodeURIComponent(statusName)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Failed to update task status:', errorData);
      throw new Error('Failed to update task status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};
