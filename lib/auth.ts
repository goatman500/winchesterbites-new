import { cookies } from "next/headers";
import { getUserById, User, UserRole } from "@/lib/users";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const session = cookieStore.get("session")?.value;

  if (!session) {
    return null;
  }

  const user = getUserById(session);

  if (!user) {
    return null;
  }

  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return user;
}

export function requireRole(user: User | null, roles: UserRole[]) {
  if (!user || !roles.includes(user.role)) {
    return false;
  }
  return true;
}
