import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, createTask, fetchTaskDetails } from '../api/taskApi';
import { verifyToken } from '../api/authApi';

const useTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      throw new Error('No authentication token found');
    }
    return token;
  }, [navigate]);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const tasksData = await fetchTasks(token);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  const handleCreateTask = async (newTask) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      await createTask(newTask, token);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      console.error('Error creating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = async (taskId) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
      return;
    }

    setExpandedTask(taskId);
    setIsLoading(true);
    
    try {
      const token = getToken();
      const details = await fetchTaskDetails(taskId, token);
      setTaskDetails(prev => ({ ...prev, [taskId]: details }));
    } catch (err) {
      setError(err.message);
      console.error('Error loading task details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = getToken();
        await verifyToken(token);
        await loadTasks();
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };
    initialize();
  }, [getToken, loadTasks, navigate]);

  return { 
    tasks, 
    expandedTask,
    taskDetails,
    isLoading,
    error, 
    toggleExpand, 
    handleCreateTask,
    refreshTasks: loadTasks
  };
};

export default useTasks;
