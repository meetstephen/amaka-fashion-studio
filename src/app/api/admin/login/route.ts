import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { createSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
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
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

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
