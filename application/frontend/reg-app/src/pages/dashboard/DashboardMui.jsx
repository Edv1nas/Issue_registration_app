import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHeader from './components/TableHeader';
import TaskRow from './components/TaskRow';
import Box from '@mui/material/Box';
import Navbar from './components/NavBar';
import useTasks from '../../hooks/useTasks';
import useComments from '../../hooks/useComments';
import { Collapse, TableCell, TableRow, Typography } from '@mui/material';
import CommentForm from '../../components/Comments/CommentForm';
import CommentList from '../../components/Comments/CommentList';

const DashboardMui = () => {
    const { tasks, expandedTask, toggleExpand, handleCreateTask } = useTasks();
    const { 
        comments, 
        loadComments, 
        addComment,
        isLoading: commentsLoading,
        error: commentsError
    } = useComments();

    const handleTaskExpand = async (taskId) => {
        toggleExpand(taskId);
        if (expandedTask !== taskId) {
            await loadComments(taskId);
        }
    };

    return (
        <>
            <Navbar onCreateTask={handleCreateTask} />
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <TableContainer component={Paper} sx={{ width: '80%' }}>
                    <Table>
                        <TableHeader />
                        <TableBody>
                            {tasks.map((task) => (
                                <>
                                    <TaskRow 
                                        key={task.id} 
                                        task={task} 
                                        expandedTask={expandedTask} 
                                        toggleExpand={handleTaskExpand} 
                                    />
                                    <TableRow>
                                        <TableCell style={{ padding: 0 }} colSpan={8}>
                                            <Collapse in={expandedTask === task.id} timeout="auto" unmountOnExit>
                                                <Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Description:
                                                    </Typography>
                                                    <Typography paragraph>
                                                        {task.description || 'No description available'}
                                                    </Typography>
                                                    
                                                    <Typography variant="h6" gutterBottom>
                                                        Comments:
                                                    </Typography>

                                                    <CommentList 
                                                        comments={comments[task.id] || []} 
                                                        isLoading={commentsLoading}
                                                    />
                                                    <CommentForm 
                                                        onSubmit={(comment) => addComment(task.id, comment)}
                                                        isLoading={commentsLoading}
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
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default DashboardMui;