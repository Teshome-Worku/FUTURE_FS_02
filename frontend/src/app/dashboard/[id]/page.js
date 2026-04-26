"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getLeads } from "@/services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isValidToken = (token) => {
  if (typeof token !== "string") {
    return false;
  }

  const normalized = token.trim();
  return normalized !== "" && normalized !== "undefined" && normalized !== "null";
};

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params?.id;
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState("");

  useEffect(() => {
    const fetchLead = async () => {
      const token = localStorage.getItem("token");

      if (!isValidToken(token)) {
        localStorage.removeItem("token");
        window.location.replace("/login");
        return;
      }

      try {
        const data = await getLeads(token);
        const selectedLead = data.find((item) => item._id === leadId);

        if (!selectedLead) {
          setError("Lead not found.");
          setLead(null);
          return;
        }

        setLead(selectedLead);
      } catch (err) {
        if (err.message === "No auth token found. Please login again.") {
          localStorage.removeItem("token");
          window.location.replace("/login");
          return;
        }

        setError(err.message || "Unable to load lead details");
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  const handleStatusUpdate = async (nextStatus) => {
    const token = localStorage.getItem("token");

    if (!isValidToken(token)) {
      localStorage.removeItem("token");
      window.location.replace("/login");
      return;
    }

    if (!leadId || lead?.status === nextStatus) {
      return;
    }

    try {
      setUpdatingStatus(nextStatus);
      setError("");

      const res = await fetch(`${API_URL}/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update lead status");
      }

      setLead((prev) => ({
        ...prev,
        status: data?.status || nextStatus,
      }));
    } catch (err) {
      setError(err.message || "Unable to update lead status");
    } finally {
      setUpdatingStatus("");
    }
  };

  if (loading) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-gray-600">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  if (!lead) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-gray-600">Lead data unavailable.</p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Lead Detail</h1>
        <Link
          href="/dashboard"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
        >
          Back to Leads
        </Link>
      </div>

      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="mt-1 text-base font-medium text-gray-900">{lead.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 text-base font-medium text-gray-900">{lead.email}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Message</p>
            <p className="mt-1 text-base text-gray-800">{lead.message || "No message"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="mt-1 text-base font-medium capitalize text-gray-900">
              {lead.status || "unknown"}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleStatusUpdate("contacted")}
                disabled={lead.status === "contacted" || updatingStatus !== ""}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingStatus === "contacted" ? "Updating..." : "Mark Contacted"}
              </button>
              <button
                type="button"
                onClick={() => handleStatusUpdate("converted")}
                disabled={lead.status === "converted" || updatingStatus !== ""}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingStatus === "converted" ? "Updating..." : "Mark Converted"}
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
