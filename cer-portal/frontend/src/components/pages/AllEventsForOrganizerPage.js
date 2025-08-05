// src/components/pages/AllEventsForOrganizerPage.js
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EventCard from '../events/EventCard';

const AllEventsForOrganizerPage = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchAllEvents = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // THIS IS THE FIX: Fetch from the new community-events endpoint
                const response = await axios.get('http://127.0.0.1:8000/api/community-events/', config);
                setAllEvents(response.data);
            } catch (error) {
                toast.error('Failed to fetch all events.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllEvents();
    }, [token]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                All Community Events
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Here you can see all events created by other organizers in the community.
            </Typography>
            <Grid container spacing={4}>
                {allEvents.map((event) => (
                    <Grid item key={event.id} xs={12} sm={6} md={4}>
                        <EventCard event={event} showOrganizerInfo={true} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AllEventsForOrganizerPage;
