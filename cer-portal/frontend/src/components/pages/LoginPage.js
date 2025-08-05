// src/components/pages/LoginPage.js
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { loginSuccess } from '../../store/authSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

     const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Step 1: Get the token
            const tokenResponse = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
            const token = tokenResponse.data.access;
            const decodedToken = jwtDecode(token);

            // Step 2: Use the token to get the profile data
            const profileConfig = { headers: { Authorization: `Bearer ${token}` } };
            const profileResponse = await axios.get('http://127.0.0.1:8000/api/profile/', profileConfig);
            const profile = profileResponse.data;

            // Step 3: Dispatch all data to Redux, including the full name
            dispatch(loginSuccess({
                token: token,
                role: decodedToken.role,
                profileComplete: profile.profile_complete,
                fullName: profile.full_name 
            }));

            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
            console.error('Login failed!', error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Typography variant="body2" align="center">
                        Don't have an account?{' '}
                        <RouterLink to="/register">
                            Sign Up
                        </RouterLink>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
