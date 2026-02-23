"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Grid
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Gavel as GavelIcon,
    AttachMoney as MoneyIcon,
    Search as SearchIcon
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface ViolationType {
    id: number;
    label: string;
    amount: number;
    adminId?: number;
}

export default function AdminViolationsPage() {
    const token = useSelector((state: RootState) => state.auth.user?.token);
    const [violations, setViolations] = useState<ViolationType[]>([]);
    const [filteredViolations, setFilteredViolations] = useState<ViolationType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingViolation, setEditingViolation] = useState<ViolationType | null>(null);
    const [formData, setFormData] = useState({ label: "", amount: "" });
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

    useEffect(() => {
        if (token) fetchViolations();
    }, [token]);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        setFilteredViolations(violations.filter(v => v.label.toLowerCase().includes(lowerSearch)));
    }, [searchTerm, violations]);

    const fetchViolations = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/violations/all", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setViolations(data);
                setFilteredViolations(data);
            }
        } catch (error) {
            console.error("Error fetching violations:", error);
        }
    };

    const handleOpenDialog = (violation?: ViolationType) => {
        if (violation) {
            setEditingViolation(violation);
            setFormData({ label: violation.label, amount: violation.amount.toString() });
        } else {
            setEditingViolation(null);
            setFormData({ label: "", amount: "" });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        if (!formData.label || !formData.amount) {
            setNotification({ open: true, message: "Please fill all fields", severity: "error" });
            return;
        }

        const payload = {
            label: formData.label,
            amount: parseFloat(formData.amount)
        };

        try {
            let response;
            if (editingViolation) {
                // Update
                response = await fetch(`http://localhost:8080/api/violations/${editingViolation.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                response = await fetch("http://localhost:8080/api/violations/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                setNotification({ open: true, message: "Saved successfully!", severity: "success" });
                setOpenDialog(false);
                fetchViolations();
            } else {
                const err = await response.text();
                setNotification({ open: true, message: "Error: " + err, severity: "error" });
            }
        } catch (error) {
            setNotification({ open: true, message: "Network error", severity: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this violation type?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/violations/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setNotification({ open: true, message: "Deleted successfully!", severity: "success" });
                fetchViolations();
            } else {
                setNotification({ open: true, message: "Failed to delete", severity: "error" });
            }
        } catch (error) {
            setNotification({ open: true, message: "Network error", severity: "error" });
        }
    };

    return (
        <Box sx={{ p: 3, position: 'relative' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: "var(--fg-main)", letterSpacing: '-0.02em' }}>
                    Manage Violation Types
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        borderRadius: '12px',
                        background: 'var(--primary)',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
                    }}
                >
                    Add Violation
                </Button>
            </Box>

            <Card sx={{
                mb: 4,
                bgcolor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '16px',
                boxShadow: 'none'
            }}>
                <CardContent sx={{ p: '16px !important' }}>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Search violations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'var(--fg-secondary)' }} />
                                </InputAdornment>
                            ),
                            sx: { color: 'var(--fg-main)', fontSize: '1.1rem' }
                        }}
                    />
                </CardContent>
            </Card>

            <Box display="flex" flexWrap="wrap" gap={2}>
                {filteredViolations.map((v) => (
                    <Box key={v.id} sx={{ width: { xs: '100%', md: 'calc(50% - 8px)', lg: 'calc(33.333% - 11px)' } }}>
                        <Card elevation={0} sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-light)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                border: '1px solid var(--primary)',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                            }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Box sx={{
                                            p: 1,
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                                            color: '#3B82F6',
                                            display: 'flex'
                                        }}>
                                            <GavelIcon fontSize="small" color="inherit" />
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--fg-main)' }}>{v.label}</Typography>
                                    </Box>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleOpenDialog(v)} sx={{ color: 'var(--fg-secondary)', '&:hover': { color: 'var(--primary)' } }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(v.id)} sx={{ color: 'var(--fg-secondary)', '&:hover': { color: '#EF4444' } }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1} mt={3}
                                    sx={{
                                        bgcolor: 'rgba(16, 185, 129, 0.05)',
                                        p: '8px 12px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(16, 185, 129, 0.1)'
                                    }}>
                                    <MoneyIcon sx={{ color: '#10B981', fontSize: '1.2rem' }} />
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#10B981' }}>
                                        LKR {v.amount.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(16, 185, 129, 0.7)', ml: 'auto' }}>Standard Fine</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        bgcolor: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ color: 'var(--fg-main)', borderBottom: '1px solid var(--border-light)', pb: 2, fontWeight: 'bold' }}>
                    {editingViolation ? "Edit Violation Type" : "Add New Violation Type"}
                </DialogTitle>
                <DialogContent sx={{ mt: 3 }}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Violation Name"
                            placeholder="e.g. Over Speeding"
                            fullWidth
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)' },
                                '& .MuiInputLabel-root': { color: 'var(--fg-secondary)' },
                                '& .MuiInputBase-input': { color: 'var(--fg-main)' }
                            }}
                        />
                        <TextField
                            label="Fine Amount (LKR)"
                            type="number"
                            fullWidth
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)' },
                                '& .MuiInputLabel-root': { color: 'var(--fg-secondary)' },
                                '& .MuiInputBase-input': { color: 'var(--fg-main)' }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: 'var(--fg-secondary)', textTransform: 'none' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            bgcolor: 'var(--primary)',
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            px: 3
                        }}
                    >
                        Save Violation
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
