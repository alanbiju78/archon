import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventDetail = ({ token }) => {
    const [event, setEvent] = useState(null);
    const { id } = useParams();

    const fetchEvent = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${id}/`);
            setEvent(response.data);
        } catch (error) {
            console.error('Failed to fetch event details', error);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const handleParticipate = async (responseType) => {
        if (!token) {
            alert('Please login to participate.');
            return;
        }
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/events/${id}/participate/`,
                { response: responseType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvent(response.data); // Update event state with new counts
        } catch (error) {
            console.error('Participation failed', error);
            alert('Participation failed. You might have already responded.');
        }
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div>
            <h2>{event.title}</h2>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <div>
                <button onClick={() => handleParticipate('join')}>Will Join</button>
                <button onClick={() => handleParticipate('skip')}>Will Skip</button>
            </div>
            <div>
                <p>✅Joined: {event.join_count}</p>
                <p>❌Skipped: {event.skip_count}</p>
            </div>
        </div>
    );
};

export default EventDetail;