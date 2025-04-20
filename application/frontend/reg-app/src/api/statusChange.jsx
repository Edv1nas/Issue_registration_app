export const updateTaskStatus = async (taskId, statusName) => {
  const API_BASE_URL = 'http://192.168.1.140:8000/api/v1';
  
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/status?status_name=${encodeURIComponent(statusName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  };