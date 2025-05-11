// const API_BASE_URL = 'http://192.168.1.140:8000/api/v1'
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const verifyToken = async (token) => {
  const response = await fetch(`${API_BASE_URL}/tokens/verify_token/${token}`);
  if (!response.ok) throw new Error('Token verification failed');
  return true;
};