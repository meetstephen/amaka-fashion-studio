import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// --- Rate Limiting ---
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function isValidMeasurement(val: unknown): boolean {
  if (typeof val !== "string" || val === "") return true; // empty is OK (optional)
  return /^\d{1,3}(\.\d{1,2})?$/.test(val);
}

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later.", retryAfter },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 400 }
    );
  }

  // Validate measurement fields
  const measurementKeys = [
    "chest",
    "waist",
    "hips",
    "shoulder",
    "sleeve",
    "neck",
    "inseam",
    "shirtLength",
  ];
  for (const key of measurementKeys) {
    if (!isValidMeasurement(body[key])) {
      return NextResponse.json(
        { error: `Invalid measurement value for ${key}` },
        { status: 400 }
      );
    }
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";

  const measurements = measurementKeys
    .filter((k) => body[k] && String(body[k]).trim())
    .map((k) => {
      const label =
        k === "shirtLength"
          ? "Shirt Length"
          : k.charAt(0).toUpperCase() + k.slice(1);
      return `${label}: ${String(body[k]).trim()}"`;
    })
    .join(", ");

  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json(
      { error: "Database not configured", fallback: true },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("customers").insert({
    name,
    phone,
    email: email || null,
    city: city || null,
    measurements: measurements || null,
    notes: notes || null,
    total_orders: 0,
  });

  if (error) {
    console.error("[Measurements API]", error.message);
    return NextResponse.json(
      { error: "Failed to save. Please try WhatsApp instead.", fallback: true },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
