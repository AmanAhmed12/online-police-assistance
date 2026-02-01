"use client";

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    Chip,
    CircularProgress,
    Divider,
    Container,
    Button
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { getMyComplaints, Complaint } from '@/app/services/complaintService';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

export default function MyComplaintsPage() {
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
                    console.error("Failed to fetch my complaints", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

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
        <Container maxWidth="lg">
            <Box py={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <ArticleIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h4" fontWeight="bold">
                            My Complaints
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        href="/citizen/complaint/new"
                    >
                        File New Complaint
                    </Button>
                </Box>

                <Paper sx={{ p: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
                    ) : complaints.length === 0 ? (
                        <Box p={4} textAlign="center">
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No complaints found.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                You haven't submitted any complaints yet.
                            </Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} href="/citizen/complaint/new">
                                Submit your first complaint
                            </Button>
                        </Box>
                    ) : (
                        <List>
                            {complaints.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <ListItem alignItems="flex-start" sx={{ p: 3, '&:hover': { bgcolor: 'action.hover' } }}>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                            {item.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                                            Reference ID: #{item.id}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={item.status}
                                                        color={getStatusColor(item.status)}
                                                        size="small"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                </Box>
                                            }
                                            secondaryTypographyProps={{ component: 'div' }}
                                            secondary={
                                                <Box mt={1}>
                                                    <Typography variant="body1" color="text.primary" gutterBottom>
                                                        {item.description.length > 150
                                                            ? `${item.description.substring(0, 150)}...`
                                                            : item.description}
                                                    </Typography>

                                                    <Box display="flex" gap={3} mt={1} flexWrap="wrap">
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Category:</strong> {item.category}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Location:</strong> {item.location}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Incident Date:</strong> {new Date(item.incidentDate).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Submitted:</strong> {new Date(item.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>

                                                    {item.assignedOfficerName && (
                                                        <Box mt={1} p={1} bgcolor="background.default" borderRadius={1} display="inline-block">
                                                            <Typography variant="caption" fontWeight="bold">
                                                                Assigned Officer: {item.assignedOfficerName}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < complaints.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Container>
    );
}
