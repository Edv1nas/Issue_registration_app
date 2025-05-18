import React, { useState } from 'react';
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
// import Navbar from './components/NavBar';
import useTasks from '../../hooks/useTasks';
import useComments from '../../hooks/useComments';
import CommentForm from '../../components/Comments/CommentForm';
import CommentList from '../../components/Comments/CommentList';
// import ThemeToggle from '../../components/ui/ThemeToggle';
import PaginationControls from '../../components/ui/PaginationControls';

const DashboardMui = () => {
  const { themeMode } = useTheme();
  const { tasks, expandedTask, toggleExpand} = useTasks();
  const { 
    comments, 
    loadComments, 
    addComment,
    isLoading: commentsLoading,
    error: commentsError
  } = useComments();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleTaskExpand = async (taskId) => {
    toggleExpand(taskId);
    if (expandedTask !== taskId) {
      await loadComments(taskId);
    }
  };

  const paginatedTasks = tasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box 
        display="flex" 
        flexDirection="column" 
        mt={4}
        px={2}
      >
        <TableContainer 
          component={Paper} 
          sx={{ 
            width: '100%', 
            backgroundColor: themeMode === 'dark' ? 'background.paper' : undefined
          }}
        >
          <Table>
            <TableHeader themeMode={themeMode} />
            <TableBody>
              {paginatedTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <TaskRow 
                    task={task} 
                    expandedTask={expandedTask} 
                    toggleExpand={handleTaskExpand}
                    themeMode={themeMode}
                  />
                  
                  <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={8}>
                      <Collapse in={expandedTask === task.id} timeout="auto" unmountOnExit>
                        <Box 
                          sx={{ 
                            p: 3, 
                            backgroundColor: themeMode === 'dark' ? 'grey.900' : 'grey.50'
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            Description:
                          </Typography>
                          <Typography paragraph>
                            {task.description || 'No description available'}
                          </Typography>
                          
                          <Typography variant="h6" gutterBottom>
                            Attachments:
                          </Typography>

                          <CommentList 
                            comments={comments[task.id] || []} 
                            isLoading={commentsLoading}
                            themeMode={themeMode}
                          />
                          
                          <CommentForm 
                            onSubmit={(comment) => addComment(task.id, comment)}
                            isLoading={commentsLoading}
                            themeMode={themeMode}
                          />
                          
                          {commentsError && (
                            <Typography color="error" variant="body2">
                              {commentsError}
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
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
            sx={{ 
              backgroundColor: themeMode === 'dark' ? 'background.paper' : undefined,
              borderTop: `1px solid ${themeMode === 'dark' ? '#424242' : '#e0e0e0'}`
            }}
          />
        </TableContainer>
      </Box>
    </>
  );
};

export default DashboardMui;