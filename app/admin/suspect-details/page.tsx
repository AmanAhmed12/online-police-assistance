"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Checkbox, FormControlLabel,
    Chip, Avatar, Snackbar, Alert, Grid, MenuItem, Stack, Divider,
    TablePagination
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { suspectService } from "@/services/suspectService";

/* =======================
    DATA MODEL
======================= */
interface Suspect {
    id: number;
    name: string;
    nic: string;
    age: number | "";
    gender: string;
    lastSeenLocation: string;
    description: string;
    signs: string[];
    image: string;
    crime: string;
}

const SAMPLE_CRIMES = ["Theft", "Robbery", "Assault", "Fraud", "Vandalism", "Drugs", "Kidnapping", "Cybercrime", "Other"];
const IDENTIFYING_SIGNS = ["Scar", "Tattoo", "Beard", "Moustache", "Limping Walk", "Burn Marks", "Missing Finger", "Wears Glasses"];

export default function SuspectManagementPage() {
    const [suspects, setSuspects] = useState<Suspect[]>([]);
    const token = useSelector((state: RootState) => state.auth.user?.token);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedSuspects = suspects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // --- 1. INITIAL LOAD ---
    const fetchSuspects = useCallback(async () => {
        try {
            const data = await suspectService.getAllSuspects(token);
            setSuspects(data);
        } catch (error) {
            setSnackbar("Failed to load suspect records");
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchSuspects();
    }, [token, fetchSuspects]);

    // DIALOG STATES
    const [openDialog, setOpenDialog] = useState(false);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState("");
    const [currentSuspect, setCurrentSuspect] = useState<Suspect | null>(null);
    const [viewDialog, setViewDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const initialFormState: Omit<Suspect, "id"> = {
        name: "", nic: "", age: "", gender: "Male", lastSeenLocation: "", description: "", signs: [], image: "", crime: "Theft"
    };

    const [formData, setFormData] = useState<Omit<Suspect, "id">>(initialFormState);

    /* =======================
        HANDLERS
    ======================= */

    const handleOpenAdd = () => {
        setEditId(null);
        setIsViewOnly(false);
        setFormData(initialFormState);
        setOpenDialog(true);
    };


    // const confirmDelete = () => {
    //     if (deleteId === null) return;
    //     setSuspects(prev => prev.filter(s => s.id !== deleteId));
    //     setDeleteId(null);
    //     setSnackbar("Suspect deleted successfully");
    // };

    const openViewDialog = (suspect: Suspect) => {
        setCurrentSuspect(suspect);
        setViewDialog(true);
    };


    const handleEdit = (suspect: Suspect) => {
        setEditId(suspect.id);
        setFormData(suspect);
        setIsViewOnly(false);
        setOpenDialog(true);
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewOnly) return;
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const toggleSign = (sign: string) => {
        if (isViewOnly) return;
        setFormData(prev => ({
            ...prev,
            signs: prev.signs.includes(sign) ? prev.signs.filter(s => s !== sign) : [...prev.signs, sign]
        }));
    };


    const handleSave = async () => {
        try {
            if (editId) {
                await suspectService.updateSuspect(editId, formData, token);
                setSnackbar("Suspect record updated");
            } else {
                await suspectService.createSuspect(formData, token);
                setSnackbar("Suspect added to registry successfully");
            }
            setOpenDialog(false);
            fetchSuspects(); // Refresh list
        } catch (error) {
            setSnackbar("Error saving record. Please check permissions.");
        }
    };

    // --- 3. DELETE ---
    const confirmDelete = async () => {
        if (deleteId === null) return;
        try {
            await suspectService.deleteSuspect(deleteId, token);
            setSnackbar("Suspect deleted successfully");
            fetchSuspects(); // Refresh list
        } catch (error) {
            setSnackbar("Failed to delete record");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* 1. LIST VIEW HEADER */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="800">Suspect Registry</Typography>
                    <Typography color="text.secondary">Law Enforcement Information System</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: 2, height: 48, px: 3 }}>
                    Add Suspect
                </Button>
            </Stack>

            {/* 2. LIST VIEW TABLE */}
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: "action.hover" }}>
                            <TableRow>
                                <TableCell>Photo</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>NIC</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Crime</TableCell>
                                <TableCell>Last Seen</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedSuspects.map((s) => (
                                <TableRow key={s.id} hover>
                                    <TableCell><Avatar src={s.image} /></TableCell>
                                    <TableCell><Typography fontWeight="600">{s.name}</Typography></TableCell>
                                    <TableCell>{s.nic}</TableCell>
                                    <TableCell>{s.gender}</TableCell>
                                    <TableCell>{s.age}</TableCell>
                                    <TableCell><Chip label={s.crime} size="small" color="error" variant="outlined" /></TableCell>
                                    <TableCell>{s.lastSeenLocation}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => openViewDialog(s)}><VisibilityIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" onClick={() => handleEdit(s)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => setDeleteId(s.id)}><DeleteIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={suspects.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>


            {/* VIEW DIALOG */}
            <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Suspect Details</DialogTitle>
                <DialogContent dividers>
                    {currentSuspect && (
                        <>
                            <Avatar src={currentSuspect.image} sx={{ width: 120, height: 120, mb: 2 }} />
                            <Typography><b>Name:</b> {currentSuspect.name}</Typography>
                            <Typography><b>NIC:</b> {currentSuspect.nic}</Typography>
                            <Typography><b>Age:</b> {currentSuspect.age || "-"}</Typography>
                            <Typography><b>Gender:</b> {currentSuspect.gender}</Typography>
                            <Typography><b>Last Seen:</b> {currentSuspect.lastSeenLocation}</Typography>
                            <Typography><b>Crime:</b> {currentSuspect.crime}</Typography>
                            <Box mt={2}>{currentSuspect.signs.map(sign => (<Chip key={sign} label={sign} sx={{ mr: 1, mb: 1 }} />))}</Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>


            {/* 3. UNIFIED DIALOG (Handles Add, Edit, and View) */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: "800", pt: 3 }}>
                    {isViewOnly ? "View Suspect Details" : editId ? "Edit Suspect Record" : "Register New Suspect"}
                </DialogTitle>

                <DialogContent dividers sx={{ p: 0 }}>
                    <Grid container>
                        <Grid size={{ xs: 12, md: 7 }} sx={{ p: 4, borderRight: { md: "1px solid" }, borderColor: "divider" }}>
                            <Stack spacing={3}>
                                <Typography variant="subtitle2" color="primary" fontWeight="700">PRIMARY DETAILS</Typography>
                                <TextField fullWidth label="Full Name" disabled={isViewOnly} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                <Grid container spacing={2}>
                                    <Grid size={6}><TextField fullWidth label="NIC" disabled={isViewOnly} value={formData.nic} onChange={e => setFormData({ ...formData, nic: e.target.value })} /></Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth label="Age" type="number" disabled={isViewOnly} value={formData.age}
                                            onChange={e => setFormData({ ...formData, age: e.target.value === "" ? "" : Number(e.target.value) })} />
                                    </Grid>
                                </Grid>
                                <Stack direction="row" spacing={2}>
                                    <TextField select fullWidth label="Gender" disabled={isViewOnly} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </TextField>
                                    <TextField select fullWidth label="Crime" disabled={isViewOnly} value={formData.crime} onChange={e => setFormData({ ...formData, crime: e.target.value })}>
                                        {SAMPLE_CRIMES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                    </TextField>
                                </Stack>
                                <TextField fullWidth label="Last Seen Location" disabled={isViewOnly} value={formData.lastSeenLocation} onChange={e => setFormData({ ...formData, lastSeenLocation: e.target.value })} />
                                <TextField fullWidth multiline rows={3} label="Description" disabled={isViewOnly} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }} sx={{ p: 4, bgcolor: "rgba(0,0,0,0.01)" }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="subtitle2" color="primary" fontWeight="700" mb={2}>SUSPECT PHOTO</Typography>
                                    <Paper variant="outlined" sx={{ height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderStyle: "dashed", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                                        {formData.image ? (
                                            <>
                                                <Box component="img" src={formData.image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                {!isViewOnly && (
                                                    <IconButton size="small" color="error" onClick={() => setFormData({ ...formData, image: "" })} sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(255,255,255,0.8)" }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </>
                                        ) : (
                                            <Stack alignItems="center" spacing={1}>
                                                <CloudUploadIcon color="disabled" sx={{ fontSize: 40 }} />
                                                {!isViewOnly && <Button component="label" size="small">Upload Photo<input hidden type="file" accept="image/*" onChange={handleImageUpload} /></Button>}
                                            </Stack>
                                        )}
                                    </Paper>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="subtitle2" color="primary" fontWeight="700" mb={1}>IDENTIFYING MARKS</Typography>
                                    <Grid container>
                                        {IDENTIFYING_SIGNS.map(sign => (
                                            <Grid size={6} key={sign}>
                                                <FormControlLabel control={<Checkbox size="small" disabled={isViewOnly} checked={formData.signs.includes(sign)} onChange={() => toggleSign(sign)} />} label={<Typography variant="body2">{sign}</Typography>} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">{isViewOnly ? "Close" : "Cancel"}</Button>
                    {!isViewOnly && <Button variant="contained" onClick={handleSave} sx={{ px: 4, borderRadius: 2 }}>{editId ? "Update Record" : "Save Record"}</Button>}
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION */}
            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent><Typography>Are you sure you want to delete this suspect?</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar("")}>
                <Alert severity="success" variant="filled">{snackbar}</Alert>
            </Snackbar>
        </Box>
    );
}