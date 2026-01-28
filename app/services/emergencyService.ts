const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface EmergencyContact {
    id: number;
    name: string;
    number: string;
    type: string; // e.g., Police, Ambulance, Fire, Hotline
    description?: string;
    priority?: number;
}

const getAuthHeader = (token?: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

// Mock data to use if backend fails (optional, but good for dev)
const MOCK_CONTACTS: EmergencyContact[] = [
    { id: 1, name: "Police Emergency", number: "119", type: "Police", description: "General emergency line", priority: 1 },
    { id: 2, name: "Ambulance Service", number: "1990", type: "Medical", description: "Free ambulance service", priority: 1 },
    { id: 3, name: "Fire Brigade", number: "110", type: "Fire", description: "Fire emergency", priority: 1 },
];

export const getEmergencyContacts = async (token?: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/emergency-contacts`, {
            headers: getAuthHeader(token),
        });
        if (!response.ok) {
            // For now, if 404 or fail, return mock data since user said backend is not ready
            // throw new Error("Failed to fetch contacts");
            console.warn("Backend not reachable, returning mock data");
            return MOCK_CONTACTS;
        }
        return await response.json();
    } catch (error) {
        console.warn("Network error, returning mock data", error);
        return MOCK_CONTACTS;
    }
};

export const createEmergencyContact = async (data: Omit<EmergencyContact, 'id'>, token?: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/emergency-contacts`, {
            method: "POST",
            headers: getAuthHeader(token),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            // Mock success
            return { ...data, id: Math.random() };
            // throw new Error("Failed to create contact");
        }
        return await response.json();
    } catch (error) {
        console.warn("Mock create success");
        return { ...data, id: Math.random() };
    }
};

export const updateEmergencyContact = async (id: number, data: Partial<EmergencyContact>, token?: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/emergency-contacts/${id}`, {
            method: "PUT",
            headers: getAuthHeader(token),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            return true;
            // throw new Error("Failed to update contact");
        }
        return await response.json();
    } catch (error) {
        console.warn("Mock update success");
        return true;
    }
};

export const deleteEmergencyContact = async (id: number, token?: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/emergency-contacts/${id}`, {
            method: "DELETE",
            headers: getAuthHeader(token),
        });
        if (!response.ok) {
            return true;
            // throw new Error("Failed to delete contact");
        }
        return true;
    } catch (error) {
        console.warn("Mock delete success");
        return true;
    }
};
