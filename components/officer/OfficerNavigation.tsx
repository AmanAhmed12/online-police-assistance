import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    EventNote as ScheduleIcon,
    Campaign as CampaignIcon,
    ReportProblem as ReportIcon,
    Settings as SettingsIcon,
    Receipt as ReceiptIcon,
} from "@mui/icons-material";

export const officerNavigation = [
    { name: "Dashboard", href: "/officer", icon: <DashboardIcon /> },
    { name: "My Cases", href: "/officer/cases", icon: <AssignmentIcon /> },
    { name: "Reports", href: "/officer/reports", icon: <ReportIcon /> },
    { name: "Issue Fine", href: "/officer/fines", icon: <ReceiptIcon /> },
    { name: "Notices", href: "/officer/notices", icon: <CampaignIcon /> },
    { name: "Settings", href: "/officer/settings", icon: <SettingsIcon /> },
];
