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