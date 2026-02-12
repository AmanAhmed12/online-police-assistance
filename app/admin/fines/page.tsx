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
    TablePagination,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    CircularProgress,
    Chip,
    InputAdornment,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
} from "@mui/material";
import {
    Search as SearchIcon,
    CheckCircle as PaidIcon,
    Warning as PendingIcon,
    AttachMoney as RevenueIcon,
    Receipt as ReceiptIcon,
    Download as DownloadIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Fine, getAllFines, updateFine, deleteFine } from "@/app/services/fineService";

export default function AdminFinesPage() {
    const [fines, setFines] = useState<Fine[]>([]);
    const [filteredFines, setFilteredFines] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reportType, setReportType] = useState('Full Fines Report');
    const [generating, setGenerating] = useState(false);

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Edit State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingFine, setEditingFine] = useState<Fine | null>(null);
    const [editForm, setEditForm] = useState({
        vehicleNumber: '',
        violationType: '',
        amount: 0,
        location: '',
        status: 'PENDING'
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Delete Confirmation State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

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
        setPage(0); // Reset to first page on search
    }, [searchTerm, fines]);

    const fetchFines = async () => {
        try {
            const data = await getAllFines(token);
            setFines(data);
            setFilteredFines(data);
        } catch (error) {
            console.error("Error fetching fines:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (fine: Fine) => {
        setEditingFine(fine);
        setEditForm({
            vehicleNumber: fine.vehicleNumber,
            violationType: fine.violationType,
            amount: fine.amount,
            location: fine.location,
            status: fine.status
        });
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (deletingId === null) return;
        try {
            await deleteFine(deletingId, token);
            setSnackbar({ open: true, message: "Fine record deleted successfully", severity: 'success' });
            fetchFines();
        } catch (error) {
            setSnackbar({ open: true, message: "Error deleting record", severity: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setDeletingId(null);
        }
    };

    const handleUpdateFine = async () => {
        if (!editingFine) return;

        try {
            await updateFine(editingFine.id, editForm, token);
            setSnackbar({ open: true, message: "Fine updated successfully", severity: 'success' });
            setEditDialogOpen(false);
            fetchFines();
        } catch (error) {
            setSnackbar({ open: true, message: "Error updating fine", severity: 'error' });
        }
    };

    const handleGeneratePDF = async () => {
        try {
            setGenerating(true);
            const doc = new jsPDF();

            // 1. Add Logo
            try {
                const logoImg = new Image();
                logoImg.src = window.location.origin + '/policelogo.jpeg';
                await new Promise((resolve, reject) => {
                    logoImg.onload = resolve;
                    logoImg.onerror = () => reject(new Error('Image failed to load'));
                    setTimeout(() => reject(new Error('Image load timeout')), 5000);
                });
                doc.addImage(logoImg, 'JPEG', 15, 8, 24, 28);
            } catch (error) {
                console.warn('Error loading logo, using fallback:', error);
                doc.setFillColor(28, 102, 242);
                doc.circle(27, 22, 12, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.text("POLICE", 20, 23);
            }

            // 2. Header Information
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("POLICE DEPARTMENT", 45, 20);

            doc.setFontSize(14);
            doc.setFont("helvetica", "normal");
            doc.text("Online Assistance Management System", 45, 28);

            doc.setDrawColor(200, 200, 200);
            doc.line(15, 40, 195, 40);

            // 3. Report Info
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(reportType.toUpperCase(), 15, 52);

            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 15, 58);
            doc.text(`Generated by: System Administrator`, 15, 63);

            // 4. Data Logic
            let headers: string[] = [];
            let rows: any[][] = [];

            if (reportType === "Full Fines Report") {
                headers = ["ID", "Citizen", "Vehicle", "Violation", "Amount", "Status", "Date"];
                rows = fines.map(f => [
                    `#${f.id}`,
                    f.citizen.fullName,
                    f.vehicleNumber,
                    f.violationType,
                    `LKR ${f.amount.toLocaleString()}`,
                    f.status,
                    format(new Date(f.issuedAt), 'yyyy-MM-dd')
                ]);
            } else if (reportType === "Revenue Report") {
                const paidFines = fines.filter(f => f.status === "PAID");
                headers = ["ID", "Citizen", "Vehicle", "Violation", "Amount", "Paid Date"];
                rows = paidFines.map(f => [
                    `#${f.id}`,
                    f.citizen.fullName,
                    f.vehicleNumber,
                    f.violationType,
                    `LKR ${f.amount.toLocaleString()}`,
                    format(new Date(f.issuedAt), 'yyyy-MM-dd') // Using issuedAt for now as fallback
                ]);
            } else if (reportType === "Pending Fines Report") {
                const pendingFines = fines.filter(f => f.status === "PENDING");
                headers = ["ID", "Citizen", "Vehicle", "Violation", "Amount", "Issued Date"];
                rows = pendingFines.map(f => [
                    `#${f.id}`,
                    f.citizen.fullName,
                    f.vehicleNumber,
                    f.violationType,
                    `LKR ${f.amount.toLocaleString()}`,
                    format(new Date(f.issuedAt), 'yyyy-MM-dd')
                ]);
            } else if (reportType === "Violations breakdown") {
                const breakdown: Record<string, { count: number, amount: number }> = {};
                fines.forEach(f => {
                    if (!breakdown[f.violationType]) {
                        breakdown[f.violationType] = { count: 0, amount: 0 };
                    }
                    breakdown[f.violationType].count += 1;
                    breakdown[f.violationType].amount += f.amount;
                });
                headers = ["Violation Type", "Count", "Total Amount"];
                rows = Object.entries(breakdown).map(([type, stats]) => [
                    type,
                    stats.count,
                    `LKR ${stats.amount.toLocaleString()}`
                ]);
            }

            // 5. Generate Table
            autoTable(doc, {
                startY: 70,
                head: [headers],
                body: rows,
                theme: 'striped',
                headStyles: { fillColor: [40, 102, 242], textColor: 255 },
                alternateRowStyles: { fillColor: [245, 247, 250] },
                margin: { left: 15, right: 15 },
            });

            // 6. Footer
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    `Page ${i} of ${pageCount} - Private & Confidential`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            doc.save(`${reportType.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
            setOpenReportDialog(false);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

    const totalRevenue = fines.filter(f => f.status === "PAID").reduce((sum, f) => sum + f.amount, 0);
    const pendingAmount = fines.filter(f => f.status === "PENDING").reduce((sum, f) => sum + f.amount, 0);

    return (
        <Box sx={{ p: 3, position: 'relative' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "var(--fg-main)", letterSpacing: '-0.02em', mb: 0 }}>
                    Fine Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => setOpenReportDialog(true)}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 12px rgba(40, 102, 242, 0.25)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(40, 102, 242, 0.35)',
                        },
                        transition: 'all 0.2s'
                    }}
                >
                    Generate Reports
                </Button>
            </Box>

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
                            <TableCell sx={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--border-light)', textAlign: 'center' }}><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFines
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((fine) => (
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
                                    <TableCell sx={{ borderBottom: '1px solid var(--border-light)', textAlign: 'center' }}>
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            <Tooltip title="Edit Fine">
                                                <IconButton size="small" onClick={() => handleEditClick(fine)} sx={{ color: '#3B82F6', '&:hover': { bgcolor: 'rgba(59,130,246,0.1)' } }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Soft Delete">
                                                <IconButton size="small" onClick={() => handleDeleteClick(fine.id)} sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
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

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredFines.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                sx={{
                    color: 'var(--fg-secondary)',
                    borderTop: '1px solid var(--border-light)',
                    '.MuiTablePagination-selectIcon': { color: 'var(--fg-secondary)' },
                    '.MuiTablePagination-actions': { color: 'var(--fg-secondary)' }
                }}
            />

            {/* Report Selection Dialog */}
            <Dialog
                open={openReportDialog}
                onClose={() => !generating && setOpenReportDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                    Generate Fines Report
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" mb={3}>
                        Select the type of report you wish to generate. The PDF will include real-time fine data from the system.
                    </Typography>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel id="report-type-label">Report Type</InputLabel>
                        <Select
                            labelId="report-type-label"
                            id="report-type-select"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            label="Report Type"
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="Full Fines Report">Full Fines Report</MenuItem>
                            <MenuItem value="Revenue Report">Revenue (Paid Fines)</MenuItem>
                            <MenuItem value="Pending Fines Report">Pending Dues Report</MenuItem>
                            <MenuItem value="Violations breakdown">Violations Breakdown</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button
                        onClick={() => setOpenReportDialog(false)}
                        disabled={generating}
                        sx={{ color: 'text.secondary' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGeneratePDF}
                        variant="contained"
                        disabled={generating}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            bgcolor: 'primary.main',
                            boxShadow: '0 4px 12px rgba(40, 102, 242, 0.2)'
                        }}
                    >
                        {generating ? "Generating..." : "Generate PDF"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Fine Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-light)', color: 'var(--fg-main)' }}>
                    Edit Fine Details
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Vehicle Number"
                            fullWidth
                            value={editForm.vehicleNumber}
                            onChange={(e) => setEditForm({ ...editForm, vehicleNumber: e.target.value })}
                        />
                        <TextField
                            label="Violation Type"
                            fullWidth
                            disabled
                            value={editForm.violationType}
                            onChange={(e) => setEditForm({ ...editForm, violationType: e.target.value })}
                        />
                        <TextField
                            label="Fine Amount (LKR)"
                            type="number"
                            fullWidth
                            disabled
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                        />
                        <TextField
                            label="Location"
                            fullWidth
                            disabled
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={editForm.status}
                                label="Status"
                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                            >
                                <MenuItem value="PENDING">PENDING</MenuItem>
                                <MenuItem value="PAID">PAID</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid var(--border-light)' }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'var(--fg-secondary)' }}>Cancel</Button>
                    <Button
                        onClick={handleUpdateFine}
                        variant="contained"
                        sx={{ borderRadius: 2, px: 4, bgcolor: '#3B82F6' }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Beautiful Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        backgroundImage: 'none',
                        maxWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: '#EF4444',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    pb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <DeleteIcon sx={{ fontSize: 28 }} />
                    Delete Record?
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'var(--fg-secondary)', lineHeight: 1.6 }}>
                        Are you sure you want to delete this fine record? This will hide the record from standard views.
                        <strong> This action is reversible but should be handled with care.</strong>
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{ color: 'var(--fg-secondary)', textTransform: 'none', fontWeight: 600 }}
                    >
                        Keep Record
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        sx={{
                            bgcolor: '#EF4444',
                            '&:hover': { bgcolor: '#DC2626' },
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                        }}
                    >
                        Delete Permanently
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
