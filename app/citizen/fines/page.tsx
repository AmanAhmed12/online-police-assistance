"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar
} from "@mui/material";
import {
    Payment as PaymentIcon,
    CheckCircle as PaidIcon,
    Warning as PendingIcon,
    Receipt as ReceiptIcon,
    History as HistoryIcon
} from "@mui/icons-material";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Fine, getMyFines, verifyFinePayment } from "@/app/services/fineService";

export default function MyFinesPage() {
    const [fines, setFines] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Payment State
    const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error"
    });

    const token = useSelector((state: RootState) => state.auth.user?.token);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (token) fetchFines();

        // Handle Redirect Return from PayHere
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdParam = urlParams.get('order_id');
        if (orderIdParam && token) {
            console.log("Detected return from PayHere, verifying order:", orderIdParam);
            verifyPayment(parseInt(orderIdParam), "PAYHERE_RETURN_" + orderIdParam);
            // Clear URL params
            window.history.replaceState({}, '', window.location.pathname);
        }

        // Setup PayHere Global Listeners (For Modal)
        if (typeof window !== 'undefined') {
            (window as any).payhere = (window as any).payhere || {};

            (window as any).payhere.onCompleted = function onCompleted(orderId: string) {
                console.log("Payment completed. OrderID:" + orderId);
                verifyPayment(parseInt(orderId), "PAYHERE_MODAL_" + orderId);
            };

            (window as any).payhere.onDismissed = function onDismissed() {
                console.log("Payment dismissed");
                setIsProcessing(false);
            };

            (window as any).payhere.onError = function onError(error: string) {
                console.log("Error:" + error);
                alert("Payment Error: " + error);
                setIsProcessing(false);
            };
        }
    }, [token, user]);

    const fetchFines = async () => {
        try {
            const data = await getMyFines(token);
            setFines(data);
        } catch (err) {
            setError("Failed to load fines.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayClick = async (fine: Fine) => {
        setSelectedFine(fine);
        setIsProcessing(true);

        try {
            // 1. Get Hash from our internal API
            const hashResponse = await fetch("/api/payhere/hash", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: fine.id.toString(),
                    amount: fine.amount,
                    currency: "LKR"
                })
            });

            if (!hashResponse.ok) throw new Error("Failed to generate payment hash");
            const { hash } = await hashResponse.json();

            // 2. Prepare PayHere Object
            const payment = {
                sandbox: true,
                merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
                return_url: window.location.origin + "/citizen/fines",
                cancel_url: window.location.origin + "/citizen/fines",
                notify_url: "http://localhost:8080/api/fines/payhere-notify",
                order_id: fine.id.toString(),
                items: "Traffic Fine: " + fine.violationType,
                amount: fine.amount.toFixed(2),
                currency: "LKR",
                first_name: (user?.fullName || "Citizen").split(' ')[0],
                last_name: (user?.fullName || "User").split(' ').slice(1).join(' ') || "User",
                email: "citizen@example.com",
                phone: "0771234567",
                address: "Colombo, Sri Lanka",
                city: "Colombo",
                country: "Sri Lanka",
                hash: hash
            };

            // 3. Start Payment
            (window as any).payhere.startPayment(payment);
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: "Could not initiate payment. Please try again.", severity: "error" });
            setIsProcessing(false);
        }
    };

    const verifyPayment = async (fineId: number, paymentId: string) => {
        if (isNaN(fineId)) return;
        try {
            await verifyFinePayment(fineId, paymentId, token);
            setSnackbar({ open: true, message: "Payment successful! Your fine has been marked as PAID.", severity: "success" });
            fetchFines(); // Refresh list
            setIsProcessing(false);
        } catch (error) {
            console.error("Payment error", error);
            setSnackbar({ open: true, message: "Verification failed. Please contact support if the amount was deducted.", severity: "error" });
            setIsProcessing(false);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

    const pendingFines = fines.filter(f => f.status === "PENDING");
    const paidFines = fines.filter(f => f.status === "PAID");

    return (
        <Box sx={{ p: 3, position: 'relative' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: "var(--fg-main)", letterSpacing: '-0.02em' }}>
                My Traffic Fines
            </Typography>

            {/* Summary Cards */}
            <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 5 }}>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                    <Card sx={{
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                                <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.2)' }}>
                                    <PendingIcon sx={{ color: '#EF4444' }} />
                                </Box>
                                <Typography variant="h6" sx={{ color: '#EF4444', fontWeight: 700 }}>Pending Dues</Typography>
                            </Box>
                            <Typography variant="h2" fontWeight="800" sx={{ color: 'var(--fg-main)', mb: 1 }}>
                                LKR {pendingFines.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--fg-secondary)' }}>
                                {pendingFines.length} Unpaid Fines
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                    <Card sx={{
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                                <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.2)' }}>
                                    <PaidIcon sx={{ color: '#10B981' }} />
                                </Box>
                                <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 700 }}>Paid Amount</Typography>
                            </Box>
                            <Typography variant="h2" fontWeight="800" sx={{ color: 'var(--fg-main)', mb: 1 }}>
                                LKR {paidFines.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--fg-secondary)' }}>
                                {paidFines.length} Paid Fines
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Pending Fines Table */}
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: 'var(--fg-main)', fontWeight: 700 }}>
                <PendingIcon sx={{ color: '#F59E0B' }} /> Pending Actions
            </Typography>

            {pendingFines.length === 0 ? (
                <Alert severity="success" sx={{ mb: 6, borderRadius: '16px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(10px)' }}>
                    You have no pending fines! Drive safely.
                </Alert>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{
                    mb: 6,
                    bgcolor: 'transparent',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '24px',
                    overflow: 'hidden'
                }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}><strong>Fine ID</strong></TableCell>
                                <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}><strong>Violation</strong></TableCell>
                                <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}><strong>Vehicle</strong></TableCell>
                                <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}><strong>Date</strong></TableCell>
                                <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}><strong>Amount</strong></TableCell>
                                <TableCell align="center" sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingFines.map((fine) => (
                                <TableRow key={fine.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02) !important' } }}>
                                    <TableCell sx={{ color: 'var(--fg-main)', borderBottom: '1px solid var(--border-light)', py: 2.5 }}>#{fine.id}</TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid var(--border-light)', py: 2.5 }}>
                                        <Chip
                                            label={fine.violationType}
                                            sx={{
                                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                color: '#60A5FA',
                                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: 'var(--fg-main)', borderBottom: '1px solid var(--border-light)', py: 2.5 }}>{fine.vehicleNumber}</TableCell>
                                    <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2.5 }}>{new Date(fine.issuedAt).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ fontWeight: '800', color: '#EF4444', fontSize: '1.1rem', borderBottom: '1px solid var(--border-light)', py: 2.5 }}>LKR {fine.amount}</TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid var(--border-light)', py: 2.5 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<PaymentIcon />}
                                            onClick={() => handlePayClick(fine)}
                                            sx={{
                                                bgcolor: 'var(--primary)',
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                                '&:hover': { bgcolor: 'var(--primary-bright)' }
                                            }}
                                        >
                                            Pay Now
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* History Section */}
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: 'var(--fg-main)', fontWeight: 700 }}>
                <HistoryIcon sx={{ color: 'var(--fg-secondary)' }} /> Payment History
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{
                bgcolor: 'transparent',
                border: '1px solid var(--border-medium)',
                borderRadius: '24px',
                overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}>Fine ID</TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}>Violation</TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}>Paid Date</TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}>Transaction ID</TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}>Amount</TableCell>
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2 }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paidFines.map((fine) => (
                            <TableRow key={fine.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02) !important' } }}>
                                <TableCell sx={{ color: 'var(--fg-main)', borderBottom: '1px solid var(--border-light)', py: 2.5 }}>#{fine.id}</TableCell>
                                <TableCell sx={{ borderBottom: '1px solid var(--border-light)', py: 2.5 }}>
                                    <Typography variant="body2" sx={{ color: 'var(--fg-main)', fontWeight: 500 }}>{fine.violationType}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', py: 2.5 }}>{fine.paidAt ? new Date(fine.paidAt).toLocaleDateString() : '-'}</TableCell>
                                <TableCell sx={{ color: 'var(--fg-secondary)', fontFamily: 'monospace', borderBottom: '1px solid var(--border-light)', py: 2.5 }}>{fine.paymentGatewayId}</TableCell>
                                <TableCell sx={{ color: 'var(--fg-main)', fontWeight: 600, borderBottom: '1px solid var(--border-light)', py: 2.5 }}>LKR {fine.amount}</TableCell>
                                <TableCell sx={{ borderBottom: '1px solid var(--border-light)', py: 2.5 }}>
                                    <Chip
                                        icon={<PaidIcon sx={{ fontSize: '1rem !important' }} />}
                                        label="PAID"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#10B981',
                                            color: '#10B981',
                                            fontWeight: 700,
                                            '& .MuiChip-icon': { color: '#10B981' }
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        {paidFines.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: 'var(--fg-secondary)', py: 5, borderBottom: 'none' }}>
                                    No payment history found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* PayHere SDK Script */}
            <Script
                src="https://www.payhere.lk/lib/payhere.js"
                strategy="lazyOnload"
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%', borderRadius: '12px', bgcolor: snackbar.severity === 'success' ? '#10B981' : '#EF4444', color: 'white' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
