import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateReply } from "@/lib/intents";

// --- Rate Limiting ---
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

// --- Input Sanitization ---
function sanitizeInput(raw: unknown): string {
  if (typeof raw !== "string") return "";
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/<[^>]*>/g, "");
  if (cleaned.length > 500) {
    cleaned = cleaned.slice(0, 500);
  }
  return cleaned;
}

// --- Gemini System Prompt ---
const SYSTEM_INSTRUCTION = `You are Dapper, the personal style consultant for Amaka Fashion Atelier, a luxury menswear brand based in Abakaliki, Ebonyi State, Nigeria.

About the brand:
- We specialize in Senator Wear, Suits, Shirts, Casual wear, Traditional attire, and Corporate fashion
- All garments are bespoke/made-to-measure
- Pricing is consultation-based (we don't list specific prices)
- Located in Abakaliki, Ebonyi State, Nigeria
- Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM, Sun by appointment
- WhatsApp: +234 913 127 2407
- We deliver nationwide across Nigeria

Your personality:
- Warm, professional, and knowledgeable about men's fashion
- Speak with sophistication but remain approachable
- Always guide customers toward WhatsApp (+234 913 127 2407) for orders, appointments, and detailed inquiries
- Keep responses concise (2-4 sentences max) unless the customer asks for detail
- Never make up prices - always direct to WhatsApp for pricing
- Celebrate Nigerian fashion heritage`;

// --- POST Handler ---
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    // Check rate limit
    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter },
        { status: 429 }
      );
    }

    // Parse request body
    let body: { message?: unknown; history?: Array<{ role: string; content: string }> };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Sanitize input
    const message = sanitizeInput(body.message);
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if Gemini API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fall back to keyword matching
      const reply = generateReply(message);
      return NextResponse.json({ reply, fallback: true });
    }

    // Call Gemini API
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const chat = model.startChat({
        history: (body.history || []).map((h) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        })),
      });

      const result = await chat.sendMessage(message);
      const reply = result.response.text();

      return NextResponse.json({ reply });
    } catch (err) {
      console.error("[Chat API] Gemini API error:", err);
      // Fall back to keyword matching
      const reply = generateReply(message);
      return NextResponse.json({ reply, fallback: true });
    }
  } catch (err) {
    console.error("[Chat API] Unexpected error:", err);
    return NextResponse.json(
      { reply: "I apologize for the inconvenience. Please try again or reach out on WhatsApp at +234 913 127 2407.", fallback: true }
    );
  }
}
