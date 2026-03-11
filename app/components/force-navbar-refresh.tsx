"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForceNavbarRefresh() {
  const router = useRouter();
  useEffect(() => {
    // Listen for login/logout events and force a navbar refresh
    const handler = () => router.refresh();
    window.addEventListener("login", handler);
    window.addEventListener("logout", handler);
    return () => {
      window.removeEventListener("login", handler);
      window.removeEventListener("logout", handler);
    };
  }, [router]);
  return null;
}
