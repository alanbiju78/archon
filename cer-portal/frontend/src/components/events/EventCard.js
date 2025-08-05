// src/components/events/EventCard.js
import React from 'react';
import { Card, CardContent, Typography, Button, CardActions, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the checkmark icon

const EventCard = ({ event, showOrganizerInfo = false }) => {
    // Check if the current user has joined this event
    const isRegistered = event.current_user_participation === 'join';

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ pr: 1 }}>
                        {event.title}
                    </Typography>
                    {/* If the user is registered, display a green "Registered" chip */}
                    {isRegistered && (
                        <Chip
                            icon={<CheckCircleIcon />}
                            label="Registered"
                            color="success"
                            size="small"
                        />
                    )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {new Date(event.date).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {event.venue}
                </Typography>

                {showOrganizerInfo && event.organizer_info && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Organizer Contact:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{event.organizer_info.full_name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{event.organizer_info.phone_number}</Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
            <CardActions>
                <Button component={Link} to={`/events/${event.id}`} size="small">View Details</Button>
            </CardActions>
        </Card>
    );
};

export default EventCard;
 