import React from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import StatCard from '@/components/admin/StatCard';
import RecentActivityTable from '@/components/admin/RecentActivityTable';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';

export default function AdminDashboardPage() {
    return (
        <Box>
            {/* Page Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Dashboard Overview
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Welcome back, Admin. Here is what's happening today.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    aria-label="Generate Report"
                >
                    Generate Report
                </Button>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Users"
                        value="12,345"
                        trend="+12%"
                        isPositive={true}
                        icon={<GroupIcon />}
                        color="#2866f2"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Active Complaints"
                        value="423"
                        trend="+5%"
                        isPositive={false}
                        icon={<WarningIcon />}
                        color="#ff9100"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Cases Solved"
                        value="2,891"
                        trend="+18%"
                        isPositive={true}
                        icon={<CheckCircleIcon />}
                        color="#00e676"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Pending Files"
                        value="123"
                        trend="-2%"
                        isPositive={true}
                        icon={<AssignmentIcon />}
                        color="#651fff"
                    />
                </Grid>
            </Grid>

            {/* Main Content Sections */}
            <Grid container spacing={3}>
                {/* Recent Activity Table (Left/Main side) */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <RecentActivityTable />
                </Grid>

                {/* Quick Actions / Mini Charts (Right side) - Placeholder for now */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Performance
                        </Typography>

                        {/* Dummy Chart Visual */}
                        <Box sx={{ mt: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, gap: 1 }}>
                            {[40, 70, 45, 90, 60, 80, 50].map((height, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: '12%',
                                        height: `${height}%`,
                                        bgcolor: i === 3 ? 'primary.main' : 'rgba(40,102,242,0.2)',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.5s'
                                    }}
                                />
                            ))}
                        </Box>
                        <Typography variant="body2" align="center" color="textSecondary" mt={2}>
                            Weekly Complaint Resolution
                        </Typography>

                        <Box mt={4}>
                            <Typography variant="subtitle2" fontWeight={600} mb={1}>
                                System Health
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption">Server Load</Typography>
                                <Typography variant="caption" color="primary">24%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                                <Box sx={{ width: '24%', height: '100%', bgcolor: 'primary.main', borderRadius: 10 }} />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, mt: 2 }}>
                                <Typography variant="caption">Database Storage</Typography>
                                <Typography variant="caption" color="warning.main">78%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                                <Box sx={{ width: '78%', height: '100%', bgcolor: 'warning.main', borderRadius: 10 }} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
