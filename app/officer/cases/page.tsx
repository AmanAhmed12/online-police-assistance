import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Divider } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function OfficerCasesPage() {
    const assignedCases = [
        { id: 'OC-101', title: 'Theft at Mall', priority: 'High', status: 'In Progress', date: '2023-11-01' },
        { id: 'OC-102', title: 'Traffic Accident Report', priority: 'Medium', status: 'Pending Review', date: '2023-11-02' },
        { id: 'OC-105', title: 'Lost Property Inquiry', priority: 'Low', status: 'Closed', date: '2023-10-30' },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                My Assigned Cases
            </Typography>

            <Paper sx={{ mt: 3 }}>
                <List>
                    {assignedCases.map((caseItem, index) => (
                        <React.Fragment key={caseItem.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                                        <AssignmentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {caseItem.title}
                                            </Typography>
                                            <Chip
                                                label={caseItem.priority}
                                                size="small"
                                                color={caseItem.priority === 'High' ? 'error' : caseItem.priority === 'Medium' ? 'warning' : 'default'}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" component="span" color="text.secondary">
                                            ID: {caseItem.id} — Status: {caseItem.status} — Date: {caseItem.date}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < assignedCases.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}
