import { redirect } from "next/navigation";

export default function AdminPage() {
  // Always redirect /admin to /admin/restaurants for admin dashboard access
  redirect("/admin/restaurants");
  return null;
}
