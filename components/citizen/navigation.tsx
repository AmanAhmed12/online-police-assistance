import {
    Dashboard as DashboardIcon,
    AddCircleOutline as FileComplaintIcon,
    History as MyComplaintsIcon,
    Phone as EmergencyIcon,
    Person as ProfileIcon,
    Info as InfoIcon,
    Android as SmartToyIcon
} from "@mui/icons-material";

export const citizenNavigation = [
    { name: "Dashboard", href: "/citizen", icon: <DashboardIcon /> },
    { name: "File Complaint", href: "/citizen/complaint/new", icon: <FileComplaintIcon /> },
    { name: "My Complaints", href: "/citizen/complaints", icon: <MyComplaintsIcon /> },
    { name: "Emergency Contacts", href: "/citizen/emergency", icon: <EmergencyIcon /> },
    { name: "Chat With AI For LAW", href: "/citizen/chat", icon: <SmartToyIcon /> },
    { name: "Profile", href: "/citizen/profile", icon: <ProfileIcon /> },
    { name: "Guidelines", href: "/citizen/guidelines", icon: <InfoIcon /> },
];
