"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHeader } from "@/context/HeaderContext";
import { createLead } from "@/services/api";
import { 
  FiUser, 
  FiMail, 
  FiMessageSquare, 
  FiGlobe, 
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader
} from "react-icons/fi";

export default function NewLeadPage() {
  const router = useRouter();
  const { setHeader } = useHeader();

  // ── Form State ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    source: "Manual Entry",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // "success" or "error"

  // ── Header Config ───────────────────────────────────────────────────────────
  useEffect(() => {
    setHeader({
      title: "Add New Lead",
      subTitle: "Manually create a new business inquiry",
      actionButton: null,
    });
  }, [setHeader]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      await createLead(formData, token);
      
      setStatus({ type: "success", message: "Lead created successfully!" });
      
      // Clear form
      setFormData({ name: "", email: "", source: "Manual Entry", message: "" });
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard/leads");
      }, 1500);

    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to create lead." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      
      {/* ── Back Link ── */}
      <Link 
        href="/dashboard/leads" 
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
      >
        <FiArrowLeft />
        Back to All Leads
      </Link>

      {/* ── Form Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Card Header (Optional visual touch) */}
        <div className="h-2 bg-blue-600 w-full" />

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Status Message */}
          {status.message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl text-sm ${
              status.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-100" 
                : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {status.type === "success" ? <FiCheckCircle className="flex-shrink-0" /> : <FiAlertCircle className="flex-shrink-0" />}
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiUser className="text-gray-400" /> Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiMail className="text-gray-400" /> Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-1.5">
            <label htmlFor="source" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FiGlobe className="text-gray-400" /> Lead Source
            </label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer"
            >
              <option value="Manual Entry">Manual Entry</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Social Media">Social Media</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FiMessageSquare className="text-gray-400" /> Initial Note / Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Tell us more about this lead..."
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-300 resize-none text-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all transform active:scale-[0.98] ${
              loading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Creating Lead...
              </>
            ) : (
              "Create Lead Entry"
            )}
          </button>

          <p className="text-center text-[11px] text-gray-400">
            By creating this lead, it will be immediately available in your <Link href="/dashboard/leads" className="text-blue-500 underline">Leads Pipeline</Link>.
          </p>

        </form>
      </div>

    </div>
  );
}
