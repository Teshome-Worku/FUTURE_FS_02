const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isValidToken = (token) => {
    if (typeof token !== "string") {
        return false;
    }

    const normalized = token.trim();
    return normalized !== "" && normalized !== "undefined" && normalized !== "null";
};

export const getLeads = async (token) => {
    if (!isValidToken(token)) {
        throw new Error("No auth token found. Please login again.");
    }

    const normalizedToken = token.trim();

    const res = await fetch(`${API_URL}/leads`, {
        headers: {
            Authorization: `Bearer ${normalizedToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error((data && data.message) || "Failed to fetch leads");
    }

    if (!Array.isArray(data)) {
        return [];
    }

    return data;
};

export const deleteLead = async (id, token) => {
    if (!isValidToken(token)) {
        throw new Error("No auth token found. Please login again.");
    }

    const normalizedToken = token.trim();

    const res = await fetch(`${API_URL}/leads/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${normalizedToken}`,
        },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data && data.message) || "Failed to delete lead");
    }
};

export const createLead = async (leadData, token) => {
    if (!isValidToken(token)) {
        throw new Error("No auth token found. Please login again.");
    }

    const normalizedToken = token.trim();

    const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${normalizedToken}`,
        },
        body: JSON.stringify(leadData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error((data && data.message) || "Failed to create lead");
    }

    return data;
};

//get user
export const getMe = async (token) => {
    if (!isValidToken(token)) {
        throw new Error("No auth token found. Please login again.");
    }
    const normalizedToken = token.trim();
    const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${normalizedToken}`,
        },
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error((data && data.message) || "Failed to fetch user");
    }
    return data;
};

//update profile
export const updateProfile = async (profileData, token) => {
    if (!isValidToken(token)) {
        throw new Error("No auth token found. Please login again.");
    }
    const normalizedToken = token.trim();
    const res = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${normalizedToken}`,
        },
        body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error((data && data.message) || "Failed to update profile");
    }
    return data;
};

//change password
export const changePassword = async (passwordData, token) => {
    if (!isValidToken(token)) {
        throw new Error("No auth token found. Please login again.");
    }
    const normalizedToken = token.trim();
    const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${normalizedToken}`,
        },
        body: JSON.stringify(passwordData),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error((data && data.message) || "Failed to change password");
    }
    return data;
};