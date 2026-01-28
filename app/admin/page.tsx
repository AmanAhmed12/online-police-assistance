// import React from 'react';
// import { Typography, Box, Paper, Button } from '@mui/material';
// import Grid from '@mui/material/Grid';
// import StatCard from '@/components/admin/StatCard';
// import RecentActivityTable from '@/components/admin/RecentActivityTable';
// import GroupIcon from '@mui/icons-material/Group';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import WarningIcon from '@mui/icons-material/Warning';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import DownloadIcon from '@mui/icons-material/Download';

// export default function AdminDashboardPage() {
//     return (
//         <Box>
//             {/* Page Header */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
//                 <Box>
//                     <Typography variant="h4" fontWeight="bold" gutterBottom>
//                         Dashboard Overview
//                     </Typography>
//                     <Typography variant="body1" color="textSecondary">
//                         Welcome back, Admin. Here is what's happening today.
//                     </Typography>
//                 </Box>
//                 <Button
//                     variant="contained"
//                     startIcon={<DownloadIcon />}
//                     aria-label="Generate Report"
//                 >
//                     Generate Report
//                 </Button>
//             </Box>

//             {/* Stats Grid */}
//             <Grid container spacing={3} mb={4}>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                     <StatCard
//                         title="Total Users"
//                         value="12,345"
//                         trend="+12%"
//                         isPositive={true}
//                         icon={<GroupIcon />}
//                         color="#2866f2"
//                     />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                     <StatCard
//                         title="Active Complaints"
//                         value="423"
//                         trend="+5%"
//                         isPositive={false}
//                         icon={<WarningIcon />}
//                         color="#ff9100"
//                     />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                     <StatCard
//                         title="Cases Solved"
//                         value="2,891"
//                         trend="+18%"
//                         isPositive={true}
//                         icon={<CheckCircleIcon />}
//                         color="#00e676"
//                     />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                     <StatCard
//                         title="Pending Files"
//                         value="123"
//                         trend="-2%"
//                         isPositive={true}
//                         icon={<AssignmentIcon />}
//                         color="#651fff"
//                     />
//                 </Grid>
//             </Grid>

//             {/* Main Content Sections */}
//             <Grid container spacing={3}>
//                 {/* Recent Activity Table (Left/Main side) */}
//                 <Grid size={{ xs: 12, lg: 8 }}>
//                     <RecentActivityTable />
//                 </Grid>

//                 {/* Quick Actions / Mini Charts (Right side) - Placeholder for now */}
//                 <Grid size={{ xs: 12, lg: 4 }}>
//                     <Paper sx={{ p: 3, height: '100%' }}>
//                         <Typography variant="h6" fontWeight="bold" gutterBottom>
//                             Performance
//                         </Typography>

//                         {/* Dummy Chart Visual */}
//                         <Box sx={{ mt: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, gap: 1 }}>
//                             {[40, 70, 45, 90, 60, 80, 50].map((height, i) => (
//                                 <Box
//                                     key={i}
//                                     sx={{
//                                         width: '12%',
//                                         height: `${height}%`,
//                                         bgcolor: i === 3 ? 'primary.main' : 'rgba(40,102,242,0.2)',
//                                         borderRadius: '4px 4px 0 0',
//                                         transition: 'height 0.5s'
//                                     }}
//                                 />
//                             ))}
//                         </Box>
//                         <Typography variant="body2" align="center" color="textSecondary" mt={2}>
//                             Weekly Complaint Resolution
//                         </Typography>

//                         <Box mt={4}>
//                             <Typography variant="subtitle2" fontWeight={600} mb={1}>
//                                 System Health
//                             </Typography>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//                                 <Typography variant="caption">Server Load</Typography>
//                                 <Typography variant="caption" color="primary">24%</Typography>
//                             </Box>
//                             <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
//                                 <Box sx={{ width: '24%', height: '100%', bgcolor: 'primary.main', borderRadius: 10 }} />
//                             </Box>

//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, mt: 2 }}>
//                                 <Typography variant="caption">Database Storage</Typography>
//                                 <Typography variant="caption" color="warning.main">78%</Typography>
//                             </Box>
//                             <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
//                                 <Box sx={{ width: '78%', height: '100%', bgcolor: 'warning.main', borderRadius: 10 }} />
//                             </Box>
//                         </Box>
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// }
"use client";
import React, { useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import StatCard from '@/components/admin/StatCard';
import RecentActivityTable from '@/components/admin/RecentActivityTable';

import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import TimerIcon from '@mui/icons-material/Timer';

import { jsPDF } from 'jspdf';

const totalUsers = 12345;
const totalComplaints = 3314;
const solvedComplaints = 2891;
const activeComplaints = totalComplaints - solvedComplaints;
const totalOfficers = 35;
const activeCases = 423;
const lastWeekComplaints = 380;
const thisWeekComplaints = 423;
const emergencyResponseTimes = [4, 6, 5, 7, 3]; // minutes

const users = [
    { id: 1, name: "John Doe", role: "Officer", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Officer", status: "Inactive" },
    { id: 3, name: "Bob Johnson", role: "Admin", status: "Active" },
];

const complaints = [
    { id: 101, title: "Theft Complaint", status: "Pending", assignedTo: "John Doe" },
    { id: 102, title: "Assault Complaint", status: "Solved", assignedTo: "Jane Smith" },
    { id: 103, title: "Noise Complaint", status: "Pending", assignedTo: "Bob Johnson" },
];

const cases = [
    { id: 201, caseName: "Case A", status: "Open", officer: "John Doe" },
    { id: 202, caseName: "Case B", status: "Closed", officer: "Jane Smith" },
    { id: 203, caseName: "Case C", status: "Open", officer: "Bob Johnson" },
];

/* ---------------- MATHEMATICAL CALCULATIONS ---------------- */
// 1. Resolution Rate
const resolutionRate = ((solvedComplaints / totalComplaints) * 100).toFixed(1);

// 2. Case Load per Officer
const avgCaseLoad = (activeCases / totalOfficers).toFixed(1);

// 3. Weekly Growth Rate
const complaintGrowthRate = (
    ((thisWeekComplaints - lastWeekComplaints) / lastWeekComplaints) * 100
).toFixed(1);

// 4. Average Emergency Response Time
const avgResponseTime = (
    emergencyResponseTimes.reduce((a, b) => a + b, 0) / emergencyResponseTimes.length
).toFixed(1);

export default function AdminDashboardPage() {
    const [openModal, setOpenModal] = useState(false);
    const [reportType, setReportType] = useState("");

    const generatePDF = async () => {
        if (!reportType) {
            alert("Please select a report type");
            return;
        }

        const autoTable = (await import("jspdf-autotable")).default;
        const doc = new jsPDF();


        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 40, 'F');


        try {
            const logoImg = new Image();
            logoImg.src = '/policelogo.jpeg';


            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = reject;

                setTimeout(reject, 3000);
            });


            doc.addImage(logoImg, 'PNG', 15, 8, 24, 28); // x, y, width, height
        } catch (error) {
            console.error('Error loading logo:', error);

            doc.setFillColor(255, 255, 255);
            doc.circle(27.5, 20, 12, 'F');
            doc.setFillColor(41, 128, 185);
            doc.circle(27.5, 20, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('P', 24.5, 23);
        }


        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Online Police System', 45, 18);


        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(reportType, 45, 27);


        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const currentTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.setFontSize(9);
        doc.text(`Generated: ${currentDate} at ${currentTime}`, 45, 33);


        doc.setDrawColor(189, 195, 199);
        doc.setLineWidth(0.5);
        doc.line(14, 45, 196, 45);


        doc.setTextColor(0, 0, 0);



        let headers: string[] = [];
        let rows: any[] = [];

        if (reportType === "User Report") {
            headers = ["ID", "Name", "Role", "Status"];
            rows = users.map(u => [u.id, u.name, u.role, u.status]);
        } else if (reportType === "Complaints Report") {
            headers = ["ID", "Title", "Status", "Assigned To"];
            rows = complaints.map(c => [c.id, c.title, c.status, c.assignedTo]);
        } else if (reportType === "Cases Report") {
            headers = ["ID", "Case Name", "Status", "Officer"];
            rows = cases.map(c => [c.id, c.caseName, c.status, c.officer]);
        } else if (reportType === "Full Stats Report") {
            headers = ["Metric", "Value"];
            rows = [
                ["Total Users", totalUsers],
                ["Total Complaints", totalComplaints],
                ["Solved Complaints", solvedComplaints],
                ["Active Complaints", activeComplaints],
                ["Resolution Rate", `${resolutionRate}%`],
                ["Active Cases", activeCases],
                ["Average Case Load per Officer", avgCaseLoad],
                ["Complaint Growth Rate", `${complaintGrowthRate}%`],
                ["Average Emergency Response Time", `${avgResponseTime} min`],
            ];
        }


        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 52,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 4,
            },
            headStyles: {
                fillColor: [52, 73, 94], // Dark blue-gray header
                textColor: 255,
                fontSize: 11,
                fontStyle: 'bold',
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250], // Light gray for alternate rows
            },
            margin: { left: 14, right: 14 },
        });



        // Add footer to all pages
        const pageCount = doc.internal.pages.length - 1;
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);

            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );


            doc.text(
                'Online Police System - Confidential',
                14,
                doc.internal.pageSize.height - 10
            );
        }


        doc.save(`${reportType.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
        setOpenModal(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Page Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Dashboard Overview
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Welcome back, Admin. Here is what's happening today.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => setOpenModal(true)}
                    aria-label="Generate Report"
                >
                    Generate Report
                </Button>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Resolution Rate"
                        value={`${resolutionRate}%`}
                        trend="+2.3%"
                        isPositive
                        icon={<CheckCircleIcon />}
                        color="#00e676"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Active Complaints"
                        value={activeComplaints.toString()}
                        trend={`${complaintGrowthRate}%`}
                        isPositive={Number(complaintGrowthRate) < 0}
                        icon={<WarningIcon />}
                        color="#ff9100"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Avg Case Load"
                        value={`${avgCaseLoad}`}
                        trend="Cases / Officer"
                        isPositive
                        icon={<AssignmentIcon />}
                        color="#651fff"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Avg Response Time"
                        value={`${avgResponseTime} min`}
                        trend="Emergency Calls"
                        isPositive
                        icon={<TimerIcon />}
                        color="#2866f2"
                    />
                </Grid>
            </Grid>

            {/* Main Content Sections */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <RecentActivityTable />
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Performance
                        </Typography>

                        {/* Chart Visual */}
                        <Box
                            sx={{
                                mt: 4,
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                height: 200,
                                gap: 1
                            }}
                        >
                            {[40, 70, 45, 90, 60, 80, 50].map((height, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: '12%',
                                        height: `${height}%`,
                                        bgcolor: i === 3 ? 'primary.main' : 'rgba(40,102,242,0.2)',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.5s',
                                    }}
                                />
                            ))}
                        </Box>
                        <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2 }}>
                            Weekly Complaint Resolution
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                System Health
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption">Server Load</Typography>
                                <Typography variant="caption" color="primary">24%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 10 }}>
                                <Box sx={{ width: '24%', height: '100%', bgcolor: 'primary.main', borderRadius: 10 }} />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, mt: 2 }}>
                                <Typography variant="caption">Database Storage</Typography>
                                <Typography variant="caption" color="warning.main">78%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 10 }}>
                                <Box sx={{ width: '78%', height: '100%', bgcolor: 'warning.main', borderRadius: 10 }} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Report Selection Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Select Report to Generate</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Report Type</InputLabel>
                        <Select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            label="Report Type"
                        >
                            <MenuItem value="User Report">User Report</MenuItem>
                            <MenuItem value="Complaints Report">Complaints Report</MenuItem>
                            <MenuItem value="Cases Report">Cases Report</MenuItem>
                            <MenuItem value="Full Stats Report">Full Stats Report</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button variant="contained" onClick={generatePDF}>
                        Generate PDF
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}