const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/accounts/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
};