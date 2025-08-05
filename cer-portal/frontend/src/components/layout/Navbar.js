// src/components/layout/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const Navbar = () => {
    // Get fullName and profileComplete from Redux
    const { isAuthenticated, role, profileComplete, fullName } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (role === 'Student') return '/student/dashboard';
        if (role === 'Organizer') return '/organizer/dashboard';
        return '/';
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                    Event Portal
                </Typography>
                
                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Conditionally display name or placeholder */}
                        <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                            {profileComplete && fullName ? fullName : 'Please Complete Profile'}
                        </Typography>
                        <Button color="inherit" component={Link} to={getDashboardLink()}>Dashboard</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        <IconButton
                            size="large"
                            component={Link}
                            to="/profile"
                            color="inherit"
                        >
                            <Badge variant="dot" color={profileComplete ? 'success' : 'error'}>
                                <AccountCircle />
                            </Badge>
                        </IconButton>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;