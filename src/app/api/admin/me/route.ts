import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

/**
 * GET /api/admin/me
 *
 * Lightweight auth check used by client-side components to decide
 * whether to render admin-only UI. Always returns JSON; never redirects.
 */
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const secret = process.env.SESSION_SECRET || "default-dev-secret";
  const valid = await verifySessionToken(session, secret);

  if (!valid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
