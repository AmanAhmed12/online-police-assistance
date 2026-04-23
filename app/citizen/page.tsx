"use client";
import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button, List, ListItem, ListItemText, Chip, CircularProgress, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StatCard from '@/components/admin/StatCard'; // Keeping this reuse
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { getMyComplaints, Complaint } from '@/app/services/complaintService';
import { useRouter } from 'next/navigation';

export default function CitizenDashboardPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.user?.token);
    const router = useRouter();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const data = await getMyComplaints(token);
                    setComplaints(data);
                } catch (error) {
                    console.error("Failed to fetch complaints", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [token]);

    // Calculate Stats
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === 'PENDING').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

    // Recent activity (last 3)
    const recentComplaints = [...complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'IN_INVESTIGATION': return 'info';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    return (
        <Box>
            {/* Page Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Welcome, {user?.fullName || user?.username || "Citizen"}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Manage your complaints and view status updates.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/citizen/complaint/new')}
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
                        value={totalComplaints.toString()}
                        trend="Lifetime"
                        isPositive={true}
                        icon={<ArticleIcon />}
                        color="#2866f2"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Pending"
                        value={pendingComplaints.toString()}
                        trend="In Progress"
                        isPositive={false}
                        icon={<WarningIcon />}
                        color="#ff9100"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Resolved"
                        value={resolvedComplaints.toString()}
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
                    <Paper sx={{ p: 3, minHeight: 400 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Recent Complaints
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {loading ? (
                                <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
                            ) : recentComplaints.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No recent activity to show.
                                </Typography>
                            ) : (
                                <List>
                                    {recentComplaints.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                                                            <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" color="text.secondary" component="span" display="block">
                                                                {item.category} • {new Date(item.incidentDate).toLocaleDateString()}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Submitted on {new Date(item.createdAt).toLocaleDateString()}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            {index < recentComplaints.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}

                            {/* In a real app, this would link to a full list page */}
                            {recentComplaints.length > 0 && (
                                <Button variant="text" sx={{ mt: 2 }} startIcon={<HistoryIcon />} onClick={() => alert("History page coming soon!")}>
                                    View All History
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Quick Access
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7, mt: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(40, 102, 242, 0.05)', borderColor: 'primary.main' }
                                }}
                                onClick={() => router.push('/citizen/guidelines')}
                            >
                                <AssignmentIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight={500}>View Guidelines</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(40, 102, 242, 0.05)', borderColor: 'primary.main' }
                                }}
                                onClick={() => router.push('/citizen/report')}
                            >
                                <ArticleIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight={500}>Police Clearance</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(40, 102, 242, 0.05)', borderColor: 'primary.main' }
                                }}
                                onClick={() => router.push('/citizen/complaints')}
                            >
                                <HistoryIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight={500}>My Complaints</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(40, 102, 242, 0.05)', borderColor: 'primary.main' }
                                }}
                                onClick={() => router.push('/citizen/emergency')}
                            >
                                <PhoneIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight={500}>Emergency Line</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(40, 102, 242, 0.05)', borderColor: 'primary.main' }
                                }}
                                onClick={() => router.push('/citizen/notices')}
                            >
                                <AnnouncementIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight={500}>Official Notices</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(40, 102, 242, 0.05)', borderColor: 'primary.main' }
                                }}
                                onClick={() => router.push('/citizen/fines')}
                            >
                                <AccountBalanceIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight={500}>My Fines</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
