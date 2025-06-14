import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllItems, getItemsByCategory } from '../api/itemApi';
import { verifyToken } from '../api/authApi';

const useItems = (category = null, refreshTrigger) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      throw new Error('No authentication token found');
    }
    return token;
  }, [navigate]);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      await verifyToken(token); // Verify token is still valid
      
      let itemsData;
      if (category) {
        itemsData = await getItemsByCategory(category, token);
      } else {
        itemsData = await getAllItems(token);
      }
      setItems(itemsData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading items:', err);
      // If token verification fails, clear storage and redirect
      if (err.message.includes('token') || err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [getToken, category, navigate]);

  const refreshItems = useCallback(async () => {
    await loadItems();
  }, [loadItems]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = getToken();
        await verifyToken(token);
        await loadItems();
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    initialize();
  }, [getToken, loadItems, navigate, refreshTrigger]);

  return { 
    items, 
    isLoading,
    error, 
    refreshItems
  };
};

export default useItems;