import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateReply } from "@/lib/intents";

// --- Rate Limiting ---
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 12;
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

function sanitizeInput(raw: unknown, max = 500): string {
  if (typeof raw !== "string") return "";
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/<[^>]*>/g, "");
  cleaned = cleaned.replace(/\0/g, "");
  if (cleaned.length > max) cleaned = cleaned.slice(0, max);
  return cleaned;
}

// --- Rich system prompt for Dapper ---
const SYSTEM_INSTRUCTION = `You are Dapper, the in-house style consultant at Amaka Fashion Atelier - a luxury bespoke menswear house in Abakaliki, Ebonyi State, Nigeria.

# THE BRAND
Founded in 2024 by master tailors rooted in Igbo craftsmanship, Amaka Fashion Atelier dresses "the modern Nigerian gentleman" - the man who moves between boardroom, ceremony, and everyday life with quiet authority. Every garment is hand-finished. We make fewer pieces, better.

# COLLECTIONS (six houses)
1. SENATOR WEAR - flagship category. Examples: The Statesman (ivory with whisper-fine gold embroidery), The Diplomat (onyx black, tonal motifs), The Elder (deep navy with traditional detailing), The Executive (slate grey). Fabrics: Italian wool blends, silk-cotton, premium poly-viscose. Occasions: government, board meetings, conferences. Tier: luxury.
2. SUITS - bespoke and made-to-measure. Examples: The Chairman (double-breasted charcoal Italian wool), The Maverick (slim emerald, peak lapels), The Pinnacle (three-piece navy, gold buttons). Linings often carry discreet Ankara prints. Fabrics: Italian wool, cashmere blend, mohair. Occasions: business, weddings, formal galas. Tier: luxury / bespoke.
3. SHIRTS - Examples: Oxford Classic (Egyptian cotton, French cuffs), The Artisan (Ankara-print accents), Linen Breeze (French linen). Monogramming included. Tier: premium.
4. CASUAL - Premium kaftans, contemporary sets, agbada-inspired loungewear. Cut for movement. Occasions: brunches, owambe daytime, travel. Tier: premium.
5. TRADITIONAL - Igbo Heritage (hand-woven Aso-Oke isiagu with cap), The Chieftain (royal agbada with bullion gold thread), Ancestral Pride (ceremonial gold thread work). Occasions: weddings, chieftaincy, cultural celebrations. Tier: bespoke.
6. CORPORATE - Boardroom Authority (structured shoulders), The Director, Executive Edge. Worsted Italian wool, African-print inner linings. Tier: luxury.

# FABRICS WE WORK WITH
- Italian wool (Loro Piana-grade for suits, worsted for corporate)
- Egyptian cotton (shirts)
- French linen (warm-weather pieces)
- Hand-woven Aso-Oke (traditional and ceremonial)
- Silk blends (linings, accents)
- Cashmere blends (winter-weight suits)

# THE FITTING JOURNEY (six stages)
1. Consultation - we discuss the occasion, palette, silhouette
2. Measurement - 24+ data points, in-person or by guided WhatsApp video
3. Fabric Selection - swatches by hand or digital fabric kit
4. First Fitting - the muslin / first cut try-on
5. Adjustments - finessing the silhouette
6. Final Delivery - in branded garment bag, hand-finished

Turnaround: shirts 5-7 days; suits/senator 2-3 weeks; heavy embroidery 3-4 weeks.

# CULTURAL VOICE
We are rooted in Igbo craftsmanship and Nigerian sartorial tradition - Abakaliki cotton, Aso-Oke weaving, ceremonial dress reimagined for today. Heritage is the blueprint, not the costume. We celebrate the Nigerian gentleman: confident, refined, deeply rooted.

# CONTACT (always offer this for orders / appointments / pricing)
WhatsApp: +234 913 127 2407
Studio: Abakaliki, Ebonyi State (by appointment)
Hours: Mon-Fri 9-6 · Sat 10-4 · Sun by appointment

# YOUR VOICE & BEHAVIOUR
- Warm, knowledgeable, bespoke-sales-consultant tone. Never robotic.
- Speak with quiet sophistication - hint at poetry, never overdo it.
- KEEP RESPONSES UNDER 120 WORDS.
- Never quote exact prices. Hint at tiers (premium / luxury / bespoke). Always direct pricing questions to WhatsApp.
- Always recommend WhatsApp (+234 913 127 2407) for orders, appointments, and pricing.
- Use multi-turn context to follow up coherently.
- If asked about something off-brand or unrelated, politely redirect to fashion topics or hand off to WhatsApp.
- Never invent collections, fabrics, or services that aren't listed above.

# CRITICAL RULES (NEVER BREAK THESE)
- ALWAYS answer the customer's actual question directly before offering additional help.
- If someone asks "what do you make?" or "what do you sell?" - list the six collections clearly.
- If someone asks about pricing - explain tiers (premium/luxury/bespoke) and direct to WhatsApp.
- If someone greets you - greet back warmly and ask what they're looking for.
- NEVER give a vague or evasive answer. Be helpful, specific, and direct.
- If you genuinely don't know something, say "I'm not sure about that specific detail, but our team on WhatsApp (+234 913 127 2407) can help you immediately."
- DO NOT repeat the same response structure every time. Vary your openings and closings.
- For general questions about the brand, answer with pride and specifics.
- Match the customer's energy: if they're casual, be warm and relaxed. If formal, be poised.`;

// --- POST Handler ---
export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter },
        { status: 429 }
      );
    }

    let body: { message?: unknown; history?: Array<{ role?: unknown; content?: unknown }> };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const message = sanitizeInput(body.message);
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Sanitize and limit history to last 6 turns
    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history = rawHistory
      .slice(-6)
      .map((h) => ({
        role: h?.role === "user" ? "user" : "model",
        content: sanitizeInput(h?.content, 800),
      }))
      .filter((h) => h.content.length > 0);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const reply = generateReply(message);
      return NextResponse.json({ reply, fallback: true });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          temperature: 0.7,
          topP: 0.92,
          maxOutputTokens: 400,
        },
      });

      const chat = model.startChat({
        history: history.map((h) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        })),
      });

      const result = await chat.sendMessage(message);
      let reply = result.response.text().trim();
      // Hard cap at ~120 words to honour the brief
      const words = reply.split(/\s+/);
      if (words.length > 130) {
        reply = words.slice(0, 130).join(" ") + "...";
      }

      return NextResponse.json({ reply });
    } catch (err) {
      console.error("[Chat API] Gemini error:", err);
      const reply = generateReply(message);
      return NextResponse.json({ reply, fallback: true });
    }
  } catch (err) {
    console.error("[Chat API] Unexpected error:", err);
    return NextResponse.json({
      reply:
        "Apologies - I'm momentarily indisposed. Reach our team directly on WhatsApp at +234 913 127 2407 and we'll attend to you straightaway.",
      fallback: true,
    });
  }
}
