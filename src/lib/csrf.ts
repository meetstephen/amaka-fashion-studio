/**
 * CSRF token generation and validation utility
 * Uses crypto for secure random token generation
 *
 * Usage: This should be used in admin mutation endpoints (content updates,
 * image uploads, etc.) to protect against cross-site request forgery attacks.
 * The login route does not use CSRF because of the chicken-and-egg problem
 * (no session exists yet to store the token).
 */

import { cookies } from "next/headers";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generate a CSRF token and store it in a cookie (for use in API routes/server actions)
 */
export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
  return token;
}

/**
 * Validate a CSRF token from request header against the stored cookie
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (!headerToken) return false;

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken) return false;

  // Timing-safe comparison
  if (headerToken.length !== cookieToken.length) return false;

  const encoder = new TextEncoder();
  const a = encoder.encode(headerToken);
  const b = encoder.encode(cookieToken);

  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
