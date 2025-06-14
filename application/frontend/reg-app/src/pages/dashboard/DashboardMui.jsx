import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  Paper,
  TableContainer,
  Box,
  Collapse,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import TableHeader from './components/TableHeader';
import TaskRow from './components/TaskRow';
import useTasks from '../../hooks/useTasks';
import useComments from '../../hooks/useComments';
import CommentForm from '../../components/Comments/CommentForm';
import CommentList from '../../components/Comments/CommentList';
import PaginationControls from '../../components/ui/PaginationControls';

const DEFAULT_ROWS_PER_PAGE = 5;

// Utility functions
const getTableContainerStyles = (themeMode) => ({
  width: '100%',
  backgroundColor: themeMode === 'dark' ? 'background.paper' : undefined
});

const getExpandedRowStyles = (themeMode) => ({
  p: 3,
  backgroundColor: themeMode === 'dark' ? 'grey.900' : 'grey.50'
});

const getPaginationStyles = (themeMode) => ({
  backgroundColor: themeMode === 'dark' ? 'background.paper' : undefined,
  borderTop: `1px solid ${themeMode === 'dark' ? '#424242' : '#e0e0e0'}`
});

// Components
const TaskDescription = ({ description }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Description:
    </Typography>
    <Typography paragraph>
      {description || 'No description available'}
    </Typography>
  </>
);

const AttachmentsSection = () => (
  <Typography variant="h6" gutterBottom>
    Attachments:
  </Typography>
);

const CommentsSection = ({ 
  taskId, 
  comments, 
  commentsLoading, 
  commentsError, 
  onAddComment, 
  themeMode 
}) => (
  <>
    <CommentList 
      comments={comments[taskId] || []} 
      isLoading={commentsLoading}
      themeMode={themeMode}
    />
    
    <CommentForm 
      onSubmit={(comment) => onAddComment(taskId, comment)}
      isLoading={commentsLoading}
      themeMode={themeMode}
    />
    
    {commentsError && (
      <Typography color="error" variant="body2">
        {commentsError}
      </Typography>
    )}
  </>
);

const ExpandedTaskRow = ({ 
  task, 
  isExpanded, 
  comments, 
  commentsLoading, 
  commentsError, 
  onAddComment, 
  themeMode 
}) => (
  <TableRow>
    <TableCell style={{ padding: 0 }} colSpan={8}>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={getExpandedRowStyles(themeMode)}>
          <TaskDescription description={task.description} />
          <AttachmentsSection />
          <CommentsSection
            taskId={task.id}
            comments={comments}
            commentsLoading={commentsLoading}
            commentsError={commentsError}
            onAddComment={onAddComment}
            themeMode={themeMode}
          />
        </Box>
      </Collapse>
    </TableCell>
  </TableRow>
);

const DashboardMui = () => {
  const { themeMode } = useTheme();
  const { tasks, expandedTask, toggleExpand } = useTasks();
  const { 
    comments, 
    loadComments, 
    addComment,
    isLoading: commentsLoading,
    error: commentsError
  } = useComments();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  // Memoized values
  const paginatedTasks = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tasks.slice(startIndex, endIndex);
  }, [tasks, page, rowsPerPage]);

  const tableContainerStyles = useMemo(() => 
    getTableContainerStyles(themeMode), 
    [themeMode]
  );

  const paginationStyles = useMemo(() => 
    getPaginationStyles(themeMode), 
    [themeMode]
  );

  // Event handlers
  const handleTaskExpand = useCallback(async (taskId) => {
    toggleExpand(taskId);
    if (expandedTask !== taskId) {
      await loadComments(taskId);
    }
  }, [toggleExpand, expandedTask, loadComments]);

  const handleAddComment = useCallback((taskId, comment) => {
    return addComment(taskId, comment);
  }, [addComment]);

  return (
    <Box display="flex" flexDirection="column" mt={4} px={2}>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table>
          <TableHeader />
          <TableBody>
            {paginatedTasks.map((task) => (
              <React.Fragment key={task.id}>
                <TaskRow 
                  task={task} 
                  expandedTask={expandedTask} 
                  toggleExpand={handleTaskExpand}
                />
                
                <ExpandedTaskRow
                  task={task}
                  isExpanded={expandedTask === task.id}
                  comments={comments}
                  commentsLoading={commentsLoading}
                  commentsError={commentsError}
                  onAddComment={handleAddComment}
                  themeMode={themeMode}
                />
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        
        <PaginationControls
          count={tasks.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          sx={paginationStyles}
        />
      </TableContainer>
    </Box>
  );
};

export default DashboardMui;