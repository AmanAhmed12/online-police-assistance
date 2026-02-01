"use client";

import React, { useState } from 'react';
import {
    Typography, Box, Container, Paper, TextField, Button, Grid,
    Card, CardContent, Chip, CircularProgress, Divider,
    FormControl, InputLabel, Select, MenuItem, InputAdornment,
    IconButton, Tooltip, Stepper, Step, StepLabel,
    FormControlLabel, RadioGroup, Radio, FormLabel, Fade, LinearProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    PersonSearch as PersonSearchIcon,
    LocationOn as LocationIcon,
    Fingerprint as FingerprintIcon,
    History as HistoryIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    HelpOutline as HelpIcon,
    Gavel as GavelIcon,
    Security as SecurityIcon,
    FilePresent as FileIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { matchSuspects, SuspectMatchRequest, SuspectMatchResponse } from '@/app/services/suspectService';
import ForensicSketch from '@/components/ForensicSketch';

// AI Sketch labels and branding are handled within the ForensicSketch component and Dossier layout.

const scannerKeyframes = {
    "@keyframes scan": {
        "0%": { top: "0%" },
        "100%": { top: "100%" }
    }
};

const VERIFICATION_QUESTIONS = [
    { id: 'Scar', label: 'Does the suspect have any visible scars?', type: 'boolean' },
    { id: 'Tattoo', label: 'Does the suspect have any visible tattoos?', type: 'boolean' },
    { id: 'Beard', label: 'Does the suspect have a beard?', type: 'boolean' },
    { id: 'Moustache', label: 'Does the suspect have a moustache?', type: 'boolean' },
    { id: 'Limping Walk', label: 'Does the suspect have a limping walk?', type: 'boolean' },
    { id: 'Burn Marks', label: 'Does the suspect have any burn marks?', type: 'boolean' },
    { id: 'Missing Finger', label: 'Is the suspect missing any fingers?', type: 'boolean' },
    { id: 'Wears Glasses', label: 'Does the suspect wear glasses?', type: 'boolean' }
];

const textFieldSx = {
    "& .MuiInputBase-input": { color: "#f5f7ff" },
    "& .MuiInputLabel-root": { color: "#a0a4b7" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
        "&:hover fieldset": { borderColor: "#2866f2" },
        "&.Mui-focused fieldset": { borderColor: "#2866f2" }
    }
};

export default function SuspectDetailsPage() {
    const token = useSelector((state: RootState) => state.auth.user?.token);
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SuspectMatchResponse[]>([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // Form State
    const [gender, setGender] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [location, setLocation] = useState('');
    const [crime, setCrime] = useState('Theft');
    const [description, setDescription] = useState('');
    const [signs, setSigns] = useState<string[]>([]);
    const [newSign, setNewSign] = useState('');

    // Verification Answers
    const [verificationAnswers, setVerificationAnswers] = useState<Record<string, boolean>>({
        'Scar': false, 'Tattoo': false, 'Beard': false, 'Moustache': false,
        'Limping Walk': false, 'Burn Marks': false, 'Missing Finger': false, 'Wears Glasses': false
    });

    const handleAddSign = () => {
        if (newSign.trim()) {
            setSigns([...signs, newSign.trim()]);
            setNewSign('');
        }
    };

    const handleRemoveSign = (index: number) => {
        setSigns(signs.filter((_, i) => i !== index));
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSearch = async () => {
        setLoading(true);
        // Artificial delay for "Professional Scanning" feel
        await new Promise(resolve => setTimeout(resolve, 2500));

        try {
            const combinedSigns = [...signs];
            Object.entries(verificationAnswers).forEach(([mark, isPresent]) => {
                if (isPresent) combinedSigns.push(mark);
            });

            const request: SuspectMatchRequest = {
                gender,
                age: age === '' ? 0 : Number(age),
                lastSeenLocation: location,
                crime,
                description,
                signs: combinedSigns
            };

            const data = await matchSuspects(request, token);
            setResults(data);
            setSearchPerformed(true);
            setActiveStep(2);
        } catch (error) {
            console.error("Search failed", error);
            alert("Database Error: Failed to secure connection to Central Registry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header Section */}
            <Box textAlign="center" mb={6}>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 4 }}>
                    OFFICIAL INVESTIGATIVE PROTOCOL
                </Typography>
                <Typography variant="h3" fontWeight="900" gutterBottom color="#f5f7ff">
                    Suspect Match System
                </Typography>
                <Typography variant="body1" color="#a0a4b7" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
                    Access restricted to authorized personnel. Any misuse of this data is subject to legal action under Department regulations.
                </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 8, px: { md: 10 }, "& .MuiStepLabel-label": { color: '#a0a4b7' }, "& .MuiStepIcon-root": { color: '#1f2433', "&.Mui-active": { color: '#2866f2' }, "&.Mui-completed": { color: '#2866f2' } } }}>
                <Step><StepLabel><Typography variant="caption" fontWeight="bold">INITIAL LOG</Typography></StepLabel></Step>
                <Step><StepLabel><Typography variant="caption" fontWeight="bold">VERIFICATION</Typography></StepLabel></Step>
                <Step><StepLabel><Typography variant="caption" fontWeight="bold">DOSSIER REVEAL</Typography></StepLabel></Step>
            </Stepper>

            {/* Scanning Logic Overlay */}
            {loading && (
                <Fade in={loading}>
                    <Box
                        sx={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            bgcolor: 'rgba(10, 25, 41, 0.98)', zIndex: 9999,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            color: 'white', overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ position: 'relative', width: 300, height: 400, border: '2px solid #2866f2', mb: 4, ...scannerKeyframes }}>
                            <Box
                                sx={{
                                    position: 'absolute', width: '100%', height: '4px', bgcolor: '#00e5ff',
                                    boxShadow: '0 0 20px #00e5ff', animation: 'scan 2s infinite alternate ease-in-out'
                                }}
                            />
                            <FingerprintIcon sx={{ fontSize: 100, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#2866f2', opacity: 0.3 }} />
                        </Box>
                        <Typography variant="h6" sx={{ letterSpacing: 6, mb: 1, color: '#00e5ff' }}>SCANNING CENTRAL REGISTRY...</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 2 }}>CROSS-REFERENCING PHYSICAL DESCRIPTORS</Typography>
                        <Box sx={{ width: 300, mt: 3, "& .MuiLinearProgress-bar": { bgcolor: '#00e5ff' } }}><LinearProgress /></Box>
                    </Box>
                </Fade>
            )}

            <Grid container spacing={4} justifyContent="center">
                {activeStep === 0 && (
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 5, borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', bgcolor: '#1f2433' }}>
                            <Box display="flex" alignItems="center" mb={4}>
                                <SecurityIcon sx={{ mr: 2, color: '#2866f2' }} />
                                <Typography variant="h5" fontWeight="bold" color="#f5f7ff">Step 1: Incident Descriptors</Typography>
                            </Box>

                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth sx={{ ...textFieldSx }}>
                                        <InputLabel sx={{ color: '#a0a4b7' }}>Biological Gender</InputLabel>
                                        <Select value={gender} label="Biological Gender" onChange={(e) => setGender(e.target.value)} required sx={{ color: '#f5f7ff' }}>
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Estimated Age" type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} required sx={{ ...textFieldSx }} />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth sx={{ ...textFieldSx }}>
                                        <InputLabel sx={{ color: '#a0a4b7' }}>Crime Category</InputLabel>
                                        <Select
                                            value={crime}
                                            label="Crime Category"
                                            onChange={(e) => setCrime(e.target.value)}
                                            sx={{ color: '#f5f7ff' }}
                                        >
                                            <MenuItem value="Theft">Theft</MenuItem>
                                            <MenuItem value="Robbery">Robbery</MenuItem>
                                            <MenuItem value="Assault">Assault</MenuItem>
                                            <MenuItem value="Fraud">Fraud</MenuItem>
                                            <MenuItem value="Vandalism">Vandalism</MenuItem>
                                            <MenuItem value="Drugs">Drugs</MenuItem>
                                            <MenuItem value="Kidnapping">Kidnapping</MenuItem>
                                            <MenuItem value="Cybercrime">Cybercrime</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <TextField fullWidth label="Last Identified Location" placeholder="Area, street name, or landmark" value={location} onChange={(e) => setLocation(e.target.value)} sx={{ ...textFieldSx }} />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField fullWidth multiline rows={4} label="Detailed Physical Description" placeholder="Describe height, build, clothing, hair, etc." value={description} onChange={(e) => setDescription(e.target.value)} sx={{ ...textFieldSx }} />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" color="#a0a4b7" mb={2}>Identifying Mark Registry (Initial Entry)</Typography>
                                    <Box display="flex" gap={1} mb={2}>
                                        <TextField fullWidth size="small" placeholder="Enter special mark..." value={newSign} onChange={(e) => setNewSign(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSign())} sx={{ ...textFieldSx }} />
                                        <Button variant="contained" onClick={handleAddSign} sx={{ minWidth: 60, bgcolor: '#2866f2' }}><AddIcon /></Button>
                                    </Box>
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                        {signs.map((sign, index) => (
                                            <Chip key={index} label={sign} onDelete={() => handleRemoveSign(index)} sx={{ color: '#f5f7ff', borderColor: '#2866f2' }} variant="outlined" />
                                        ))}
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12 }} sx={{ mt: 3, textAlign: 'right' }}>
                                    <Button variant="contained" size="large" onClick={handleNext} disabled={!gender || age === ''} sx={{ px: 6, borderRadius: 2, height: 50, bgcolor: '#2866f2' }}>
                                        Commence Verification
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {activeStep === 1 && (
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 5, borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', bgcolor: '#1f2433' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <HelpIcon sx={{ mr: 2, color: '#2866f2' }} />
                                <Typography variant="h5" fontWeight="bold" color="#f5f7ff">Step 2: Verification Protocol</Typography>
                            </Box>
                            <Typography variant="body2" color="#a0a4b7" mb={4}>
                                Answer the following identifying mark queries to establish a verified connection in the central database.
                            </Typography>

                            <Grid container spacing={3}>
                                {VERIFICATION_QUESTIONS.map((q) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={q.id}>
                                        <Card variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}>
                                            <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#a0a4b7', mb: 1 }}>{q.label}</FormLabel>
                                            <RadioGroup row value={verificationAnswers[q.id]} onChange={(e) => setVerificationAnswers(prev => ({ ...prev, [q.id]: e.target.value === 'true' }))}>
                                                <FormControlLabel value={true} control={<Radio size="small" sx={{ color: '#2866f2' }} />} label={<Typography variant="caption" color="#f5f7ff">Yes</Typography>} />
                                                <FormControlLabel value={false} control={<Radio size="small" sx={{ color: '#2866f2' }} />} label={<Typography variant="caption" color="#f5f7ff">No</Typography>} />
                                            </RadioGroup>
                                        </Card>
                                    </Grid>
                                ))}

                                <Grid size={{ xs: 12 }} sx={{ mt: 5 }}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Button variant="text" size="large" onClick={handleBack} sx={{ color: '#a0a4b7' }}>Back to Initial Log</Button>
                                        <Button variant="contained" size="large" onClick={handleSearch} sx={{ px: 6, borderRadius: 2, height: 50, bgcolor: '#2866f2' }}>
                                            Verify & Cross-Reference
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {activeStep === 2 && (
                    <Grid size={{ xs: 12 }}>
                        <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-end">
                            <Box>
                                <Typography variant="h4" fontWeight="900" color="#f5f7ff">
                                    {results.length > 1 ? 'Evidence Lineup' : 'Digital Dossier Portal'}
                                </Typography>
                                <Typography variant="caption" color="#a0a4b7" sx={{ letterSpacing: 2 }}>
                                    {results.length > 1
                                        ? `MULTIPLE SUBJECTS IDENTIFIED (${results.length}) - COMMENCING COMPARISON`
                                        : 'DATABASE SCAN COMPLETE: INTEGRITY VERIFIED'}
                                </Typography>
                            </Box>
                            <Button variant="outlined" size="small" startIcon={<HistoryIcon />} onClick={() => setActiveStep(0)} sx={{ color: '#a0a4b7', borderColor: 'rgba(255,255,255,0.1)' }}>Reset Investigation</Button>
                        </Box>

                        {results.length === 0 ? (
                            <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '1px dashed #ef5350', bgcolor: 'rgba(239, 83, 80, 0.05)' }}>
                                <GavelIcon sx={{ fontSize: 80, color: '#ef5350', mb: 3 }} />
                                <Typography variant="h5" fontWeight="bold" gutterBottom color="#f5f7ff">Negative Verification Result</Typography>
                                <Typography variant="body1" color="#a0a4b7" sx={{ maxWidth: 500, mx: 'auto', opacity: 0.8 }}>
                                    The provided data does not meet the 95% threshold for official identification. Please refine your inputs or contact local authorities for a manual search.
                                </Typography>
                            </Paper>
                        ) : (
                            <Grid container spacing={6}>
                                {results.map((suspect) => (
                                    <Grid size={{ xs: 12 }} key={suspect.id}>
                                        <Card sx={{
                                            display: 'flex', flexDirection: { xs: 'column', lg: 'row' },
                                            borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(40, 102, 242, 0.3)',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)', position: 'relative',
                                            bgcolor: '#131722', transition: 'all 0.3s ease',
                                            '&:hover': { border: '1px solid #2866f2', transform: 'translateY(-5px)' }
                                        }}>
                                            {/* Confidential Watermark */}
                                            <Box sx={{
                                                position: 'absolute', top: -40, right: 100, fontSize: '15rem',
                                                fontWeight: '900', color: 'rgba(255,255,255,0.02)', transform: 'rotate(-15deg)', pointerEvents: 'none', zIndex: 0
                                            }}>
                                                CONFIDENTIAL
                                            </Box>

                                            {/* Dossier Image Section */}
                                            <Box sx={{ width: { xs: '100%', lg: 400 }, height: { xs: 400, lg: 550 }, position: 'relative' }}>
                                                <ForensicSketch imageUrl={suspect.image} />

                                                <Box sx={{ position: 'absolute', top: 30, left: -5, bgcolor: '#000', color: 'white', px: 3, py: 1, transform: 'rotate(-5deg)', fontWeight: 800, boxShadow: 10, letterSpacing: 2, border: '2px solid white', zIndex: 5 }}>
                                                    AI VERIFIED
                                                </Box>

                                                <Box sx={{ position: 'absolute', top: 30, right: 30, zIndex: 12 }}>
                                                    <Chip icon={<AutoFixHighIcon style={{ color: '#fff' }} />} label="GEMINI AI POWERED" size="small" sx={{ bgcolor: 'rgba(40, 102, 242, 0.9)', color: '#fff', fontWeight: 900, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }} />
                                                </Box>

                                                <Box sx={{ position: 'absolute', bottom: 30, right: 30, textAlign: 'right', zIndex: 12 }}>
                                                    <Typography variant="overline" color="white" sx={{ opacity: 0.6, fontWeight: 700 }}>CONFIDENCE RATING</Typography>
                                                    <Typography variant="h3" color="#00e5ff" fontWeight="900" sx={{ mt: -1, textShadow: '0 0 10px rgba(0,229,255,0.5)' }}>{Math.round(suspect.matchPercentage)}%</Typography>
                                                </Box>
                                            </Box>

                                            {/* Dossier Data Section */}
                                            <CardContent sx={{ flex: 1, p: 6, position: 'relative', zIndex: 1 }}>
                                                <Box display="flex" justifyContent="space-between" mb={4} alignItems="flex-start">
                                                    <Box>
                                                        <Typography variant="overline" color="#2866f2" sx={{ fontWeight: 800, letterSpacing: 2 }}>DIGITAL CASE FILE #SUS-{suspect.id}</Typography>
                                                        <Typography variant="h3" fontWeight="900" color="#f5f7ff">IDENTIFIED SUBJECT</Typography>
                                                    </Box>
                                                    <Chip icon={<SecurityIcon sx={{ color: 'white !important' }} />} label="VERIFIED MATCH" sx={{ borderRadius: 1, fontWeight: 900, px: 1, bgcolor: '#2866f2', color: 'white' }} />
                                                </Box>

                                                <Divider sx={{ mb: 4, opacity: 0.1, bgcolor: 'rgba(255,255,255,0.1)' }} />

                                                <Grid container spacing={3}>
                                                    <Grid size={{ xs: 12, sm: 4 }}>
                                                        <Typography variant="caption" color="#a0a4b7" sx={{ fontWeight: 700 }}>NAME / ALIAS</Typography>
                                                        <Typography variant="h6" fontWeight="bold" color="#f5f7ff">CONFIDENTIAL IDENTITY</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 4 }}>
                                                        <Typography variant="caption" color="#a0a4b7" sx={{ fontWeight: 700 }}>AGE GROUP</Typography>
                                                        <Typography variant="h6" fontWeight="bold" color="#f5f7ff">~{suspect.age} YEARS</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 4 }}>
                                                        <Typography variant="caption" color="#a0a4b7" sx={{ fontWeight: 700 }}>BIOLOGICAL GENDER</Typography>
                                                        <Typography variant="h6" fontWeight="bold" color="#f5f7ff">{suspect.gender.toUpperCase()}</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12 }}>
                                                        <Typography variant="caption" color="#a0a4b7" sx={{ fontWeight: 700 }}>LAST REPORTED OPERATING AREA</Typography>
                                                        <Typography variant="h6" fontWeight="bold" color="#ef5350">{suspect.lastSeenLocation.toUpperCase()}</Typography>
                                                    </Grid>
                                                </Grid>

                                                <Box mt={6} sx={{ bgcolor: 'rgba(40,102,242,0.05)', p: 3, borderRadius: 2, borderLeft: '4px solid #2866f2' }}>
                                                    <Typography variant="subtitle2" fontWeight="bold" color="#2866f2" gutterBottom>INVESTIGATIVE REMARKS</Typography>
                                                    <Typography variant="body2" color="#a0a4b7" sx={{ fontStyle: 'italic', opacity: 0.9 }}>
                                                        System automated profile match based on physical descriptors and verified investigative signs ({suspect.signs.join(', ')}).
                                                        Subject is verified as a potential match for the described criminal activity.
                                                    </Typography>
                                                </Box>

                                                <Box display="flex" gap={2} mt={6}>
                                                    <Button variant="contained" fullWidth startIcon={<PrintIcon />} sx={{ height: 50, borderRadius: 2, bgcolor: '#2866f2' }}>Export Dossier PDF</Button>
                                                    <Button variant="outlined" fullWidth startIcon={<FileIcon />} sx={{ height: 50, borderRadius: 2, borderColor: 'rgba(255,255,255,0.1)', color: '#f5f7ff' }}>File Incident Report</Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>

            {/* Legal Disclaimer Footer */}
            <Box mt={15} pt={6} borderTop="1px solid rgba(255,255,255,0.05)" textAlign="center">
                <Grid container spacing={4} justifyContent="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="caption" color="#a0a4b7" paragraph sx={{ opacity: 0.6 }}>
                            <strong>LEGAL NOTICE:</strong> The information provided in this Digital Dossier is generated via computerized forensic recognition algorithms. Accuracy is subject to data integrity and initial reporting quality. Unauthorized distribution of this data is a punishable offense under Digital Privacy Laws and Departmental Policy.
                        </Typography>
                        <Typography variant="caption" color="#a0a4b7" display="block" sx={{ fontWeight: 700, letterSpacing: 2, opacity: 0.4 }}>
                            POLICE ASSIST SYSTEM | INVESTIGATIVE PROTOCOL V4.2 | © 2026 DEPARTMENT OF PUBLIC SAFETY
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
