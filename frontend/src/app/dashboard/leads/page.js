"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHeader } from "@/context/HeaderContext";
import { getLeads, deleteLead } from "@/services/api";
import { FiLoader, FiInbox, FiEye, FiTrash2, FiSearch } from "react-icons/fi";

// ─── Token guard ──────────────────────────────────────────────────────────────

const isValidToken = (token) => {
  if (typeof token !== "string") return false;
  const normalized = token.trim();
  return normalized !== "" && normalized !== "undefined" && normalized !== "null";
};

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_BADGE = {
  new:       "bg-gray-100 text-gray-600",
  contacted: "bg-blue-100 text-blue-700",
  converted: "bg-green-100 text-green-700",
};

// ─── Leads Page ───────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads]           = useState([]);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const router        = useRouter();
  const { setHeader } = useHeader();

  // ── Delete handler ──────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead? This action cannot be undone.")) return;

    const token = localStorage.getItem("token");
    setDeletingId(id);

    try {
      await deleteLead(id, token);
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete lead");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Configure global Header ─────────────────────────────────────────────────

  useEffect(() => {
    setHeader({
      title: "Leads",
      subTitle: "Manage and track your incoming business inquiries",
      actionButton: {
        label: "+ Add Lead",
        onClick: () => router.push("/dashboard/new-lead"),
      },
    });
  }, [setHeader, router]);

  // ── Fetch leads ─────────────────────────────────────────────────────────────

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
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // ── Combined Search and Status filtering ────────────────────────────────────

  const filtered = leads.filter((lead) => {
    const query = search.toLowerCase();
    const matchesSearch = 
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query);
    
    const matchesStatus = 
      selectedStatus === "All" || 
      lead.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="space-y-5 mt-1">

      {/* ── Filter Bar ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        
        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm text-gray-500 hidden md:inline">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-auto rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
          <FiLoader className="h-4 w-4 animate-spin" />
          Loading leads…
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── Empty State (No Leads At All) ── */}
      {!loading && !error && leads.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-16 text-center">
          <FiInbox className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">No leads yet</p>
          <p className="text-xs text-gray-400">
            Click <span className="font-semibold text-blue-600">+ Add Lead</span> to create your first one.
          </p>
        </div>
      )}

      {/* ── Table / Filtered Results ── */}
      {!loading && !error && leads.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="min-w-[900px]">
            <table className="w-full divide-y divide-gray-100">

              {/* ── Head ── */}
              <thead>
                <tr className="bg-gray-50">
                  {["Name", "Email", "Message", "Status", "Follow-Up", "Actions"].map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ── Body ── */}
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FiSearch className="h-6 w-6 text-gray-300" />
                        <p>No leads found matching your criteria.</p>
                        <button 
                          onClick={() => { setSearch(""); setSelectedStatus("All"); }}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Reset filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr
                      key={lead._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Name */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {lead.name || "—"}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="cursor-pointer hover:text-blue-500 text-xs text-gray-500 transition-colors">
                          {lead.email || "—"}
                        </span>
                      </td>

                      {/* Message (truncated) */}
                      <td className="px-5 py-4 max-w-[200px]">
                        <span className="block truncate text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                          {lead.message || "—"}
                        </span>
                      </td>

                    {/* Status badge */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          STATUS_BADGE[lead.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {lead.status || "unknown"}
                      </span>
                    </td>

                    {/* Follow-up date */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-xs text-gray-500">
                        {lead.followUpDate
                          ? new Date(lead.followUpDate).toLocaleDateString("en-US", {
                              year:  "numeric",
                              month: "short",
                              day:   "numeric",
                            })
                          : "No follow-up"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">

                        {/* View */}
                        <Link
                          href={`/dashboard/leads/${lead._id}`}
                          title="View lead"
                          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          <FiEye className="h-4 w-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          title="Delete lead"
                          disabled={deletingId === lead._id}
                          onClick={() => handleDelete(lead._id)}
                          className="cursor-pointer inline-flex items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        >
                          {deletingId === lead._id ? (
                            <FiLoader className="h-4 w-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="h-4 w-4" />
                          )}
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    )}

  </section>
  );
}
