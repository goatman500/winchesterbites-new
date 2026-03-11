"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type Restaurant = {
  id: string;
  ownerId?: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  menuLink: string;
  description: string;
  category: string;
  approved: boolean;
  featured: boolean;
};

export default function DashboardPage() {
  // Customer message/image upload state

  // Session keep-alive: refresh session cookie every 2 minutes while user is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function refreshSession() {
      try {
        await fetch("/api/auth/refresh-session", { method: "POST", credentials: "include" });
      } catch {}
    }
    interval = setInterval(refreshSession, 2 * 60 * 1000); // every 2 minutes
    return () => clearInterval(interval);
  }, []);
  const [customerMessage, setCustomerMessage] = useState("");
  const [customerImage, setCustomerImage] = useState<File | null>(null);
  const [customerUploadSuccess, setCustomerUploadSuccess] = useState(false);
  const [customerUploadError, setCustomerUploadError] = useState("");
  const customerFileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleCustomerUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCustomerUploadSuccess(false);
    setCustomerUploadError("");
    if (!customerMessage && !customerImage) {
      setCustomerUploadError("Please provide a message or upload an image.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("message", customerMessage);
      if (customerImage) formData.append("image", customerImage);
      // TODO: POST to your API endpoint for customer uploads
      // await fetch("/api/customer-upload", { method: "POST", body: formData });
      setCustomerUploadSuccess(true);
      setCustomerMessage("");
      setCustomerImage(null);
      if (customerFileInputRef.current) customerFileInputRef.current.value = "";
    } catch {
      setCustomerUploadError("Failed to send information. Please try again.");
    }
  }

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    menuLink: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const res = await fetch("/api/dashboard/restaurant", {
          credentials: "include",
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (res.status === 404) {
          setRestaurant(null);
          return;
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed to load restaurant.");
        }

        setRestaurant(data);
        setFormData({
          name: data.name || "",
          address: data.address || "",
          phone: data.phone || "",
          website: data.website || "",
          menuLink: data.menuLink || "",
          description: data.description || "",
          category: data.category || "General",
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/dashboard/restaurant", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.error || "Failed to save restaurant.");
      }

      setRestaurant(data);
      setSuccessMessage(
        "Restaurant updated successfully. Changes are pending admin approval."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // Dispatch logout event for ForceNavbarRefresh
      window.dispatchEvent(new Event("logout"));
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          Loading...
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-600">
            Restaurant Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">
            No restaurant listing yet
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Create your restaurant listing first to start managing your content.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/restaurants-join"
              className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-black-important hover:bg-sky-700"
            >
              Create Restaurant Listing
            </Link>

            <Link
              href="/account"
              className="rounded-full bg-white px-6 py-3 font-semibold text-black-important ring-1 ring-slate-300 hover:bg-slate-50"
            >
              Account Settings
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-black-important hover:bg-slate-800"
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            ← Back to Home
          </Link>

          <Link
            href="/account"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            Account Settings
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-black-important hover:bg-slate-800"
          >
            Log Out
          </button>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-600">
                Restaurant Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-black text-slate-900">
                Manage Your Listing
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Update your restaurant information. Any changes will be sent for
                admin approval before they appear publicly.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200">
              <p>
                Approval Status:{" "}
                <span className="font-bold">
                  {restaurant.approved ? "Approved" : "Pending Review"}
                </span>
              </p>
              <p>
                Featured:{" "}
                <span className="font-bold">
                  {restaurant.featured ? "Yes" : "No"}
                </span>
              </p>
            </div>
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
                      {/* Customer message/image upload section */}
                      <div className="mt-12 border-t pt-10">
                        <h2 className="text-xl font-bold mb-4 text-slate-900">Send Information or Image to Admin</h2>
                        {customerUploadSuccess && (
                          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
                            Thank you! Your information has been sent for review.
                          </div>
                        )}
                        <form onSubmit={handleCustomerUpload} className="space-y-6" encType="multipart/form-data">
                          <div>
                            <label htmlFor="customer-message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                            <textarea
                              id="customer-message"
                              name="customer-message"
                              value={customerMessage}
                              onChange={e => setCustomerMessage(e.target.value)}
                              rows={4}
                              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                              placeholder="Type your message here..."
                            />
                          </div>
                          <div>
                            <label htmlFor="customer-image" className="block text-sm font-semibold text-slate-700 mb-2">Upload an Image (optional)</label>
                            <input
                              id="customer-image"
                              name="customer-image"
                              type="file"
                              accept="image/*"
                              ref={customerFileInputRef}
                              onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                  setCustomerImage(e.target.files[0]);
                                } else {
                                  setCustomerImage(null);
                                }
                              }}
                              className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white file:mr-4 file:rounded-full file:border-0 file:bg-sky-100 file:px-4 file:py-2 file:text-sky-700 file:font-semibold"
                            />
                          </div>
                          {customerUploadError && (
                            <div className="text-red-600 text-sm font-medium">{customerUploadError}</div>
                          )}
                          <button
                            type="submit"
                            className="w-full rounded-full bg-sky-600 px-8 py-4 font-semibold text-white shadow-lg shadow-sky-200 hover:-translate-y-1 hover:bg-sky-700"
                          >
                            Send to Admin
                          </button>
                        </form>
                      </div>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Restaurant Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="menuLink"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Menu Link
              </label>
              <input
                id="menuLink"
                name="menuLink"
                type="url"
                value={formData.menuLink}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              >
                <option>General</option>
                <option>American</option>
                <option>Italian</option>
                <option>Mexican</option>
                <option>Chinese</option>
                <option>Japanese</option>
                <option>Pizza</option>
                <option>BBQ</option>
                <option>Seafood</option>
                <option>Breakfast</option>
                <option>Cafe</option>
                <option>Bakery</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-sky-600 px-8 py-4 font-semibold text-white shadow-lg shadow-sky-200 hover:-translate-y-1 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}