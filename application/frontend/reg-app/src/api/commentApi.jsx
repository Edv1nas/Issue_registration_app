const API_BASE_URL = 'http://localhost:8000/api/v1';

export const fetchComments = async (taskId, token) => {
  const response = await fetch(`${API_BASE_URL}/comments/tasks/${taskId}/comments/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch comments');
  return await response.json();
};

export const createComment = async (taskId, commentData, token) => {
  const response = await fetch(`${API_BASE_URL}/comments/task/${taskId}/comment/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentData),
  });
  if (!response.ok) throw new Error('Failed to create comment');
  return await response.json();
};