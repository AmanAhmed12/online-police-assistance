"use client";

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    SelectChangeEvent,
    Snackbar,
    Alert,
    Chip,
    InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import {
    getEmergencyContacts,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    EmergencyContact
} from "@/app/services/emergencyService";
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

export default function EmergencyContactsPage() {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<EmergencyContact[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog States
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentContact, setCurrentContact] = useState<EmergencyContact | null>(null);
    const [contactToDelete, setContactToDelete] = useState<number | null>(null);

    // Auth
    const token = useSelector((state: RootState) => state.auth.user?.token);

    // Form State
    const [formData, setFormData] = useState<Omit<EmergencyContact, 'id'>>({
        name: '',
        number: '',
        type: 'Police',
        description: '',
        priority: 1
    });

    // Loading & Snackbar
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const data = await getEmergencyContacts(token);
            setContacts(data);
            setFilteredContacts(data);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(lowerTerm) ||
            contact.number.includes(lowerTerm) ||
            contact.type.toLowerCase().includes(lowerTerm)
        );
        setFilteredContacts(filtered);
    }, [searchTerm, contacts]);

    // Icon Helper
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Police': return <SecurityIcon color="primary" />;
            case 'Medical': return <MedicalServicesIcon color="error" />;
            case 'Fire': return <LocalFireDepartmentIcon color="warning" />;
            default: return <LocalPhoneIcon color="action" />;
        }
    };

    // Handlers
    const handleOpenDialog = (contact?: EmergencyContact) => {
        if (contact) {
            setCurrentContact(contact);
            setFormData({
                name: contact.name,
                number: contact.number,
                type: contact.type,
                description: contact.description || '',
                priority: contact.priority || 1
            });
        } else {
            setCurrentContact(null);
            setFormData({
                name: '',
                number: '',
                type: 'Police',
                description: '',
                priority: 1
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentContact(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (currentContact) {
                await updateEmergencyContact(currentContact.id, formData, token);
                setSnackbarMessage("Contact updated successfully");
            } else {
                await createEmergencyContact(formData, token);
                setSnackbarMessage("Contact added successfully");
            }
            fetchContacts();
            handleCloseDialog();
            setSnackbarOpen(true);
        } catch (error) {
            alert("Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setContactToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (contactToDelete === null) return;
        setLoading(true);
        try {
            await deleteEmergencyContact(contactToDelete, token);
            setSnackbarMessage("Contact deleted successfully");
            fetchContacts();
            setOpenDeleteDialog(false);
            setContactToDelete(null);
            setSnackbarOpen(true);
        } catch (error) {
            alert("Failed to delete contact");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                        Emergency Contacts
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage important numbers for citizens and officers.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ px: 3, py: 1, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                >
                    Add Contact
                </Button>
            </Box>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center' }} elevation={0} variant="outlined">
                <InputAdornment position="start" sx={{ mr: 1 }}>
                    <SearchIcon color="action" />
                </InputAdornment>
                <TextField
                    variant="standard"
                    placeholder="Search contacts by name, number or type..."
                    fullWidth
                    InputProps={{ disableUnderline: true }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Paper>

            <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }} elevation={0}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'background.default' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Service Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredContacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">No contacts found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <TableRow key={contact.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {getTypeIcon(contact.type)}
                                                <Chip
                                                    label={contact.type}
                                                    size="small"
                                                    variant="outlined"
                                                    color={contact.type === 'Medical' ? 'error' : contact.type === 'Fire' ? 'warning' : 'primary'}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="500">{contact.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold" color="primary">{contact.number}</Typography>
                                        </TableCell>
                                        <TableCell>{contact.description || "-"}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => handleOpenDialog(contact)} size="small">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteClick(contact.id)} size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {currentContact ? 'Edit Contact' : 'New Emergency Contact'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Service Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Emergency Number"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="type"
                                value={formData.type}
                                label="Type"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="Police">Police</MenuItem>
                                <MenuItem value="Medical">Medical / Ambulance</MenuItem>
                                <MenuItem value="Fire">Fire Department</MenuItem>
                                <MenuItem value="Hotline">Hotline</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={2}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={loading || !formData.name || !formData.number}
                    >
                        {loading ? "Saving..." : "Save Contact"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this emergency contact?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={10000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', boxShadow: 3 }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
