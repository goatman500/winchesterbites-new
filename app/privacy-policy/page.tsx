import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
          <h1>Privacy Policy</h1>
          <article>
            {/* You can replace this with a markdown renderer if desired */}
            <p>Effective Date: March 11, 2026</p>
            <p>WinchesterBites ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (the "Platform").</p>
            <h2>1. Information We Collect</h2>
            <ul>
              <li><b>Account Information:</b> When you create an account, we collect your name, email address, and other relevant details.</li>
              <li><b>Restaurant Listings:</b> Restaurants may provide business information, menus, images, and contact details.</li>
              <li><b>Usage Data:</b> We may collect information about your interactions with the Platform, such as pages visited and features used.</li>
              <li><b>Cookies:</b> We use cookies to manage sessions and enhance your experience.</li>
            </ul>
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide, operate, and maintain the Platform.</li>
              <li>To communicate with you about your account or listings.</li>
              <li>To improve our services and user experience.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <h2>3. Information Sharing</h2>
            <ul>
              <li>We do not sell your personal information.</li>
              <li>Restaurant information is publicly visible to users.</li>
              <li>We may share information with service providers who assist us in operating the Platform.</li>
              <li>We may disclose information if required by law or to protect our rights.</li>
            </ul>
            <h2>4. Data Security</h2>
            <ul>
              <li>We implement reasonable measures to protect your information.</li>
              <li>No method of transmission over the Internet or electronic storage is 100% secure.</li>
            </ul>
            <h2>5. Your Choices</h2>
            <ul>
              <li>You may update or delete your account information at any time.</li>
              <li>You may opt out of certain communications by following the instructions in those messages.</li>
            </ul>
            <h2>6. Children's Privacy</h2>
            <ul>
              <li>The Platform is not intended for children under 13. We do not knowingly collect information from children under 13.</li>
            </ul>
            <h2>7. Changes to This Policy</h2>
            <ul>
              <li>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</li>
            </ul>
            <h2>8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at support@winchesterbites.com.</p>
            <hr />
            <p>By using WinchesterBites, you acknowledge that you have read and understood this Privacy Policy.</p>
          </article>
        </div>
      </div>
    </main>
  );
}
