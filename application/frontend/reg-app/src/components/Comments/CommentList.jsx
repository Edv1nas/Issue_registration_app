import { 
    Box,
    Typography,
    Paper,
    CircularProgress,
    useTheme
  } from '@mui/material';
  import { formatDistanceToNow } from 'date-fns';
  
  const CommentItem = ({ comment }) => {
    const theme = useTheme();
  
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 2, 
          bgcolor: theme.palette.mode === 'dark' ? 
            theme.palette.grey[800] : 
            theme.palette.grey[100],
          borderRadius: 2
        }}
      >
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight="bold">
              {comment.author || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
            {comment.comment_text}
          </Typography>
        </Box>
      </Paper>
    );
  };
  
  const CommentList = ({ comments, isLoading, error }) => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      );
    }
  
    if (error) {
      return (
        <Box display="flex" justifyContent="center" py={2}>
          <Typography color="error">
            Failed to load comments: {error.message}
          </Typography>
        </Box>
      );
    }
  
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Comments: ({comments.length})
        </Typography>
        
        {comments.length === 0 ? (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textAlign: 'center', py: 4 }}
          >
          </Typography>
        ) : (
          <>
            {comments.map(comment => (
              <CommentItem key={comment.id || comment._id} comment={comment} />
            ))}
          </>
        )}
      </Box>
    );
  };
  
  export default CommentList;