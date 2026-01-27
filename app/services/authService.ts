const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const loginUser = async (credentials: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "*/*"
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};


export const registerUser = async (userData: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Registration failed");
        }
        return true; // Or return response data if needed
    } catch (error) {
        throw error;
    }
};
const getAuthHeader = (token?: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

// Fetch users
export const getUsers = async (token?: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            headers: getAuthHeader(token),
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

// Update user
export const updateUser = async (id: number, userData: any, token?: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: "PUT",
            headers: getAuthHeader(token),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Update failed");
        }

        return true;
    } catch (error) {
        throw error;
    }
};

// Delete user
export const deleteUser = async (id: number, token?: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
        return true;
    } catch (error) {
        throw error;
    }
};
export const logoutUser = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Logout failed:", data.message);
        }
        // Clear local storage regardless of backend response
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return data;
    } catch (error) {
        console.error("Logout error:", error);
        // Even if backend logout fails, clear frontend state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
    }
};
