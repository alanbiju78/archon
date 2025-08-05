// src/components/pages/OrganizerDashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EventForm from '../events/EventForm';
import { Grid } from '@mui/material'; // Make sure Grid is imported
import GroupsIcon from '@mui/icons-material/Groups';
// 1. IMPORT CHARTING COMPONENTS
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrganizerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, isAuthenticated, profileComplete } = useSelector((state) => state.auth);
    
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [deletingEventId, setDeletingEventId] = useState(null);

    const fetchEvents = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get('http://127.0.0.1:8000/api/events/', config);
            setEvents(response.data);
        } catch (error) {
            toast.error('Failed to fetch your events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchEvents();
        }
    }, [isAuthenticated]);

    // 2. PROCESS DATA FOR THE CHART
    const chartData = useMemo(() => events.map(event => ({
        name: event.title.length > 20 ? `${event.title.substring(0, 20)}...` : event.title, // Shorten long titles for the chart
        'Will Join': event.join_count,
        'Will Skip': event.skip_count,
    })), [events]);


    const handleFormSubmit = async (values) => {
        const isEditing = !!values.id;
        const url = isEditing ? `http://127.0.0.1:8000/api/events/${values.id}/` : 'http://127.0.0.1:8000/api/events/create/';
        const method = isEditing ? 'put' : 'post';

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios[method](url, values, config);
            toast.success(`Event ${isEditing ? 'updated' : 'created'} successfully!`);
            fetchEvents();
        } catch (error) {
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} event.`);
        }
    };

    const handleDelete = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://127.0.0.1:8000/api/events/${deletingEventId}/`, config);
            toast.success('Event deleted successfully!');
            setEvents(events.filter(event => event.id !== deletingEventId));
        } catch (error) {
            toast.error('Failed to delete event.');
        } finally {
            setConfirmOpen(false);
            setDeletingEventId(null);
        }
    };

    if (loading && !events.length) return <CircularProgress />;

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Organizer Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                        <GroupsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>Community Events</Typography>
                        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                            Browse all events created by other organizers in the community to coordinate and collaborate.
                        </Typography>
                        <Button variant="contained" component={RouterLink} to="/organizer/all-events">
                            View All Events
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* 3. ADD THE CHART COMPONENT */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Event Participation Overview
                </Typography>
                {events.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Will Join" fill="#4caf50" />
                            <Bar dataKey="Will Skip" fill="#f44336" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Typography>No event data to display. Create an event to see stats.</Typography>
                )}
            </Paper>

            <Button 
                variant="contained" 
                onClick={() => { setEditingEvent(null); setFormOpen(true); }}
                disabled={!profileComplete} // Disable if profile is not complete
            >
                Create New Event
            </Button>
            {!profileComplete && <Typography variant="caption" color="error">Complete your profile to create events.</Typography>}

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Venue</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.title}</TableCell>
                                <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                                <TableCell>{event.venue}</TableCell>
                                <TableCell align="right">
                                    <IconButton component={RouterLink} to={`/organizer/events/${event.id}/attendees`}>
                                        <PeopleIcon />
                                    </IconButton>
                                    <IconButton onClick={() => { setEditingEvent(event); setFormOpen(true); }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => { setDeletingEventId(event.id); setConfirmOpen(true); }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <EventForm
                open={isFormOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialValues={editingEvent || { title: '', description: '', date: '', venue: '' }}
            />

            <Dialog open={isConfirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone. This will permanently delete the event.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OrganizerDashboard;
