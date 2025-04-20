import { useState } from 'react';
import { fetchComments, createComment } from '../api/commentApi';

const useComments = () => {
    const [comments, setComments] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            throw new Error('Authentication required. Please log in.');
        }
        return token;
    };

    const loadComments = async (taskId) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = getToken();
            const taskComments = await fetchComments(taskId, token);
            setComments(prev => ({ ...prev, [taskId]: taskComments }));
        } catch (err) {
            setError(err.message);
            console.error('Error loading comments:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addComment = async (taskId, commentText) => {
        if (!commentText.trim()) return;
        
        setIsLoading(true);
        try {
            const token = getToken();
            const commentData = { comment_text: commentText };
            const createdComment = await createComment(taskId, commentData, token);

            console.log('Comment added successfully:', createdComment);

            setComments(prev => ({
                ...prev,
                [taskId]: [...(prev[taskId] || []), createdComment]
            }));

            return true;
        } catch (err) {
            setError(err.message);
            console.error('Error adding comment:', err);
            alert(`Failed to add comment: ${err.message}`);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { comments, isLoading, error, loadComments, addComment };
};

export default useComments;
