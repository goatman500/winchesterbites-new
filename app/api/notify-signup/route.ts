import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    // SendGrid API
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      return NextResponse.json({ error: "Missing SendGrid API key." }, { status: 500 });
    }
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "conner.brach@outlook.com" }],
            subject: "New User Signup Notification",
          },
        ],
        from: { email: "noreply@winchesterbites.com", name: "WinchesterBites" },
        content: [
          {
            type: "text/plain",
            value: `A new user signed up!\nName: ${name}\nEmail: ${email}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }
    return NextResponse.json({ message: "Notification sent." });
  } catch (error) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
