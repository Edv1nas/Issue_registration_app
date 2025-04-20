const API_BASE_URL = 'http://localhost:8000/api/v1';

export const verifyToken = async (token) => {
  const response = await fetch(`${API_BASE_URL}/tokens/verify_token/${token}`);
  if (!response.ok) throw new Error('Token verification failed');
  return true;
};