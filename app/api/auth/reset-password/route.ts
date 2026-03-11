import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUsers, saveUsers } from "@/lib/users";
import {
  getPasswordResets,
  savePasswordResets,
  getPasswordResetByToken,
} from "@/lib/password-resets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = body.token || "";
    const newPassword = body.newPassword || "";

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const resetRecord = getPasswordResetByToken(token);

    if (!resetRecord) {
      return NextResponse.json(
        { error: "This reset link is invalid or expired." },
        { status: 400 }
      );
    }

    const users = getUsers();
    const userIndex = users.findIndex(
      (user) => user.email.toLowerCase() === resetRecord.email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    users[userIndex].passwordHash = await bcrypt.hash(newPassword, 10);
    saveUsers(users);

    const resets = getPasswordResets();
    const updatedResets = resets.filter((reset) => reset.token !== token);
    savePasswordResets(updatedResets);

    return NextResponse.json({
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("POST /api/auth/reset-password failed:", error);

    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}