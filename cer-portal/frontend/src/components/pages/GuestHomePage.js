// src/components/pages/GuestHomePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, CircularProgress, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../events/EventCard'; // We'll reuse our EventCard

const GuestHomePage = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/featured-events/');
                setFeaturedEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch featured events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedEvents();
    }, []);

    return (
        <Box>
            {/* Hero Section */}
            <Paper 
                sx={{ 
                    py: 8, 
                    textAlign: 'center', 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    mb: 6
                }}
            >
                <Container>
                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                        Discover & Join Events
                    </Typography>
                    <Typography variant="h5" component="p" color="white" sx={{ mb: 4 }}>
                        Your one-stop portal for all college events. Register, participate, and stay connected.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        size="large" 
                        component={RouterLink} 
                        to="/events"
                    >
                        Browse All Events
                    </Button>
                </Container>
            </Paper>

            {/* Featured Events Section */}
            <Container>
                <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
                    Featured Events
                </Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {featuredEvents.map((event) => (
                            <Grid item key={event.id} xs={12} sm={6} md={4}>
                                <EventCard event={event} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default GuestHomePage;
