"use client";

import { useState, useEffect } from "react";
import { useHeader } from "@/context/HeaderContext";
import { getMe, updateProfile, changePassword } from "@/services/api";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiCheckCircle, 
  FiAlertCircle,
  FiSave,
  FiLoader,
  FiShield
} from "react-icons/fi";

export default function SettingsPage() {
  const { setHeader } = useHeader();

  // ── Profile State ───────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState({ type: "", message: "" });

  // ── Password State ──────────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });

  // ── Configure global Header & Fetch User ────────────────────────────────────
  useEffect(() => {
    setHeader({
      title: "Settings",
      subTitle: "Manage your account preferences and security",
      actionButton: null,
    });

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const user = await getMe(token);
        setProfile({ name: user.name, email: user.email });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // If the session is invalid (e.g. user not found in DB), redirect to login
        if (err.message.includes("Not authorized")) {
          localStorage.removeItem("token");
          window.location.replace("/login");
        }
      }
    };

    fetchUser();
  }, [setHeader]);

  // ── Profile Handlers ────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      setProfileStatus({ type: "error", message: "Name cannot be empty." });
      setTimeout(()=>{
        setProfileStatus({ type: "", message: "" });
      },2000)
      return;
    }
    

    setIsSavingProfile(true);
    setProfileStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      await updateProfile({ name: profile.name }, token);
      setProfileStatus({ type: "success", message: "Profile updated successfully!" });
      setTimeout(() => setProfileStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      setProfileStatus({ type: "error", message: err.message || "Failed to update profile." });
      setTimeout(()=>{
        setProfileStatus({ type: "", message: "" });
      },2000)
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ── Password Handlers ───────────────────────────────────────────────────────
  const handleSavePassword = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPasswordStatus({ type: "error", message: "All fields are required." });
      setTimeout(()=>{
        setPasswordStatus({ type: "", message: "" });
      },2000)
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordStatus({ type: "error", message: "New password must be at least 6 characters." });
      setTimeout(()=>{
        setPasswordStatus({ type: "", message: "" });
      },2000)
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordStatus({ type: "error", message: "Passwords do not match." });
      setTimeout(()=>{
        setPasswordStatus({ type: "", message: "" });
      },2000)
      return;
    }

    setIsSavingPassword(true);
    setPasswordStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      await changePassword({ 
        currentPassword: passwords.currentPassword, 
        newPassword: passwords.newPassword 
      }, token);
      
      setPasswordStatus({ type: "success", message: "Password changed successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      setPasswordStatus({ type: "error", message: err.message || "Failed to change password." });
      setTimeout(() => setPasswordStatus({ type: "", message: "" }), 3000);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">

      {/* ── Profile Section ── */}
      <section className="bg-gray-900 rounded-xl shadow-md border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiUser className="text-blue-500" /> Profile Information
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Update your display name and view your registered email.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
          {profileStatus.message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              profileStatus.type === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
            }`}>
              {profileStatus.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
              {profileStatus.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email (Read Only)</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 pl-9 pr-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 active:scale-95 disabled:opacity-50"
          >
            {isSavingProfile ? <FiLoader className="animate-spin" /> : <FiSave />}
            {isSavingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      {/* ── Security Section ── */}
      <section className="bg-gray-900 rounded-xl shadow-md border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiShield className="text-blue-500" /> Password Security
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Ensure your account stays secure by using a strong password.</p>
        </div>

        <form onSubmit={handleSavePassword} className="p-6 space-y-6">
          {passwordStatus.message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              passwordStatus.type === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
            }`}>
              {passwordStatus.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
              {passwordStatus.message}
            </div>
          )}

          <div className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingPassword}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-gray-700 active:scale-95 disabled:opacity-50"
          >
            {isSavingPassword ? <FiLoader className="animate-spin" /> : <FiShield />}
            {isSavingPassword ? "Updating..." : "Change Password"}
          </button>
        </form>
      </section>

      <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-medium">
        LeadFlow CRM v1.0.5 — Build 2026.04.29
      </p>

    </div>
  );
}
