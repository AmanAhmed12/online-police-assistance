const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Standardizing the headers with your existing helper logic
const getAuthHeader = (token?: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const suspectService = {
    // GET all suspects
    getAllSuspects: async (token?: string) => {
        const response = await fetch(`${API_BASE_URL}/api/suspects`, {
            headers: getAuthHeader(token),
        });
        if (!response.ok) throw new Error("Failed to fetch suspects");
        return await response.json();
    },

    // POST a new suspect
    createSuspect: async (data: any, token?: string) => {
        const response = await fetch(`${API_BASE_URL}/api/suspects`, {
            method: "POST",
            headers: getAuthHeader(token),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to register suspect");
        return await response.json();
    },

    // PUT (Update) an existing suspect
    updateSuspect: async (id: number, data: any, token?: string) => {
        const response = await fetch(`${API_BASE_URL}/api/suspects/${id}`, {
            method: "PUT",
            headers: getAuthHeader(token),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update suspect");
        return await response.json();
    },

    // DELETE a suspect
    deleteSuspect: async (id: number, token?: string) => {
        const response = await fetch(`${API_BASE_URL}/api/suspects/${id}`, {
            method: "DELETE",
            headers: getAuthHeader(token),
        });
        if (!response.ok) throw new Error("Failed to delete suspect");
        return true;
    }
};