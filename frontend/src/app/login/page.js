"use client";

import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="p-6 border rounded w-80">
        <h2 className="text-xl mb-4">Admin Login</h2>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}