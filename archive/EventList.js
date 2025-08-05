import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/events/');
                setEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div>
            <h2>Upcoming Events</h2>
            {events.map(event => (
                <div key={event.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h3><Link to={`/event/${event.id}`}>{event.title}</Link></h3>
                    <p>{new Date(event.date).toLocaleString()}</p>
                    <p>{event.venue}</p>
                </div>
            ))}
        </div>
    );
};

export default EventList;