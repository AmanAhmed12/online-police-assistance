import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    EventNote as ScheduleIcon,
    ReportProblem as ReportIcon,
    Settings as SettingsIcon,
} from "@mui/icons-material";

export const officerNavigation = [
    { name: "Dashboard", href: "/officer", icon: <DashboardIcon /> },
    { name: "My Cases", href: "/officer/cases", icon: <AssignmentIcon /> },
    { name: "Reports", href: "/officer/reports", icon: <ReportIcon /> }, // Added Reports as per plan/common sense
    { name: "Settings", href: "/officer/settings", icon: <SettingsIcon /> },
];
