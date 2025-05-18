import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import DashboardMui from './pages/dashboard/DashboardMui';
import TicketPage from './pages/ticket/TicketPage';
import LoginPage from './pages/login/auth/LoginPage';
import Layout from './components/layout/MainLayout';
import Users from './pages/users/Users';
import Warehouses from './pages/warehouse/Warehouse';

function App() {
  
  return (
    <ThemeProvider>
      <CssBaseline />
        <Router>
          <Routes>
            <Route path="/form" element={<TicketPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route element={<Layout />}>  
              <Route path="/dashboard" element={<DashboardMui />} />
              <Route path="/users" element={<Users />} />
              <Route path="/warehouses" element={<Warehouses />} />
            </Route>
          </Routes>
        </Router>
    </ThemeProvider>
  );
}

export default App;