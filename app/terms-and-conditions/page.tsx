import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";

export default async function TermsAndConditionsPage() {
  // Read the markdown file
  const filePath = path.join(process.cwd(), "app", "terms-and-conditions.md");
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (e) {
    return notFound();
  }

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
          <h1>Terms and Conditions</h1>
          <article>
            {content.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
