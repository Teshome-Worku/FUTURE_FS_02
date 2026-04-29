"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHeader } from "@/context/HeaderContext";
import { getLeads } from "@/services/api";
import { 
  FiUser, 
  FiMail, 
  FiGlobe, 
  FiMessageSquare, 
  FiActivity, 
  FiCalendar, 
  FiPlus, 
  FiLoader,
  FiAlertCircle
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isValidToken = (token) => {
  if (typeof token !== "string") return false;
  const normalized = token.trim();
  return normalized !== "" && normalized !== "undefined" && normalized !== "null";
};

// ─── Status badge styling ─────────────────────────────────────────────────────

const STATUS_CONFIG = {
  new:       { label: "New",       color: "bg-gray-100 text-gray-600 border-gray-200" },
  contacted: { label: "Contacted", color: "bg-blue-50 text-blue-700 border-blue-100" },
  converted: { label: "Converted", color: "bg-green-50 text-green-700 border-green-100" },
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.id;
  const { setHeader } = useHeader();

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [followUpDateInput, setFollowUpDateInput] = useState("");
  const [updatingFollowUpDate, setUpdatingFollowUpDate] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // ── Configure global Header ─────────────────────────────────────────────────
  useEffect(() => {
    setHeader({
      title: "Lead Details",
      subTitle: "View and manage complete information for this lead",
      actionButton: {
        label: "← Back to Leads",
        onClick: () => router.push("/dashboard/leads"),
      },
    });
  }, [setHeader, router]);

  // ── Fetch Lead Data ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchLeadData = async () => {
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
        if (!notesRes.ok) throw new Error(notesData?.message || "Failed to fetch notes");

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
        setNotes([...normalizedNotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

    if (leadId) fetchLeadData();
  }, [leadId]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  
  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;
    if (nextStatus === lead.status) return;

    const token = localStorage.getItem("token");
    if (!isValidToken(token)) return window.location.replace("/login");

    try {
      setUpdatingStatus(true);
      const res = await fetch(`${API_URL}/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update status");

      setLead((prev) => ({ ...prev, status: data?.status || nextStatus }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSetFollowUpDate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!isValidToken(token)) return window.location.replace("/login");

    try {
      setUpdatingFollowUpDate(true);
      const res = await fetch(`${API_URL}/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ followUpDate: followUpDateInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to set date");

      setLead((prev) => ({ ...prev, followUpDate: data?.followUpDate || followUpDateInput }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingFollowUpDate(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const content = noteInput.trim();
    if (!content || !isValidToken(token)) return;

    try {
      setAddingNote(true);
      const res = await fetch(`${API_URL}/notes/${leadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to add note");

      setNoteInput("");
      setNotes((prev) => [data, ...prev]);
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingNote(false);
    }
  };

  // ── Render States ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <FiLoader className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
        <FiAlertCircle className="h-5 w-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 mt-4 pb-12">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Column Left (Info & Message) ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Lead Info Card */}
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
                <div className="flex items-center gap-4">
                  <p className="flex items-center gap-1.5 text-sm text-gray-500">
                    <FiMail className="text-gray-400" /> {lead.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-gray-500">
                    <FiGlobe className="text-gray-400" /> {lead.source || "Manual Entry"}
                  </p>
                </div>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-semibold border capitalize ${STATUS_CONFIG[lead.status]?.color}`}>
                {STATUS_CONFIG[lead.status]?.label || lead.status}
              </div>
            </div>
          </section>

          {/* Message Card */}
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <FiMessageSquare className="text-gray-400" /> Message
            </h3>
            <div className="h-40 overflow-y-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-inset ring-gray-100">
              <p className="whitespace-pre-wrap break-words italic">
                "{lead.message || "No message provided for this lead."}"
              </p>
            </div>
          </section>

          {/* Status & Follow-up Grid Card */}
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Status Update */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FiActivity className="text-gray-400" /> Update Status
                </h3>
                <div className="relative">
                  <select 
                    value={lead.status}
                    onChange={handleStatusChange}
                    disabled={updatingStatus}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted / Won</option>
                  </select>
                  {updatingStatus && (
                    <FiLoader className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600" />
                  )}
                </div>
              </div>

              {/* Follow-up Date */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FiCalendar className="text-gray-400" /> Follow-Up Schedule
                </h3>
                <form onSubmit={handleSetFollowUpDate} className="flex items-center gap-2">
                  <input 
                    type="date"
                    value={followUpDateInput}
                    onChange={(e) => setFollowUpDateInput(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                  />
                  <button 
                    type="submit"
                    disabled={updatingFollowUpDate || !followUpDateInput}
                    className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
                  >
                    {updatingFollowUpDate ? "Saving..." : "Set Date"}
                  </button>
                </form>
                {lead.followUpDate && (
                  <p className="text-[11px] text-gray-400 font-medium italic">
                    Current follow-up set for: {new Date(lead.followUpDate).toLocaleDateString()}
                  </p>
                )}
              </div>

            </div>
          </section>

        </div>

        {/* ── Column Right (Notes) ── */}
        <div className="space-y-6">
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 flex flex-col h-full">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Activity Notes</h3>
            
            {/* Note input */}
            <form onSubmit={handleAddNote} className="mb-6 space-y-3">
              <textarea 
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write an internal note..."
                className="w-full min-h-[100px] rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 placeholder:text-gray-300 resize-none"
              />
              <button 
                type="submit"
                disabled={addingNote || !noteInput.trim()}
                className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {addingNote ? <FiLoader className="animate-spin" /> : <FiPlus />} Add Note
              </button>
            </form>

            {/* Notes list */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {notes.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-8 italic">No notes added yet.</p>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className="rounded-lg bg-gray-50 p-4 border border-gray-100 shadow-xs">
                    <p className="text-sm text-gray-800 leading-relaxed">{note.content}</p>
                    <p className="mt-2 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      {new Date(note.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}
