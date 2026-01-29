const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface Notice {
    id: number;
    title: string;
    content: string;
    date: string;
    category: 'General' | 'Urgent' | 'Event';
}

async function apiRequest<T>(
    endpoint: string,
    method: string,
    token?: string,
    body?: any
): Promise<T> {
    if (!token) {
        if (method === "GET") return [] as unknown as T;
        throw new Error("AUTH_REQUIRED");
    }

    const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        if (response.status === 403 || response.status === 401) throw new Error("SESSION_EXPIRED");
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.status === 204 ? ({} as T) : response.json();
}

export const getNotices = async (token?: string) =>
    apiRequest<Notice[]>("/api/notices", "GET", token);

export const createNotice = async (data: Omit<Notice, 'id' | 'date'>, token?: string) =>
    apiRequest<Notice>("/api/notices", "POST", token, data);

export const updateNotice = async (id: number, data: Partial<Notice>, token?: string) =>
    apiRequest<Notice>(`/api/notices/${id}`, "PUT", token, data);

export const deleteNotice = async (id: number, token?: string) =>
    apiRequest<void>(`/api/notices/${id}`, "DELETE", token);