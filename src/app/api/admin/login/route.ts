import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { createSessionToken } from "@/lib/session";

// --- IP-based brute-force protection ---
// Tracks failed login attempts per IP. After MAX_FAILURES within WINDOW_MS,
// the IP is locked out for the remainder of the window.
// Note: this is in-process state, so it resets between server restarts and
// is per-instance. For production hardening, back this with a shared store.
const failureMap = new Map<string, { count: number; resetAt: number }>();
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60_000; // 15 minutes

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function checkLockout(ip: string): { locked: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = failureMap.get(ip);
  if (!entry || now > entry.resetAt) return { locked: false, retryAfter: 0 };
  if (entry.count >= MAX_FAILURES) {
    return { locked: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { locked: false, retryAfter: 0 };
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = failureMap.get(ip);
  if (!entry || now > entry.resetAt) {
    failureMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

function clearFailures(ip: string): void {
  failureMap.delete(ip);
}

export async function POST(request: Request) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);

  // Reject locked-out IPs before any work
  const { locked, retryAfter } = checkLockout(ip);
  if (locked) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many failed attempts. Please try again later.",
        retryAfter,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    // Hash the input password with SHA-256
    const inputHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Timing-safe comparison
    const storedHashBuffer = Buffer.from(passwordHash, "hex");
    const inputHashBuffer = Buffer.from(inputHash, "hex");

    if (
      storedHashBuffer.length !== inputHashBuffer.length ||
      !crypto.timingSafeEqual(storedHashBuffer, inputHashBuffer)
    ) {
      recordFailure(ip);
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    // Successful login - clear any prior failure count for this IP
    clearFailures(ip);

    // Create a signed session token
    const secret = process.env.SESSION_SECRET || "default-dev-secret";
    const sessionToken = await createSessionToken(secret);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
