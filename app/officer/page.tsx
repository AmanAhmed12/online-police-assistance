import React from 'react';
import { Typography, Box, Grid, Paper, Card, CardContent } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import EventNoteIcon from '@mui/icons-material/EventNote';

export default function OfficerDashboard() {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Officer Dashboard
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={4}>
                Welcome back, Officer. Here's your shift overview.
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6">Assigned Cases</Typography>
                                    <Typography variant="h3" fontWeight={700}>5</Typography>
                                </Box>
                                <AssignmentIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6">Pending Reports</Typography>
                                    <Typography variant="h3" fontWeight={700}>2</Typography>
                                </Box>
                                <WarningIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6">Next Shift</Typography>
                                    <Typography variant="h5" fontWeight={700}>Tomorrow</Typography>
                                    <Typography variant="caption">08:00 AM - 04:00 PM</Typography>
                                </Box>
                                <EventNoteIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Alerts
                </Typography>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        No new high-priority alerts in your precinct.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}
