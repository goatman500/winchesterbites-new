"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetLink("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create reset link.");
      }

      setMessage(data.message || "Reset link created.");
      setResetLink(data.resetLink || "");
      setEmail("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            ← Back to Login
          </Link>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-600">
              Password Help
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Forgot Password
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Enter your email to generate a password reset link.
            </p>
          </div>

          {message && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          {resetLink && (
            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-800">
              <p className="font-semibold">Reset link:</p>
              <Link
                href={resetLink}
                className="mt-2 inline-block break-all font-semibold text-sky-700 hover:text-sky-900"
              >
                {resetLink}
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-sky-600 px-8 py-4 font-semibold text-white shadow-lg shadow-sky-200 hover:-translate-y-1 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Generating Link..." : "Generate Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}