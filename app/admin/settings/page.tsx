import React from 'react';
import { Typography, Box, Paper, TextField, Button, Switch, FormControlLabel, Divider } from '@mui/material';

export default function SettingsPage() {
    return (
        <Box maxWidth="md">
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                Settings
            </Typography>

            <Paper sx={{ p: 4, mt: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                    General Settings
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        label="Admin Email"
                        defaultValue="admin@police.gov.in"
                        variant="outlined"
                        margin="normal"
                    />
                    <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Enable Email Notifications"
                        sx={{ mt: 2 }}
                    />

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" gutterBottom fontWeight={600}>
                        Security
                    </Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 1 }}>
                        Change Password
                    </Button>
                    <Box mt={2}>
                        <Button variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
