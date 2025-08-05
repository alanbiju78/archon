// src/components/pages/EventListPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Grid, Typography, CircularProgress, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import EventCard from '../events/EventCard';

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Get user authentication info from Redux
    const { isAuthenticated, token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // THIS IS THE FIX:
                // If the user is logged in, create a config object with the auth token.
                const config = isAuthenticated 
                    ? { headers: { Authorization: `Bearer ${token}` } } 
                    : {};

                // Pass the config to the API call.
                const response = await axios.get('http://127.0.0.1:8000/api/events/', config);
                setEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [isAuthenticated, token]); // Add isAuthenticated and token as dependencies

    const filteredEvents = useMemo(() => {
        if (!searchTerm) {
            return events;
        }
        return events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [events, searchTerm]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Upcoming Events
            </Typography>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    label="Search Events (by title, description, or venue)"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <Grid container spacing={4}>
                {filteredEvents.map((event) => (
                    <Grid item key={event.id} xs={12} sm={6} md={4}>
                        <EventCard event={event} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default EventListPage;
