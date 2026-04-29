"use client";

import { useState, useEffect } from "react";
import { useHeader } from "@/context/HeaderContext";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiCheckCircle, 
  FiSave 
} from "react-icons/fi";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
  const { setHeader } = useHeader();

  // ── Local State ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@leadflow.io",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Configure global Header ─────────────────────────────────────────────────
  useEffect(() => {
    setHeader({
      title: "Settings",
      subTitle: "Manage your account preferences and security",
      actionButton: null,
    });
  }, [setHeader]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">

      {/* ── Success Toast (Simple inline feedback) ── */}
      {showSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-100 animate-in fade-in slide-in-from-top-4">
          <FiCheckCircle className="h-4 w-4" />
          Settings saved successfully!
        </div>
      )}

      {/* ── Profile Section ── */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiUser className="text-gray-400" /> Profile Information
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Update your personal details and contact email.</p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Display Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin border-2 border-white/20 border-t-white rounded-full" />
              ) : (
                <FiSave className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Security Section ── */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiLock className="text-gray-400" /> Security
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your password and authentication methods.</p>
        </div>
        <div className="p-6">
          <div className="rounded-lg bg-gray-50 p-4 border border-dashed border-gray-200 text-center">
            <p className="text-xs font-medium text-gray-500 italic">
              Password management and two-factor authentication features are coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* ── Version Info ── */}
      <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-medium">
        LeadFlow CRM v1.0.4 — Build 2026.04.28
      </p>

    </div>
  );
}
