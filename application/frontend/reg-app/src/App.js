import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardMui from './pages/dashboard/DashboardMui';
import TicketPage from './pages/ticket/TicketPage';
import LoginPage from './pages/login/auth/LoginPage';

function App() {
  
  return (
    <Router>
      <Routes>
      <Route path="/Form" element={<TicketPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/Dashboard" element={<DashboardMui />} />
      </Routes>
    </Router>
  );
}

export default App;