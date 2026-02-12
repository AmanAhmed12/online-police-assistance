"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Alert,
    Avatar,
    Divider,
    Snackbar,
    CircularProgress
} from "@mui/material";
import { Search as SearchIcon, Receipt as ReceiptIcon, LocalPolice as PoliceIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function IssueFinePage() {
    const [nic, setNic] = useState("");
    const [citizen, setCitizen] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = useSelector((state: RootState) => state.auth.user?.token);
    const [violationTypes, setViolationTypes] = useState<{ label: string, amount: number }[]>([]);

    useEffect(() => {
        const fetchViolations = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/violations/all", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setViolationTypes(data);
                }
            } catch (err) {
                console.error("Failed to fetch violations");
            }
        };
        if (token) fetchViolations();
    }, [token]);

    const [fineDetails, setFineDetails] = useState({
        vehicleNumber: "",
        violationType: "",
        amount: 0,
        location: "",
    });

    const handleSearch = async () => {
        if (!nic) return;
        setLoading(true);
        setError("");
        setCitizen(null);

        try {
            const response = await fetch(`http://localhost:8080/api/fines/check-user/${nic}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCitizen(data);
            } else {
                setError("Citizen not found. Please check the NIC.");
            }
        } catch (err) {
            setError("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleViolationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const type = e.target.value;
        const violation = violationTypes.find((v) => v.label === type);
        setFineDetails({
            ...fineDetails,
            violationType: type,
            amount: violation ? violation.amount : 0,
        });
    };

    const handleSubmit = async () => {
        if (!citizen || !fineDetails.vehicleNumber || !fineDetails.violationType) {
            setError("Please fill all fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/fines/issue", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    citizenNic: citizen.nic,
                    vehicleNumber: fineDetails.vehicleNumber,
                    violationType: fineDetails.violationType,
                    amount: fineDetails.amount,
                    location: fineDetails.location
                })
            });

            if (response.ok) {
                setSuccess("Fine issued successfully!");
                setCitizen(null);
                setNic("");
                setFineDetails({ vehicleNumber: "", violationType: "", amount: 0, location: "" });
            } else {
                const errData = await response.text();
                setError("Failed to issue fine: " + errData);
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, position: 'relative' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: "var(--fg-main)", letterSpacing: '-0.02em' }}>
                Issue Traffic Fine
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={3}>
                {/* Verification Section */}
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                    <Card sx={{
                        height: "100%",
                        bgcolor: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '24px',
                        boxShadow: 'none'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(59, 130, 246, 0.1)' }}>
                                    <SearchIcon sx={{ color: '#3B82F6' }} />
                                </Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--fg-main)' }}>Citizen Identification</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'var(--fg-secondary)', mb: 3 }}>
                                Enter the National Identity Card (NIC) number of the violator to verify their registration.
                            </Typography>

                            <Box display="flex" gap={2}>
                                <TextField
                                    fullWidth
                                    placeholder="Enter NIC Number"
                                    variant="outlined"
                                    value={nic}
                                    onChange={(e) => setNic(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                                            '& fieldset': { borderColor: 'var(--border-light)' },
                                        },
                                        '& .MuiInputBase-input': { color: 'var(--fg-main)' }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    disabled={loading}
                                    sx={{
                                        minWidth: 100,
                                        borderRadius: '12px',
                                        bgcolor: 'var(--primary)',
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Verify"}
                                </Button>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mt: 3, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    {error}
                                </Alert>
                            )}

                            {citizen && (
                                <Box sx={{
                                    mt: 4,
                                    p: 3,
                                    bgcolor: 'rgba(59, 130, 246, 0.05)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(59, 130, 246, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2.5
                                }}>
                                    <Avatar sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: "#2866f2",
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 14px rgba(40, 102, 242, 0.3)'
                                    }}>
                                        {citizen.fullName[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--fg-main)' }}>
                                            {citizen.fullName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'var(--fg-secondary)', mb: 0.5 }}>
                                            NIC: {citizen.nic}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
                                            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
                                                Active Citizen
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>

                {/* Fine Details Section */}
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                    <Card sx={{
                        height: "100%",
                        opacity: citizen ? 1 : 0.4,
                        pointerEvents: citizen ? 'auto' : 'none',
                        transition: 'opacity 0.3s ease',
                        bgcolor: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '24px',
                        boxShadow: 'none'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
                                    <ReceiptIcon sx={{ color: '#EF4444' }} />
                                </Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--fg-main)' }}>Fine Details</Typography>
                            </Box>

                            <Box display="flex" flexDirection="column" gap={2.5}>
                                <TextField
                                    fullWidth
                                    label="Vehicle Number"
                                    value={fineDetails.vehicleNumber}
                                    onChange={(e) => setFineDetails({ ...fineDetails, vehicleNumber: e.target.value })}
                                    placeholder="e.g. WP-ABC-1234"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)' },
                                        '& .MuiInputLabel-root': { color: 'var(--fg-secondary)' },
                                        '& .MuiInputBase-input': { color: 'var(--fg-main)' }
                                    }}
                                />

                                <TextField
                                    select
                                    fullWidth
                                    label="Violation Type"
                                    value={fineDetails.violationType}
                                    onChange={handleViolationChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)' },
                                        '& .MuiInputLabel-root': { color: 'var(--fg-secondary)' },
                                        '& .MuiInputBase-input': { color: 'var(--fg-main)' }
                                    }}
                                >
                                    {violationTypes.map((option) => (
                                        <MenuItem key={option.label} value={option.label} sx={{ bgcolor: 'var(--bg-surface)', color: 'var(--fg-main)' }}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Box display="flex" gap={2.5}>
                                    <TextField
                                        fullWidth
                                        label="Fine Amount"
                                        value={`LKR ${fineDetails.amount.toLocaleString()}`}
                                        disabled
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                            '& .MuiInputLabel-root': { color: 'var(--fg-secondary)' },
                                            '& .MuiInputBase-input': { color: 'var(--fg-main)', WebkitTextFillColor: 'var(--fg-main) !important' }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        value={fineDetails.location}
                                        onChange={(e) => setFineDetails({ ...fineDetails, location: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)' },
                                            '& .MuiInputLabel-root': { color: 'var(--fg-secondary)' },
                                            '& .MuiInputBase-input': { color: 'var(--fg-main)' }
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Divider sx={{ my: 4, borderColor: 'var(--border-light)' }} />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<PoliceIcon />}
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{
                                    py: 2,
                                    borderRadius: '16px',
                                    bgcolor: '#EF4444',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                                    '&:hover': { bgcolor: '#DC2626', boxShadow: '0 12px 30px rgba(239, 68, 68, 0.4)' },
                                    '&.Mui-disabled': { bgcolor: 'rgba(239, 68, 68, 0.2)', color: 'rgba(255,255,255,0.3)' }
                                }}
                            >
                                Issue e-Fine
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess("")}>
                <Alert severity="success" sx={{ width: '100%', borderRadius: '12px', bgcolor: '#10B981', color: 'white' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
}
