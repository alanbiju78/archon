// src/components/events/EventForm.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Define the validation schema using Yup
const EventSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past'),
    venue: Yup.string().required('Venue is required'),
});

const EventForm = ({ open, onClose, onSubmit, initialValues }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initialValues.id ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={EventSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values);
                    setSubmitting(false);
                    onClose();
                }}
                enableReinitialize // This is important for pre-filling the form when editing
            >
                {({ isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                                <Field
                                    as={TextField}
                                    name="title"
                                    label="Event Title"
                                    fullWidth
                                    helperText={<ErrorMessage name="title" />}
                                />
                                <Field
                                    as={TextField}
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    helperText={<ErrorMessage name="description" />}
                                />
                                <Field
                                    as={TextField}
                                    name="date"
                                    label="Event Date and Time"
                                    type="datetime-local"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    helperText={<ErrorMessage name="date" />}
                                />
                                <Field
                                    as={TextField}
                                    name="venue"
                                    label="Venue"
                                    fullWidth
                                    helperText={<ErrorMessage name="venue" />}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {initialValues.id ? 'Save Changes' : 'Create Event'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default EventForm;