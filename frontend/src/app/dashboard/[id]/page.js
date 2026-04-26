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
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState("");
  const [followUpDateInput, setFollowUpDateInput] = useState("");
  const [updatingFollowUpDate, setUpdatingFollowUpDate] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      const token = localStorage.getItem("token");

      if (!isValidToken(token)) {
        localStorage.removeItem("token");
        window.location.replace("/login");
        return;
      }

      try {
        const [leadsData, notesRes] = await Promise.all([
          getLeads(token),
          fetch(`${API_URL}/notes/${leadId}`, {
            headers: {
              Authorization: `Bearer ${token.trim()}`,
            },
          }),
        ]);

        const notesData = await notesRes.json();

        if (!notesRes.ok) {
          throw new Error(notesData?.message || "Failed to fetch notes");
        }

        const selectedLead = leadsData.find((item) => item._id === leadId);

        if (!selectedLead) {
          setError("Lead not found.");
          setLead(null);
          return;
        }

        setLead(selectedLead);
        setFollowUpDateInput(
          selectedLead?.followUpDate
            ? new Date(selectedLead.followUpDate).toISOString().split("T")[0]
            : ""
        );
        const normalizedNotes = Array.isArray(notesData) ? notesData : [];
        const sortedNotes = [...normalizedNotes].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotes(sortedNotes);
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

  const handleAddNote = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const content = noteInput.trim();

    if (!isValidToken(token)) {
      localStorage.removeItem("token");
      window.location.replace("/login");
      return;
    }

    if (!content || !leadId) {
      return;
    }

    try {
      setAddingNote(true);
      setError("");

      const res = await fetch(`${API_URL}/notes/${leadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add note");
      }

      setNoteInput("");
      setNotes((prev) => [data, ...prev]);
    } catch (err) {
      setError(err.message || "Unable to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleSetFollowUpDate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const selectedDate = followUpDateInput.trim();

    if (!isValidToken(token)) {
      localStorage.removeItem("token");
      window.location.replace("/login");
      return;
    }

    if (!leadId || !selectedDate) {
      return;
    }

    try {
      setUpdatingFollowUpDate(true);
      setError("");

      const res = await fetch(`${API_URL}/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ followUpDate: selectedDate }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to set follow-up date");
      }

      setLead((prev) => ({
        ...prev,
        followUpDate: data?.followUpDate || selectedDate,
      }));
      setFollowUpDateInput(
        data?.followUpDate
          ? new Date(data.followUpDate).toISOString().split("T")[0]
          : selectedDate
      );
    } catch (err) {
      setError(err.message || "Unable to set follow-up date");
    } finally {
      setUpdatingFollowUpDate(false);
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
          <div>
            <p className="text-sm text-gray-500">Follow-Up Date</p>
            <p className="mt-1 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Next Follow-Up:{" "}
              {lead.followUpDate
                ? new Date(lead.followUpDate).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })
                : "No follow-up scheduled"}
            </p>

            <form onSubmit={handleSetFollowUpDate} className="mt-4 space-y-3">
              <input
                type="date"
                value={followUpDateInput}
                onChange={(e) => setFollowUpDateInput(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-800 outline-none transition focus:border-gray-400"
              />
              <button
                type="submit"
                disabled={updatingFollowUpDate || !followUpDateInput}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingFollowUpDate ? "Setting..." : "Set Follow-Up"}
              </button>
            </form>
          </div>
        </div>
      </article>

      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Notes</h2>

        <form onSubmit={handleAddNote} className="mb-5 space-y-3">
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Write a note..."
            className="min-h-24 w-full rounded-md border border-gray-300 p-3 text-sm text-gray-800 outline-none transition focus:border-gray-400"
          />
          <button
            type="submit"
            disabled={addingNote || !noteInput.trim()}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addingNote ? "Adding..." : "Add Note"}
          </button>
        </form>

        {notes.length === 0 ? (
          <p className="text-gray-600">No notes available for this lead.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <p className="text-sm text-gray-800">{note.content}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
