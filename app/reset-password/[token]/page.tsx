"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ResetPasswordPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    params.then((resolved) => {
      setToken(resolved.token);
      setLoaded(true);
    });
  }, [params]);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccessMessage("Password reset successfully. Redirecting to login...");
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          Loading...
        </div>
      </main>
    );
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
              Secure Access
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Reset Password
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Enter your new password below.
            </p>
          </div>

          {successMessage && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-sky-600 px-8 py-4 font-semibold text-white shadow-lg shadow-sky-200 hover:-translate-y-1 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}