import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/users";
import {
  getPasswordResets,
  savePasswordResets,
  removeExpiredPasswordResets,
} from "@/lib/password-resets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "No account was found with that email." },
        { status: 404 }
      );
    }

    removeExpiredPasswordResets();

    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 1000 * 60 * 30;

    const resets = getPasswordResets();

    const filtered = resets.filter(
      (reset) => reset.email.toLowerCase() !== email
    );

    filtered.push({
      token,
      email,
      expiresAt,
    });

    savePasswordResets(filtered);

    return NextResponse.json({
      message: "Password reset link created.",
      resetLink: `/reset-password/${token}`,
    });
  } catch (error) {
    console.error("POST /api/auth/forgot-password failed:", error);

    return NextResponse.json(
      { error: "Failed to create password reset link." },
      { status: 500 }
    );
  }