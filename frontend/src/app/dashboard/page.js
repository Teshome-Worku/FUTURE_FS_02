"use client";

import { useEffect, useState } from "react";
import { getLeads } from "@/services/api";

const isValidToken = (token) => {
  if (typeof token !== "string") {
    return false;
  }

  const normalized = token.trim();
  return normalized !== "" && normalized !== "undefined" && normalized !== "null";
};

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem("token");

      if (!isValidToken(token)) {
        localStorage.removeItem("token");
        window.location.replace("/login");
        return;
      }

      try {
        const data = await getLeads(token);
        setLeads(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.message === "No auth token found. Please login again.") {
          localStorage.removeItem("token");
          window.location.replace("/login");
          return;
        }

        setError(err.message || "Unable to load leads");
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Leads</h1>

      {loading && <p>Loading leads...</p>}
      {!loading && error && <p className="text-red-500">{error}</p>}
      {!loading && !error && leads.length === 0 && <p>No leads found.</p>}

      {leads.map((lead) => (
        <div key={lead._id} className="border p-4 mb-3">
          <h2>{lead.name}</h2>
          <p>{lead.email}</p>
          <p>Status: {lead.status}</p>
        </div>
      ))}
    </div>
  );
}