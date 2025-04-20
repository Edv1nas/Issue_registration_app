import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardMui from './pages/dashboard/DashboardMui';
import TicketPage from './pages/ticket/TicketPage';
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

function App() {
  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<TicketPage />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Dashboard" element={<DashboardMui />} />
      <Route path="/Dashboard2" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;