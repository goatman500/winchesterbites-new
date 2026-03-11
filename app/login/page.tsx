"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      window.dispatchEvent(new Event("login"));
      if (data.user && data.user.role === "admin") {
        router.push("/admin/restaurants");
      } else if (data.user && data.user.role === "restaurant") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200 animate-fade-in">
        <h1 className="mb-6 text-3xl font-black text-slate-900 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
          {error && <div className="text-red-600 text-sm font-semibold text-center">{error}</div>}
          <button
            type="submit"
            className="w-full rounded-full bg-sky-600 px-8 py-4 font-semibold text-black-important shadow-lg shadow-sky-200 transition hover:-translate-y-1 hover:bg-sky-700"
          >
            Log In
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-sky-700 font-semibold hover:underline">
            Forgot your password?
          </Link>
        </div>
        <div className="mt-4 text-center text-slate-600">
          Don't have an account?{" "}
          <Link href="/create-account" className="text-sky-700 font-semibold hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}