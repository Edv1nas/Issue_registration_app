import { 
    Box,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';

const formatDate = (dateString) => {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const CommentItem = ({ comment }) => {
    return (
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
            <Box display="flex" gap={2}>
                <Box flex={1}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight="bold">
                            {comment.author || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.created_at)}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {comment.comment_text}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

const CommentList = ({ comments, isLoading }) => {
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    No comments yet
                </Typography>
            ) : (
                comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                ))
            )}
        </Box>
    );
};

export default CommentList;