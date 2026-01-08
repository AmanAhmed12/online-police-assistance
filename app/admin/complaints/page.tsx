import React from 'react';
import { Typography, Box, Paper, Grid, Card, CardContent, Chip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

export default function ComplaintsPage() {
    const complaints = [
        { id: 101, title: 'Noise Disturbance', location: 'Downtown Area', date: '2023-10-25', status: 'Pending' },
        { id: 102, title: 'Theft Reported', location: 'Market Street', date: '2023-10-24', status: 'Investigating' },
        { id: 103, title: 'Vandalism', location: 'Central Park', date: '2023-10-23', status: 'Resolved' },
    ];

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <WarningIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Complaints
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {complaints.map((complaint) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={complaint.id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                        #{complaint.id}
                                    </Typography>
                                    <Chip
                                        label={complaint.status}
                                        color={
                                            complaint.status === 'Pending' ? 'error' :
                                                complaint.status === 'Resolved' ? 'success' : 'warning'
                                        }
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    {complaint.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Location: {complaint.location}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Date: {complaint.date}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
