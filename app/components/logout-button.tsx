"use client";

export default function LogoutButton({ className = "" }) {
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // Dispatch logout event for ForceNavbarRefresh
      window.dispatchEvent(new Event("logout"));
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={`navbar-btn bg-sky-400 hover:bg-sky-500 ${className}`}
    >
      Log Out
    </button>
  );
}