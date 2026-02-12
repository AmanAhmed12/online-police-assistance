import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ReportProblem as ReportIcon,
    Settings as SettingsIcon,
    Assignment as AssignmentIcon,
    Gavel as GavelIcon,
    ContactPhone as ContactPhoneIcon,
    Campaign as CampaignIcon,
    MenuBook as GuidelineIcon,
    Receipt as ReceiptIcon,
    Warning
} from "@mui/icons-material";

export const adminNavigation = [
    { name: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
    { name: "Active Users", href: "/admin/users", icon: <PeopleIcon /> },
    { name: "Complaints", href: "/admin/complaints", icon: <ReportIcon /> },
    { name: "Case Files", href: "/admin/cases", icon: <AssignmentIcon /> },
    { name: "Suspect Details", href: "/admin/suspect-details", icon: <GavelIcon /> },
    { name: "Emergency Contacts", href: "/admin/emergency-contacts", icon: <ContactPhoneIcon /> },
    { name: "Notices", href: "/admin/notices", icon: <CampaignIcon /> },
    { name: "Guidelines", href: "/admin/guidelines", icon: <GuidelineIcon /> },
    { name: "Fine Management", href: "/admin/fines", icon: <ReceiptIcon /> },
    { name: "Manage Violations", href: "/admin/violations", icon: <Warning /> },
];
