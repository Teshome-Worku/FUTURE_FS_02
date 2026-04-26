"use client";

import Link from "next/link";
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFollowUpDue = (lead) => {
    if (!lead?.followUpDate) {
      return false;
    }

    const followUp = new Date(lead.followUpDate);
    if (Number.isNaN(followUp.getTime())) {
      return false;
    }

    followUp.setHours(0, 0, 0, 0);
    return followUp <= today;
  };

  const leadsRequiringAttention = leads.filter(isFollowUpDue);

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const contactedLeads = leads.filter((lead) => lead.status === "contacted").length;
  const convertedLeads = leads.filter((lead) => lead.status === "converted").length;

  const summaryCards = [
    { title: "Total Leads", value: totalLeads, icon: "TL" },
    { title: "New Leads", value: newLeads, icon: "NW" },
    { title: "Contacted Leads", value: contactedLeads, icon: "CT" },
    { title: "Converted Leads", value: convertedLeads, icon: "CV" },
  ];

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
    <section>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Overview</h1>
      <p className="mb-6 text-sm text-gray-600">Lead performance snapshot</p>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.title}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                {card.icon}
              </span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">{card.value}</p>
          </article>
        ))}
      </div>

      {!loading && !error && leadsRequiringAttention.length > 0 && (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">
            Leads Requiring Attention
          </h2>
          <p className="mt-1 text-sm text-amber-800">
            {leadsRequiringAttention.length} lead
            {leadsRequiringAttention.length > 1 ? "s" : ""} have follow-up due.
          </p>
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold text-gray-900">Leads</h2>

      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-600">
          Loading leads...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-600">
          No leads found.
        </div>
      )}

      <div className="space-y-4">
        {leads.map((lead) => (
          <Link key={lead._id} href={`/dashboard/${lead._id}`} className="block">
            <article
              className={`cursor-pointer rounded-lg border p-5 shadow-sm transition hover:bg-gray-50 ${
                isFollowUpDue(lead)
                  ? "border-amber-300 bg-amber-50/60"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{lead.email}</p>
              <p className="mt-2 text-sm text-gray-700">Status: {lead.status}</p>
              {isFollowUpDue(lead) && (
                <span className="mt-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
                  Follow-Up Due
                </span>
              )}
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}