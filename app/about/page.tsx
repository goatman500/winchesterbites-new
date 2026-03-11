import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-emerald-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10 prose prose-slate max-w-none">
          <h1>About WinchesterBites</h1>
          <p>WinchesterBites is a platform dedicated to connecting local diners with restaurants in Winchester and Frederick County. Our mission is to help restaurants promote their menus, specials, and events, while making it easy for customers to discover great local food options.</p>
          <h2>Our Mission</h2>
          <p>To support the local food community by providing a simple, effective, and free way for restaurants to reach new customers and for diners to explore the best of Winchester and Frederick County cuisine.</p>
          <h2>For Restaurants</h2>
          <ul>
            <li>Create a free account and list your restaurant.</li>
            <li>Promote your menu, specials, and events.</li>
            <li>Connect directly with local diners.</li>
          </ul>
          <h2>For Diners</h2>
          <ul>
            <li>Browse a curated directory of local restaurants.</li>
            <li>Discover new places to eat and enjoy exclusive specials.</li>
            <li>Support your local food scene.</li>
          </ul>
          <h2>Contact Us</h2>
          <p>Have questions or feedback? <Link href="/contact" className="text-sky-600 hover:underline">Contact us here</Link>.</p>
        </div>
      </div>
    </main>
  );
}
