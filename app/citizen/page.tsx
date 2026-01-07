import React from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Reusing StatCard from admin for now as it's generic enough, or we should duplicate it if we want strict separation.
// For now, let's create a local simple StatCard or import the admin one if the path allows. 
// Importing from admin components is fine for MVP.
import StatCard from '@/components/admin/StatCard';

export default function CitizenDashboardPage() {
    return (
        <Box>
            {/* Page Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Welcome, Citizen
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Manage your complaints and view status updates.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    href="/citizen/complaint/new"
                    aria-label="File New Complaint"
                    sx={{ px: 3, py: 1 }}
                >
                    File Complaint
                </Button>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Total Complaints"
                        value="3"
                        trend="Lifetime"
                        isPositive={true}
                        icon={<ArticleIcon />}
                        color="#2866f2"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Pending"
                        value="1"
                        trend="In Progress"
                        isPositive={false}
                        icon={<WarningIcon />}
                        color="#ff9100"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Resolved"
                        value="2"
                        trend="Completed"
                        isPositive={true}
                        icon={<CheckCircleIcon />}
                        color="#00e676"
                    />
                </Grid>
            </Grid>

            {/* Main Content Sections */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Recent Complaints
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                No recent activity to show.
                            </Typography>
                            {/* Placeholder for a list or table */}
                            <Button variant="text" sx={{ mt: 2 }} startIcon={<HistoryIcon />}>
                                View All History
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Quick Access
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Button variant="outlined" startIcon={<AssignmentIcon />} fullWidth sx={{ justifyContent: 'flex-start' }}>
                                View Guidelines
                            </Button>
                            <Button variant="outlined" startIcon={<ArticleIcon />} fullWidth sx={{ justifyContent: 'flex-start' }}>
                                Download Forms
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
