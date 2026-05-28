import { NextRequest, NextResponse } from "next/server";
import { hashIp, recordVisit } from "@/lib/visitor-store";
import { sanitizeInput } from "@/lib/sanitize";

/**
 * POST /api/track
 * Body: { page: string; referrer?: string }
 *
 * Records a lightweight visit event for the in-process analytics store.
 * IP is hashed; we never store raw IPs.
 */
export async function POST(request: NextRequest) {
  let body: { page?: unknown; referrer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const page = sanitizeInput(body.page, 200) || "/";
  const referrer = sanitizeInput(body.referrer, 500);

  // IP from headers (Vercel uses x-forwarded-for / x-real-ip)
  const fwd = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = (fwd?.split(",")[0]?.trim() || realIp || "unknown").slice(0, 64);
  const ipHash = hashIp(ip);

  // Country: prefer Vercel geo header, else accept-language hint
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("accept-language")?.split(",")[0]?.split("-")[1]?.toUpperCase() ||
    "??";

  const userAgent = request.headers.get("user-agent")?.slice(0, 200) || "unknown";

  // TODO: when Supabase env is set, also persist to `visitor_events` table.
  recordVisit({
    page,
    referrer,
    ipHash,
    userAgent,
    country,
  });

  return NextResponse.json({ ok: true });
}
