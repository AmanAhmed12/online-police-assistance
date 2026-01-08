"use client";

import React, { useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Define Interface
interface CaseFile {
    id: string;
    title: string;
    officer: string;
    status: string;
}

export default function CasesPage() {
    // Mock Data
    const initialCases: CaseFile[] = [
        { id: 'C-2023-001', title: 'Robbery at Main St Bank', officer: 'Unassigned', status: 'Open' },
        { id: 'C-2023-002', title: 'Traffic Violation Audit', officer: 'Officer J.', status: 'Closed' },
        { id: 'C-2023-003', title: 'Cybercrime Investigation', officer: 'Officer M.', status: 'In Progress' },
    ];

    const availableOfficers = [
        'Officer K.',
        'Officer J.',
        'Officer M.',
        'Officer L.',
        'Officer S.'
    ];

    const [cases, setCases] = useState<CaseFile[]>(initialCases);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
    const [selectedOfficer, setSelectedOfficer] = useState('');

    const handleAssignClick = (caseItem: CaseFile) => {
        setSelectedCase(caseItem);
        // Pre-select current officer if assigned, otherwise empty
        setSelectedOfficer(caseItem.officer !== 'Unassigned' ? caseItem.officer : '');
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedCase(null);
        setSelectedOfficer('');
    };

    const handleOfficerChange = (event: SelectChangeEvent) => {
        setSelectedOfficer(event.target.value as string);
    };

    const handleConfirmAssign = () => {
        if (selectedCase && selectedOfficer) {
            setCases(prevCases => prevCases.map(c =>
                c.id === selectedCase.id
                    ? { ...c, officer: selectedOfficer, status: c.status === 'Open' ? 'In Progress' : c.status }
                    : c
            ));
            handleClose();
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                Case Files
            </Typography>
            <Paper sx={{ mt: 3 }}>
                <List>
                    {cases.map((caseItem, index) => (
                        <React.Fragment key={caseItem.id}>
                            <ListItem
                                secondaryAction={
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => handleAssignClick(caseItem)}
                                    >
                                        Assign
                                    </Button>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main' }}>
                                        <AssignmentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={caseItem.title}
                                    secondary={`ID: ${caseItem.id} | Assigned to: ${caseItem.officer} | Status: ${caseItem.status}`}
                                    primaryTypographyProps={{ fontWeight: 600 }}
                                />
                            </ListItem>
                            {index < cases.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            {/* Assignment Dialog */}
            <Dialog open={openDialog} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Assign Officer</DialogTitle>
                <DialogContent>
                    <Box pt={1}>
                        <Typography variant="subtitle2" gutterBottom>
                            Case: {selectedCase?.title}
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="officer-select-label">Select Officer</InputLabel>
                            <Select
                                labelId="officer-select-label"
                                value={selectedOfficer}
                                label="Select Officer"
                                onChange={handleOfficerChange}
                            >
                                {availableOfficers.map((officer) => (
                                    <MenuItem key={officer} value={officer}>
                                        {officer}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleConfirmAssign} color="primary" variant="contained">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
