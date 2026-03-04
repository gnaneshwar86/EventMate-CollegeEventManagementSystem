import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import RegistrationPage from './pages/RegistrationPage';
import ScrollToTop from './components/ScrollToTop';
import EventManagementSystem from './pages/EventManagementSystem';

import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <Navbar />

          <Box sx={{ paddingTop: '15vh', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/events" element={<EventManagementSystem />} />
              <Route path="/register/:eventId" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admindashboard" element={<AdminDashboard />} />
            </Routes>
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}


export default App;
