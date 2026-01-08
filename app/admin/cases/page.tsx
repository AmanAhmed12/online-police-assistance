import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function CasesPage() {
    const cases = [
        { id: 'C-2023-001', title: 'Robbery at Main St Bank', officer: 'Officer K.', status: 'Open' },
        { id: 'C-2023-002', title: 'Traffic Violation Audit', officer: 'Officer J.', status: 'Closed' },
        { id: 'C-2023-003', title: 'Cybercrime Investigation', officer: 'Officer M.', status: 'In Progress' },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                Case Files
            </Typography>
            <Paper sx={{ mt: 3 }}>
                <List>
                    {cases.map((caseItem, index) => (
                        <React.Fragment key={caseItem.id}>
                            <ListItem>
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
        </Box>
    );
}
