import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from '../../pages/dashboard/components/NavBar';
import { Outlet } from 'react-router-dom';
import useTasks from '../../hooks/useTasks';


const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { handleCreateTask } = useTasks();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
      <Box
        component="main"
        sx={{
            flexGrow: 1,
            transition: 'margin 0.3s',
        }}
        >
        <Navbar
            onToggleSidebar={toggleSidebar}
            onCreateTask={handleCreateTask}
        />
        <Toolbar /> 
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
