import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sanitizeInput } from "@/lib/sanitize";

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 4;
const RATE_WINDOW_MS = 10 * 60_000;

function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const current = rateMap.get(ip);
  if (!current || now > current.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }
  if (current.count >= RATE_LIMIT) {
    return {
      limited: true,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }
  current.count += 1;
  return { limited: false, retryAfter: 0 };
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error. Missing RESEND_API_KEY." },
        { status: 500 }
      );
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const { limited, retryAfter } = isRateLimited(ip);
    if (limited) {
      return NextResponse.json(
        { error: "Too many enquiries. Please wait a few minutes and try again." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    let body: { name?: unknown; email?: unknown; phone?: unknown; message?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const name = sanitizeInput(body.name, 100).replace(/[\r\n]+/g, " ");
    const email = sanitizeInput(body.email, 254).toLowerCase();
    const phone = sanitizeInput(body.phone, 40);
    const message = sanitizeInput(body.message, 3000);

    if (!name || !email || !message || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a name, valid email, and message." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "Amaka Fashion Atelier <onboarding@resend.dev>",
      to: "lucynwoka959@gmail.com",
      replyTo: email,
      subject: "New enquiry from " + name,
      text:
        "New website enquiry\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + (phone || "Not provided") + "\n\n" +
        "Message:\n" + message,
    });

    if (error) {
      console.error("[/api/contact] Resend error:", error);
      return NextResponse.json(
        { error: "We could not send your enquiry. Please try again or use WhatsApp." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[/api/contact] Unhandled error:", message);
    return NextResponse.json(
      { error: "We could not send your enquiry. Please try again or use WhatsApp." },
      { status: 500 }
    );
  }
}
