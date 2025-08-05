// src/components/pages/RegisterPage.js
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); // State for the role
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!role) {
            toast.error("Please select a role.");
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/api/user/register/', { username, password, role });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
            console.error('Registration failed!', error.response.data);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="role-select-label">I am a...</InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={role}
                            label="I am a..."
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="Student">Student</MenuItem>
                            <MenuItem value="Organizer">Organizer</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                    <Typography variant="body2" align="center">
                        Already have an account?{' '}
                        <RouterLink to="/login">
                            Sign In
                        </RouterLink>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;