"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};
import LogoutButton from "@/app/components/logout-button";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/WB LOGO.PNG"
            alt="WinchesterBites"
            width={80}
            height={80}
            priority
          />
          <span className="text-2xl font-black tracking-tight text-slate-900">
            WinchesterBites
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="navbar-btn bubble-btn">Return to Home</Link>
          {!user && (
            <Link href="/login" className="navbar-btn bubble-btn">Log In</Link>
          )}
          {user && (
            <>
              <Link
                href={user.role === "admin" ? "/admin/restaurants" : "/dashboard"}
                className="navbar-btn bubble-btn"
              >
                Dashboard
              </Link>
              <LogoutButton className="navbar-btn bubble-btn" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
