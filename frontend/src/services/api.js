const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getLeads = async (token) => {
    if (!token) {
        // throw new Error("No auth token found. Please login again.");
        window.location.href = "/login";
        // return [];
    }

    const res = await fetch(`${API_URL}/leads`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data && data.message || "Failed to fetch leads");
    }

    if (!Array.isArray(data)) {
        return [];
    }

    return data;
};