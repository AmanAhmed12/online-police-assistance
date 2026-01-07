import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Box,
    Avatar
} from '@mui/material';

// Dummy data types
interface Activity {
    id: string;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    action: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
}

const rows: Activity[] = [
    { id: '1', user: { name: 'Rahul Sharma', email: 'rahul.s@example.com' }, action: 'Submitted new complaint', status: 'pending', date: '2 min ago' },
    { id: '2', user: { name: 'Priya Patel', email: 'priya.p@example.com' }, action: 'Updated profile details', status: 'completed', date: '15 min ago' },
    { id: '3', user: { name: 'Amit Singh', email: 'amit.singh@example.com' }, action: 'Filed FIR Request', status: 'pending', date: '32 min ago' },
    { id: '4', user: { name: 'Sneha Gupta', email: 'sneha.g@example.com' }, action: 'Password reset', status: 'completed', date: '1 hour ago' },
    { id: '5', user: { name: 'Vikram Malhotra', email: 'vikram.m@example.com' }, action: 'Document verification failed', status: 'failed', date: '2 hours ago' },
];

export default function RecentActivityTable() {
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
            </Typography>
            <TableContainer sx={{ mt: 2 }}>
                <Table aria-label="recent activity table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>User</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Action</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: '0.9rem' }}>
                                            {row.user.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {row.user.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {row.user.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{row.action}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.status}
                                        size="small"
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: 600,
                                            bgcolor: row.status === 'completed' ? 'rgba(0, 230, 118, 0.1)' :
                                                row.status === 'pending' ? 'rgba(255, 179, 0, 0.1)' :
                                                    'rgba(255, 23, 68, 0.1)',
                                            color: row.status === 'completed' ? '#00e676' :
                                                row.status === 'pending' ? '#ffb300' :
                                                    '#ff1744'
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ color: 'text.secondary' }}>{row.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
