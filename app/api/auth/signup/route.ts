import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUsers, saveUsers, getUserByEmail } from "@/lib/users";
import type { User } from "@/lib/users";

const ADMIN_EMAIL = "cmbrach5@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existingUser = getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    // Determine role
    const role = email === ADMIN_EMAIL ? "admin" : "restaurant";

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      role,
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/signup failed:", error);

    return NextResponse.json(
      { error: "Failed to create account." },
      { status: 500 }
    );
  }
}