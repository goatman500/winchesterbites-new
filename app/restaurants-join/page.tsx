"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function RestaurantsJoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    menuLink: "",
    description: "",
    category: "General",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setLoading(true);
    setSubmitted(false);
    setErrorMessage("");

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      if (imageFile) {
        formPayload.append("image", imageFile);
      }

      const res = await fetch("/api/restaurants", {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit restaurant.");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        address: "",
        phone: "",
        website: "",
        menuLink: "",
        description: "",
        category: "General",
      });
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 text-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-8 animate-fade-in">
        <h1 className="text-3xl font-black text-slate-900 mb-4 text-center">Join as a Restaurant Partner</h1>
        <p className="mb-8 text-lg text-slate-700 text-center">
          Get your restaurant featured on WinchesterBites! Share your menu, specials, and events with local food lovers.
        </p>
        {submitted ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-emerald-700 mb-2">Request Submitted!</h2>
            <p className="text-slate-700">Thank you for your interest. We will review your request and contact you soon.</p>
            <Link href="/restaurants" className="mt-6 inline-block rounded-full bg-white px-8 py-4 font-semibold text-black-important ring-1 ring-slate-300 transition hover:-translate-y-1 hover:bg-slate-50">Browse Restaurants</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Restaurant Name *</label>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1">Address *</label>
              <input id="address" name="address" type="text" required value={formData.address} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">Phone *</label>
              <input id="phone" name="phone" type="text" required value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-semibold text-slate-700 mb-1">Website</label>
              <input id="website" name="website" type="text" value={formData.website} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
            </div>
            <div>
              <label htmlFor="menuLink" className="block text-sm font-semibold text-slate-700 mb-1">Menu Link</label>
              <input id="menuLink" name="menuLink" type="text" value={formData.menuLink} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200">
                <option value="General">General</option>
                <option value="Cafe">Cafe</option>
                <option value="Bar">Bar</option>
                <option value="Bakery">Bakery</option>
                <option value="Food Truck">Food Truck</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
              <textarea id="description" name="description" required value={formData.description} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200" rows={3} />
            </div>
            {errorMessage && <div className="text-red-600 text-sm font-semibold text-center">{errorMessage}</div>}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-sky-600 px-8 py-4 font-semibold text-black-important shadow-lg shadow-sky-200 hover:-translate-y-1 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Submitting..." : "Request to Join"}
            </button>
            <div className="text-center mt-4">
              <Link href="/restaurants" className="text-sky-700 font-semibold hover:underline">Browse Restaurants</Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}