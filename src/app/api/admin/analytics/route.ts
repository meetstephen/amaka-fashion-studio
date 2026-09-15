import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";
import { getStats } from "@/lib/visitor-store";

/**
 * GET /api/admin/analytics
 * Returns aggregated analytics for the admin dashboard.
 * Requires a valid `admin_session` cookie.
 */
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 503 });
  }
  const valid = await verifySessionToken(session, secret);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = getStats();
  return NextResponse.json(stats);
}
