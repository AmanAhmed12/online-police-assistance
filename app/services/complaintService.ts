const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface Complaint {
    id: number;
    title: string;
    category: string;
    description: string;
    incidentDate: string;
    location: string;
    status: string; // Pending, In Investigation, Resolved, Closed
    citizenId?: number;
    evidenceFiles?: string[]; // URLs or placeholders
    createdAt: string;
}

const getAuthHeader = (token?: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});



export const createComplaint = async (data: any, token?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: "POST",
        headers: getAuthHeader(token),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to submit complaint");
    }
    return await response.json();
};

export const getMyComplaints = async (token?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/complaints/my`, {
        headers: getAuthHeader(token),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch complaints");
    }
    return await response.json();
};
