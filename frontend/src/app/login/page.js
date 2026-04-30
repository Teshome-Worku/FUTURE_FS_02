"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
      <span>Signing in...</span>
    </div>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      if (typeof data?.token !== "string" || !data.token.trim()) {
        throw new Error("Invalid login response. Please try again.");
      }

      localStorage.setItem("token", data.token.trim());
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Unable to login");
      setTimeout(()=>{
        setError("");
      },3000)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 py-8">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Login Card */}
      <div
        className="relative w-full max-w-sm animate-[fadeInScale_0.6s_ease-out_both]"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-8">
          {/* Branding */}
          <div className="text-center mb-6">
            {/* Logo Icon */}
            <div className="mx-auto w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              LeadFlow CRM
            </h1>
            <p className="text-xs text-gray-400 mt-1 tracking-wide">
              Admin Panel
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg animate-[fadeInScale_0.3s_ease-out_both]">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="w-4.5 h-4.5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@leadflow.com"
                  className="w-full bg-gray-800/70 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50
                    transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="w-4.5 h-4.5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/70 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg pl-10 pr-12 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50
                    transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <FiEye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
                text-white font-semibold py-2.5 px-4 rounded-lg text-sm
                shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-gray-900
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700
                transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0
                cursor-pointer mt-1"
            >
              {loading ? <LoadingIndicator /> : "Sign In"}
            </button>
            <p className="text-center text-xs text-gray-600 mt-3">Admin: [tesheworku1251@gmail.com]/123123</p>
            
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-600 mt-6">
            © {new Date().getFullYear()} LeadFlow CRM. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
}