// src/components/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, CircularProgress, Alert, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setProfileComplete } from '../../store/authSlice';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [initialProfile, setInitialProfile] = useState(null); // To store original state for cancel
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const { token, role, profileComplete } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('http://127.0.0.1:8000/api/profile/', config);
                setProfile(response.data);
                setInitialProfile(response.data); // Save the initial state
            } catch (error) {
                toast.error("Could not load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setProfile(initialProfile); // Revert changes
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.put('http://127.0.0.1:8000/api/profile/', profile, config);
            toast.success("Profile updated successfully!");
            
            setProfile(response.data);
            setInitialProfile(response.data); // Update the initial state with new saved data
            dispatch(setProfileComplete(response.data.profile_complete));
            setIsEditing(false); // Exit edit mode after saving
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    if (loading) return <CircularProgress />;
    if (!profile) return <Typography>Could not load profile.</Typography>;

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" gutterBottom>My Profile</Typography>
                    {!isEditing && (
                        <IconButton onClick={() => setIsEditing(true)}>
                            <EditIcon />
                        </IconButton>
                    )}
                </Box>
                
                {!profileComplete && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Your profile is incomplete. Please fill out all required fields to access full functionality.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField label="Full Name" name="full_name" value={profile.full_name || ''} onChange={handleChange} fullWidth margin="normal" required disabled={!isEditing} />
                    <TextField label="Phone Number" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} fullWidth margin="normal" required disabled={!isEditing} />
                    
                    {role === 'Student' && (
                        <>
                            <TextField label="Student ID" name="student_id" value={profile.student_id || ''} onChange={handleChange} fullWidth margin="normal" required disabled={!isEditing} />
                            <TextField label="Major" name="major" value={profile.major || ''} onChange={handleChange} fullWidth margin="normal" required disabled={!isEditing} />
                        </>
                    )}

                    {role === 'Organizer' && (
                        <TextField label="Organization Name" name="organization_name" value={profile.organization_name || ''} onChange={handleChange} fullWidth margin="normal" required disabled={!isEditing} />
                    )}

                    {isEditing && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button type="submit" variant="contained">Save Changes</Button>
                            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ProfilePage;
