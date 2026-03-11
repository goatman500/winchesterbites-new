import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const currentPassword = body.currentPassword || "";
    const newPassword = body.newPassword || "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const users = getUsers();
    const index = users.findIndex((u) => u.id === user.id);

    if (index === -1) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    users[index].passwordHash = await bcrypt.hash(newPassword, 10);
    saveUsers(users);

    return NextResponse.json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("POST /api/auth/change-password failed:", error);

    return NextResponse.json(
      { error: "Failed to change password." },
      { status: 500 }
    );
  }
}