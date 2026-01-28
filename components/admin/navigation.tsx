import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ReportProblem as ReportIcon,
    Settings as SettingsIcon,
    Assignment as AssignmentIcon,
    Gavel as GavelIcon,
    ContactPhone as ContactPhoneIcon
} from "@mui/icons-material";

export const adminNavigation = [
    { name: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
    { name: "Active Users", href: "/admin/users", icon: <PeopleIcon /> },
    { name: "Complaints", href: "/admin/complaints", icon: <ReportIcon /> },
    { name: "Case Files", href: "/admin/cases", icon: <AssignmentIcon /> },
    { name: "Suspect Details", href: "/admin/suspect-details", icon: <GavelIcon /> },
    { name: "Emergency Contacts", href: "/admin/emergency-contacts", icon: <ContactPhoneIcon /> },
    { name: "Settings", href: "/admin/settings", icon: <SettingsIcon /> },
];
