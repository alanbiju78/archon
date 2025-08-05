// src/components/pages/MyEventsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EventCard from '../events/EventCard';

const MyEventsPage = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchMyEvents = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('http://127.0.0.1:8000/api/my-events/', config);
                setMyEvents(response.data);
            } catch (error) {
                toast.error('Failed to fetch your registered events.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [token]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                My Registered Events
            </Typography>
            {myEvents.length === 0 ? (
                <Alert severity="info">You have not registered for any events yet.</Alert>
            ) : (
                <Grid container spacing={4}>
                    {myEvents.map((event) => (
                        <Grid item key={event.id} xs={12} sm={6} md={4}>
                            <EventCard event={event} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyEventsPage;