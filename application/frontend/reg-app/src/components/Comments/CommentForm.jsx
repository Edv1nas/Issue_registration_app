import { 
    TextField, 
    Button, 
    CircularProgress, 
    Box,
    IconButton,
    Tooltip
  } from '@mui/material';
  import { useState } from 'react';
  import ClearIcon from '@mui/icons-material/Clear';
  import SendIcon from '@mui/icons-material/Send';
  
  const CommentForm = ({ onSubmit, isLoading }) => {
    const [comment, setComment] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (comment.trim()) {
        onSubmit(comment);
        setComment('');
      }
    };
  
    const handleClear = () => {
      setComment('');
    };
  
    return (
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          mt: 2,
          position: 'relative' // For absolute positioning of clear button
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          disabled={isLoading}
          InputProps={{
            endAdornment: comment && (
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{
                  position: 'absolute',
                  right: 8,
                  bottom: 8
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )
          }}
        />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 1,
          gap: 1
        }}>
          <Tooltip title="Clear comment">
            <Button
              variant="outlined"
              onClick={handleClear}
              disabled={!comment || isLoading}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          </Tooltip>
          
          <Tooltip title="Post comment">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!comment.trim() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </Button>
          </Tooltip>
        </Box>
      </Box>
    );
  };
  
  export default CommentForm;