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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2 py-2 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/WB LOGO.PNG"
            alt="WinchesterBites"
            width={44}
            height={44}
            priority
            className="sm:w-[80px] sm:h-[80px] w-[44px] h-[44px]"
          />
          <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
            WinchesterBites
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="navbar-btn bubble-btn min-w-[90px] sm:min-w-[160px] text-xs sm:text-base px-2 sm:px-0 py-2 sm:py-3">Return to Home</Link>
          {!user && (
            <Link href="/login" className="navbar-btn bubble-btn min-w-[90px] sm:min-w-[160px] text-xs sm:text-base px-2 sm:px-0 py-2 sm:py-3">Log In</Link>
          )}
          {user && (
            <>
              <Link
                href={user.role === "admin" ? "/admin/restaurants" : "/dashboard"}
                className="navbar-btn bubble-btn min-w-[90px] sm:min-w-[160px] text-xs sm:text-base px-2 sm:px-0 py-2 sm:py-3"
              >
                Dashboard
              </Link>
              <LogoutButton className="navbar-btn bubble-btn min-w-[90px] sm:min-w-[160px] text-xs sm:text-base px-2 sm:px-0 py-2 sm:py-3" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
