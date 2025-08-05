// src/components/pages/AttendeeListPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Grid, Box, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AttendeeListPage = () => {
    const [attendees, setAttendees] = useState([]);
    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchAttendees = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`http://127.0.0.1:8000/api/events/${id}/attendees/`, config);
                setAttendees(response.data);
            } catch (error) {
                toast.error('Failed to fetch attendees. You may not have permission.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttendees();
    }, [id, token]);

    const handleRowClick = (attendee) => {
        setSelectedAttendee(attendee);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Event Attendees
            </Typography>
            <Grid container spacing={4}>
                {/* Column 1: Attendee List */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h6" gutterBottom>Attendee List</Typography>
                    {attendees.length === 0 ? (
                        <Alert severity="info">No students have registered for this event yet.</Alert>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User ID</TableCell>
                                        <TableCell>Full Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendees.map((attendee) => (
                                        <TableRow 
                                            key={attendee.id} 
                                            hover 
                                            onClick={() => handleRowClick(attendee)}
                                            sx={{ cursor: 'pointer' }}
                                            selected={selectedAttendee && selectedAttendee.id === attendee.id}
                                        >
                                            <TableCell>{attendee.id}</TableCell>
                                            <TableCell>{attendee.full_name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Grid>
                {/* Column 2: Attendee Details */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>Attendee Details</Typography>
                    <Paper sx={{ p: 3, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedAttendee ? (
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" gutterBottom>{selectedAttendee.full_name}</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography><strong>User ID:</strong> {selectedAttendee.id}</Typography>
                                <Typography><strong>Phone:</strong> {selectedAttendee.phone_number}</Typography>
                                <Typography><strong>Student ID:</strong> {selectedAttendee.student_id}</Typography>
                                <Typography><strong>Major:</strong> {selectedAttendee.major}</Typography>
                            </Box>
                        ) : (
                            <Alert severity="info" sx={{ width: '100%' }}>Select an attendee from the list to view their details.</Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AttendeeListPage;
