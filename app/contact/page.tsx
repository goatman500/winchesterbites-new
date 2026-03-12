"use client";

import Link from "next/link";




// Replace with your Formspree endpoint for conner.brach@outlook.com
const FORMSPREE_ENDPOINT = "https://formspree.io/f/yourformid";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-2 py-6 sm:px-6 sm:py-12 text-slate-900">
      <div className="mx-auto w-full max-w-lg sm:max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-white px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="rounded-2xl sm:rounded-[2rem] bg-white p-4 sm:p-8 shadow-xl ring-1 ring-slate-200">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 sm:mb-6">Contact Us</h1>
          <form
            action={FORMSPREE_ENDPOINT}
            method="POST"
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-2xl border border-slate-300 px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-xs sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-slate-300 px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-xs sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-xs sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-sky-600 px-6 py-3 sm:px-8 sm:py-4 font-semibold text-white shadow-lg shadow-sky-200 hover:-translate-y-1 hover:bg-sky-700 text-xs sm:text-base"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
