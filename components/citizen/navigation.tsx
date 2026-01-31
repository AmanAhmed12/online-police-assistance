import {
    Dashboard as DashboardIcon,
    AddCircleOutline as FileComplaintIcon,
    History as MyComplaintsIcon,
    Phone as EmergencyIcon,
    Person as ProfileIcon,
    Info as InfoIcon,
    Android as SmartToyIcon,
    PostAdd as PostAddIcon
} from "@mui/icons-material";

export const citizenNavigation = [
    { name: "Dashboard", href: "/citizen", icon: <DashboardIcon /> },
    { name: "File Complaint", href: "/citizen/complaint/new", icon: <FileComplaintIcon /> },
    { name: "Request Report", href: "/citizen/report", icon: <PostAddIcon /> },
    { name: "My Complaints", href: "/citizen/complaints", icon: <MyComplaintsIcon /> },
    { name: "Emergency Contacts", href: "/citizen/emergency", icon: <EmergencyIcon /> },
    { name: "Chat With AI For LAW", href: "/citizen/chat", icon: <SmartToyIcon /> },
    { name: "Suspect Sketching", href: "/citizen/suspect-sketching", icon: <ProfileIcon /> },
    { name: "Guidelines", href: "/citizen/guidelines", icon: <InfoIcon /> },
];
