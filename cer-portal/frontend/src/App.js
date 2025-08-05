// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Layouts and Pages
import Navbar from './components/layout/Navbar';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import GuestHomePage from './components/pages/GuestHomePage';
import StudentDashboard from './components/pages/StudentDashboard';
import MyEventsPage from './components/pages/MyEventsPage';
import OrganizerDashboard from './components/pages/OrganizerDashboard';
import AllEventsForOrganizerPage from './components/pages/AllEventsForOrganizerPage';
import AttendeeListPage from './components/pages/AttendeeListPage'; // <-- IMPORT
import EventListPage from './components/pages/EventListPage';
import EventDetailPage from './components/pages/EventDetailPage';
import ProfilePage from './components/pages/ProfilePage';

// A simple theme for a modern look
const theme = createTheme({
    palette: {
        mode: 'light', // or 'dark'
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

// A component to protect routes based on role
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        // Redirect if role does not match
        return <Navigate to="/" replace />;
    }

    return children;
};


function App() {
    const { role } = useSelector((state) => state.auth);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Container sx={{ mt: 4, mb: 4 }}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/events" element={<EventListPage />} />
                        <Route path="/events/:id" element={<EventDetailPage />} />

                        {/* Role-Based Home Route */}
                        <Route 
                            path="/" 
                            element={
                                role === 'Student' ? <Navigate to="/student/dashboard" /> :
                                role === 'Organizer' ? <Navigate to="/organizer/dashboard" /> :
                                <GuestHomePage />
                            } 
                        />

                        {/* Protected Student Routes */}
                        <Route 
                            path="/student/dashboard" 
                            element={
                                <ProtectedRoute requiredRole="Student">
                                    <StudentDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/student/my-events" 
                            element={
                                <ProtectedRoute requiredRole="Student">
                                    <MyEventsPage />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protected Organizer Routes */}
                        <Route 
                            path="/organizer/dashboard" 
                            element={
                                <ProtectedRoute requiredRole="Organizer">
                                    <OrganizerDashboard />
                                </ProtectedRoute>
                            } 
                        />
                    
                        {/* ADD A GENERIC PROTECTED ROUTE FOR THE PROFILE */}
                        <Route 
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Organizer Routes */}
                        <Route 
                            path="/organizer/dashboard" 
                            element={
                                <ProtectedRoute requiredRole="Organizer">
                                    <OrganizerDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route // <-- ADD THIS NEW ROUTE
                            path="/organizer/all-events"
                            element={
                                <ProtectedRoute requiredRole="Organizer">
                                    <AllEventsForOrganizerPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route // <-- ADD THIS NEW ROUTE
                            path="/organizer/events/:id/attendees" 
                            element={
                                <ProtectedRoute requiredRole="Organizer">
                                    <AttendeeListPage />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </Container>
            </Router>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
        </ThemeProvider>
    );
}

export default App;
