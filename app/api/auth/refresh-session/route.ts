import { NextResponse } from "next/server";
import { getUserById } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const session = req.headers.get("cookie")?.split(';').find(c => c.trim().startsWith("session="));
    if (!session) {
      return NextResponse.json({ error: "No session." }, { status: 401 });
    }
    const sessionId = session.split("=")[1];
    const user = getUserById(sessionId);
    if (!user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }
    // Refresh the session cookie
    const response = NextResponse.json({ message: "Session refreshed." });
    response.cookies.set("session", user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 300, // 5 minutes
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to refresh session." }, { status: 500 });
  }
}
