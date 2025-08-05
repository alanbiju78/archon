// src/components/pages/EventDetailPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Paper, Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EventDetailPage = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { role, token, isAuthenticated, profileComplete } = useSelector(state => state.auth);

    const fetchEvent = async () => {
        try {
            // Pass auth headers even for guests, so backend can check participation status if logged in
            const config = isAuthenticated ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${id}/`, config);
            setEvent(response.data);
        } catch (error) {
            toast.error('Failed to fetch event details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id, token]);

    const handleJoin = async () => {
        if (!isAuthenticated) {
            toast.info('Please log in to join this event.');
            return;
        }
        if (!profileComplete) {
            toast.error('Please complete your profile before joining an event.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(
                `http://127.0.0.1:8000/api/events/${id}/participate/`,
                { response: 'join' },
                config
            );
            toast.success("You have successfully registered for the event!");
            // Refetch event data to update the UI state
            fetchEvent();
        } catch (error) {
            toast.error('Failed to register for the event.');
        }
    };

    if (loading) return <CircularProgress />;
    if (!event) return <Typography>Event not found.</Typography>;

    const isStudent = role === 'Student';
    const hasJoined = event.current_user_participation === 'join';

    return (
        <Container>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {event.title}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Date: {new Date(event.date).toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Venue: {event.venue}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    {event.description}
                </Typography>

                {/* Organizer Info Section */}
                {event.organizer_info && (
                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                        <Typography variant="h6" gutterBottom>Organizer Contact</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography>{event.organizer_info.full_name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography>{event.organizer_info.phone_number}</Typography>
                        </Box>
                    </Box>
                )}

                {/* Action/Participation Section */}
                <Box sx={{ mt: 4 }}>
                    {isStudent && (
                        hasJoined ? (
                            <Button variant="contained" color="success" disabled startIcon={<CheckCircleIcon />}>
                                Registered
                            </Button>
                        ) : (
                            <Button variant="contained" sx={{ backgroundColor: '#ed6c02', '&:hover': { backgroundColor: '#e65100' } }} onClick={handleJoin}>
                                Join Event
                            </Button>
                        )
                    )}

                    {/* For Organizers, show the counts */}
                    {role === 'Organizer' && (
                        <Box>
                            <Typography variant="h6">Participation:</Typography>
                            <Typography>✅ Will Join: {event.join_count}</Typography>
                            <Typography>❌ Will Skip: {event.skip_count}</Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default EventDetailPage;
