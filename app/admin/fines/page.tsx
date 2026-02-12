"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Chip,
    InputAdornment,
    TextField
} from "@mui/material";
import {
    Search as SearchIcon,
    CheckCircle as PaidIcon,
    Warning as PendingIcon,
    AttachMoney as RevenueIcon,
    Receipt as ReceiptIcon
} from "@mui/icons-material";

interface Fine {
    id: number;
    violationType: string;
    vehicleNumber: string;
    amount: number;
    location: string;
    status: "PENDING" | "PAID";
    issuedAt: string;
    officer: {
        fullName: string;
        badgeNumber: string; // Assuming badge number is officer ID or similar
    };
    citizen: {
        fullName: string;
        nic: string;
    }
}

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function AdminFinesPage() {
    const [fines, setFines] = useState<Fine[]>([]);
    const [filteredFines, setFilteredFines] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const token = useSelector((state: RootState) => state.auth.user?.token);

    useEffect(() => {
        if (token) fetchFines();
    }, [token]);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = fines.filter(f =>
            f.vehicleNumber.toLowerCase().includes(lowerSearch) ||
            f.violationType.toLowerCase().includes(lowerSearch) ||
            f.citizen.nic.toLowerCase().includes(lowerSearch)
        );
        setFilteredFines(filtered);
    }, [searchTerm, fines]);

    const fetchFines = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/fines/all", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFines(data);
                setFilteredFines(data);
            }
        } catch (error) {
            console.error("Error fetching fines:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

    const totalRevenue = fines.filter(f => f.status === "PAID").reduce((sum, f) => sum + f.amount, 0);
    const pendingAmount = fines.filter(f => f.status === "PENDING").reduce((sum, f) => sum + f.amount, 0);

    return (
        <Box sx={{ p: 3, position: 'relative' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: "var(--fg-main)", letterSpacing: '-0.02em' }}>
                Fine Management
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 4 }}>
                <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
                    <Card sx={{
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <RevenueIcon sx={{ color: '#10B981' }} />
                                <Typography variant="subtitle1" sx={{ color: '#10B981', fontWeight: 600 }}>Total Collected</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: 'var(--fg-main)' }}>LKR {totalRevenue.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
                    <Card sx={{
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <PendingIcon sx={{ color: '#EF4444' }} />
                                <Typography variant="subtitle1" sx={{ color: '#EF4444', fontWeight: 600 }}>Pending Dues</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: 'var(--fg-main)' }}>LKR {pendingAmount.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
                    <Card sx={{
                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <ReceiptIcon sx={{ color: '#3B82F6' }} />
                                <Typography variant="subtitle1" sx={{ color: '#3B82F6', fontWeight: 600 }}>Total Fines</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: 'var(--fg-main)' }}>{fines.length}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Search Bar */}
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
                        placeholder="Search by Vehicle Number, Violation Type, or Citizen NIC..."
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

            <TableContainer component={Paper} elevation={0} sx={{
                bgcolor: 'transparent',
                border: '1px solid var(--border-medium)',
                borderRadius: '20px',
                overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}><strong>ID</strong></TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}><strong>Citizen</strong></TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}><strong>Vehicle</strong></TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}><strong>Violation</strong></TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}><strong>Amount</strong></TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}><strong>Issued By</strong></TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}><strong>Date</strong></TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFines.map((fine) => (
                            <TableRow key={fine.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02) !important' } }}>
                                <TableCell sx={{ color: 'var(--fg-main)', borderBottom: '1px solid var(--border-light)' }}>#{fine.id}</TableCell>
                                <TableCell sx={{ color: 'var(--fg-main)', borderBottom: '1px solid var(--border-light)' }}>
                                    <Typography variant="body2" fontWeight="bold">{fine.citizen.fullName}</Typography>
                                    <Typography variant="caption" sx={{ color: 'var(--fg-secondary)' }}>{fine.citizen.nic}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: 'var(--fg-main)', borderBottom: '1px solid var(--border-light)' }}>{fine.vehicleNumber}</TableCell>
                                <TableCell sx={{ color: 'var(--fg-main)', borderBottom: '1px solid var(--border-light)' }}>
                                    <Chip
                                        label={fine.violationType}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                                            color: '#60A5FA',
                                            border: '1px solid rgba(59, 130, 246, 0.2)'
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: 'var(--fg-main)', fontWeight: 'bold', borderBottom: '1px solid var(--border-light)' }}>LKR {fine.amount.toLocaleString()}</TableCell>
                                <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}>{fine.officer.fullName}</TableCell>
                                <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)' }}>{new Date(fine.issuedAt).toLocaleDateString()}</TableCell>
                                <TableCell sx={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <Chip
                                        label={fine.status}
                                        size="small"
                                        variant="outlined"
                                        icon={fine.status === "PAID" ? <PaidIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
                                        sx={{
                                            fontWeight: 700,
                                            borderColor: fine.status === "PAID" ? '#10B981' : '#EF4444',
                                            color: fine.status === "PAID" ? '#10B981' : '#EF4444',
                                            '& .MuiChip-icon': { color: 'inherit' }
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredFines.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ color: 'var(--fg-secondary)', py: 5, borderBottom: 'none' }}>
                                    No records found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
