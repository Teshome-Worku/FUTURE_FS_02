"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLeads } from "@/services/api";
import { useHeader } from "@/context/HeaderContext";
import {
  FiUsers,
  FiUserPlus,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Token guard ──────────────────────────────────────────────────────────────

const isValidToken = (token) => {
  if (typeof token !== "string") return false;
  const normalized = token.trim();
  return normalized !== "" && normalized !== "undefined" && normalized !== "null";
};

// ─── Status badge colour map ──────────────────────────────────────────────────

const STATUS_BADGE = {
  new:       "bg-gray-100 text-gray-600",
  contacted: "bg-blue-100 text-blue-700",
  converted: "bg-green-100 text-green-700",
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [leads, setLeads]     = useState([]);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);
  const { setHeader }         = useHeader();

  // ── Derived stats ───────────────────────────────────────────────────────────

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFollowUpDue = (lead) => {
    if (!lead?.followUpDate) return false;
    const followUp = new Date(lead.followUpDate);
    if (Number.isNaN(followUp.getTime())) return false;
    followUp.setHours(0, 0, 0, 0);
    return followUp <= today;
  };

  const leadsRequiringAttention = leads.filter(isFollowUpDue);
  const totalLeads     = leads.length;
  const newLeads       = leads.filter((l) => l.status === "new").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;

  // ── Chart data ──────────────────────────────────────────────────────────────

  // Bar chart: group leads by date (YYYY-MM-DD), count per day
  const barData = Object.entries(
    leads.reduce((acc, lead) => {
      const date = lead.createdAt
        ? new Date(lead.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day:   "numeric",
          })
        : "Unknown";
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([date, count]) => ({ date, count }))
    .slice(-7); // last 7 distinct dates

  // Pie chart: status distribution
  const PIE_COLORS = ["#6366f1", "#3b82f6", "#22c55e"];
  const pieData = [
    { name: "New",       value: newLeads },
    { name: "Contacted", value: contactedLeads },
    { name: "Converted", value: convertedLeads },
  ].filter((d) => d.value > 0);

  // ── Stat card definitions ───────────────────────────────────────────────────

  const statCards = [
    {
      title:  "Total Leads",
      value:  totalLeads,
      icon:   FiUsers,
      accent: "bg-indigo-50 text-indigo-600",
    },
    {
      title:  "New Leads",
      value:  newLeads,
      icon:   FiUserPlus,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      title:  "Contacted",
      value:  contactedLeads,
      icon:   FiPhone,
      accent: "bg-purple-50 text-purple-600",
    },
    {
      title:  "Converted",
      value:  convertedLeads,
      icon:   FiCheckCircle,
      accent: "bg-emerald-50 text-emerald-600",
    },
  ];

  // ── Configure global Header ─────────────────────────────────────────────────

  useEffect(() => {
    setHeader({
      title: "Dashboard",
      showSearch: false,
      actionButton: {
        label: "＋ Add Lead",
        onClick: () => console.log("Add Lead clicked"),
      },
    });
  }, [setHeader]);

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
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="space-y-8">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.accent}`}
              >
                <Icon className="h-6 w-6" />
              </span>
            </article>
          );
        })}
      </div>

      {/* ── Insights: Bar + Pie Charts ── */}
      {!loading && !error && leads.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Bar chart — Leads Over Time */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Leads Overview</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — Status Distribution */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Lead Status Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

      {/* ── Follow-Up Alert Banner ── */}
      {!loading && !error && leadsRequiringAttention.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <FiAlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Leads Requiring Attention
            </p>
            <p className="mt-0.5 text-sm text-amber-800">
              {leadsRequiringAttention.length} lead
              {leadsRequiringAttention.length > 1 ? "s" : ""} have a follow-up
              due today or earlier.
            </p>
          </div>
        </div>
      )}

      {/* ── Recent Leads ── */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">

        {/* Card header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Leads</h2>
          <Link
            href="/dashboard/leads"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            View All →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 p-5 text-sm text-gray-500">
            <FiLoader className="h-4 w-4 animate-spin" />
            Loading leads…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-5 text-sm text-red-600">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && leads.length === 0 && (
          <div className="p-5 text-sm text-gray-500">
            No leads found. Click{" "}
            <span className="font-medium text-blue-600">＋ Add Lead</span> to
            get started.
          </div>
        )}

        {/* Top-5 leads sorted by createdAt descending */}
        {!loading && !error && leads.length > 0 && (
          <ul>
            {[...leads]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((lead, idx, arr) => (
                <li
                  key={lead._id}
                  className={idx < arr.length - 1 ? "border-b border-gray-100" : ""}
                >
                  <Link
                    href={`/dashboard/${lead._id}`}
                    className="flex items-center justify-between px-5 py-4 transition hover:bg-gray-50"
                  >
                    {/* Lead info */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {lead.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {lead.email}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`ml-4 flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        STATUS_BADGE[lead.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        )}

      </div>

    </section>
  );
}