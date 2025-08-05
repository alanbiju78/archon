// src/components/pages/StudentDashboard.js
import React from 'react';
import { Container, Typography, Button, Box, Paper, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const StudentDashboard = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Student Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Welcome! From here you can browse all upcoming events or view the ones you've registered for.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                        <EventIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>All Events</Typography>
                        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                            Browse the full list of upcoming events and decide which ones to join.
                        </Typography>
                        <Button variant="contained" component={RouterLink} to="/events">
                            Browse All Events
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                        <EventAvailableIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>My Registered Events</Typography>
                        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                            See a list of all the events you have confirmed you will be joining.
                        </Typography>
                        <Button variant="contained" component={RouterLink} to="/student/my-events">
                            View My Events
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StudentDashboard;