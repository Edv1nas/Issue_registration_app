const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const updateTaskPriority = async (taskId, priorityName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tasks/tasks/${taskId}/priority?priority_name=${encodeURIComponent(priorityName)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Failed to update task priority:', errorData);
      throw new Error('Failed to update task priority');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating task priority:', error);
    throw error;
  }
};
