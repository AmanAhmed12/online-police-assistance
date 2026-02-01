"use client";

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    IconButton
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { getMyAssignedComplaints, updateComplaintStatus, Complaint } from '@/app/services/complaintService';

export default function OfficerCasesPage() {
    const token = useSelector((state: RootState) => state.auth.user?.token);
    const [cases, setCases] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCase, setSelectedCase] = useState<Complaint | null>(null);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

    // Status update state (for the dialog)
    const [newStatus, setNewStatus] = useState('');

    const fetchCases = async () => {
        try {
            const data = await getMyAssignedComplaints(token);
            setCases(data);
        } catch (error) {
            console.error("Failed to fetch cases", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCases();
        }
    }, [token]);

    const handleOpenDialog = (caseItem: Complaint) => {
        setSelectedCase(caseItem);
        setNewStatus(caseItem.status);
    };

    const handleCloseDialog = () => {
        setSelectedCase(null);
    };

    const handleUpdateStatus = async () => {
        if (!selectedCase || !newStatus) return;

        setStatusUpdateLoading(true);
        try {
            await updateComplaintStatus(selectedCase.id, newStatus, token);
            // Refresh list and close dialog or update local state
            await fetchCases();
            handleCloseDialog();
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'IN_INVESTIGATION': return 'info';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                My Assigned Cases
            </Typography>

            <Paper sx={{ mt: 3 }}>
                {cases.length === 0 ? (
                    <Box p={3} textAlign="center">
                        <Typography color="text.secondary">No assigned cases found.</Typography>
                    </Box>
                ) : (
                    <List>
                        {cases.map((caseItem, index) => (
                            <React.Fragment key={caseItem.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    secondaryAction={
                                        <Button
                                            variant="outlined"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => handleOpenDialog(caseItem)}
                                        >
                                            View
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                            <AssignmentIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {caseItem.title}
                                                </Typography>
                                                <Chip
                                                    label={caseItem.status}
                                                    size="small"
                                                    color={getStatusColor(caseItem.status)}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography variant="body2" component="span" color="text.secondary" display="block">
                                                    Category: {caseItem.category}
                                                </Typography>
                                                <Typography variant="body2" component="span" color="text.secondary">
                                                    Date: {new Date(caseItem.incidentDate).toLocaleDateString()}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                {index < cases.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Case Details Dialog */}
            <Dialog open={!!selectedCase} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                {selectedCase && (
                    <>
                        <DialogTitle>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                Complaint Details #{selectedCase.id}
                                <IconButton onClick={handleCloseDialog}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedCase.title}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedCase.category}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedCase.location}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary">Incident Date</Typography>
                                    <Typography variant="body1" gutterBottom>{new Date(selectedCase.incidentDate).toLocaleString()}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Submitted By</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedCase.citizenName || "Unknown"}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Submitted At</Typography>
                                    <Typography variant="body1" gutterBottom>{new Date(selectedCase.createdAt).toLocaleString()}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                        <Typography variant="body2">{selectedCase.description}</Typography>
                                    </Paper>
                                </Grid>

                                {selectedCase.evidenceFiles && selectedCase.evidenceFiles.length > 0 && (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Evidence Files</Typography>
                                        <Box display="flex" gap={2} flexWrap="wrap">
                                            {selectedCase.evidenceFiles.map((url, idx) => (
                                                <Box key={idx} component="img" src={url} alt={`Evidence ${idx + 1}`}
                                                    sx={{
                                                        width: 150,
                                                        height: 150,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        border: '1px solid #ddd',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(url, '_blank')}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                )}

                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="h6">Update Status</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }} display="flex" gap={2}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={newStatus}
                                                    label="Status"
                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                >
                                                    <MenuItem value="PENDING">Pending</MenuItem>
                                                    <MenuItem value="IN_INVESTIGATION">In Investigation</MenuItem>
                                                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                                                    <MenuItem value="CLOSED">Closed</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Button
                                                variant="contained"
                                                onClick={handleUpdateStatus}
                                                disabled={statusUpdateLoading}
                                            >
                                                Update
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
