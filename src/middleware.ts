import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");

  if (!session?.value) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const secret = process.env.SESSION_SECRET || "default-dev-secret";
  const isValid = await verifySessionToken(session.value, secret);

  if (!isValid) {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
    response.cookies.delete("admin_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
