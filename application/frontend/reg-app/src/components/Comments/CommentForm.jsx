import { TextField, Button, ButtonGroup, CircularProgress, Box} from '@mui/material';
import { useState } from 'react';

const CommentForm = ({ onSubmit, isLoading }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onSubmit(comment);
            setComment('');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={isLoading}
            />
            
            <ButtonGroup sx={{ mt: 1, float: 'right' }}>
                <Button 
                    onClick={() => setComment('')}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="contained"
                    color="primary"
                    disabled={!comment.trim() || isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default CommentForm;