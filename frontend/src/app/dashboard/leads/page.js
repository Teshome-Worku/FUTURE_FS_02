"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHeader } from "@/context/HeaderContext";
import { getLeads } from "@/services/api";
import { FiLoader, FiInbox } from "react-icons/fi";
import Link from "next/link";

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
  const [leads, setLeads]     = useState([]);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  const router      = useRouter();
  const { setHeader } = useHeader();

  // ── Configure global Header ─────────────────────────────────────────────────

  useEffect(() => {
    setHeader({
      title: "Leads",
      showSearch: true,
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

  // ── Client-side search filter ───────────────────────────────────────────────

  const filtered = leads.filter((lead) => {
    const q = search.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.status?.toLowerCase().includes(q)
    );
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="space-y-5 mt-1">

      {/* ── Filters placeholder ── */}
      <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-400">
        Filters coming soon
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

      {/* ── Empty ── */}
      {!loading && !error && leads.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-16 text-center">
          <FiInbox className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">No leads yet</p>
          <p className="text-xs text-gray-400">
            Click <span className="font-semibold text-blue-600">+ Add Lead</span> to create your first one.
          </p>
        </div>
      )}

      {/* ── Table ── */}
      {!loading && !error && leads.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-100">

            {/* ── Head ── */}
            <thead>
              <tr className="bg-gray-50">
                {["Name", "Email", "Message", "Status", "Follow-Up", "Actions"].map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
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
                    className="px-5 py-8 text-center text-sm text-gray-400"
                  >
                    No leads match your search.
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
                      <span className="text-xs text-gray-500" 
                      href={`maito:${lead.email}`}>
                        {lead.email || "—"}
                      </span>
                    </td>

                    {/* Message (truncated) */}
                    <td className="px-5 py-4">
                      <span className="block max-w-[220px] truncate text-xs text-gray-500">
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
                      <Link
                        href={`/dashboard/${lead._id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                      >
                        View
                      </Link>
                    </td>
                    {/* <td className="whitespace-nowrap px-5 py-4">
                      <Link
                        href={`/dashboard/leads/${lead._id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                      >
                        Edit
                      </Link>
                    </td> */}

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      )}

    </section>
  );
}
