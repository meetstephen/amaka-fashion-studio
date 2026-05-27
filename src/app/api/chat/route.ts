import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// --- Keyword Matching Fallback ---
interface Intent {
  keywords: string[];
  reply: string;
}

const intents: Intent[] = [
  {
    keywords: ["senator"],
    reply:
      "Our Senator Wear collection is the pride of Amaka Fashion Atelier. We offer classic ivory senators with gold embroidery, contemporary black senators with subtle patterns, and rich navy options with traditional detailing. Each piece is hand-finished with premium fabrics. Shall I connect you on WhatsApp to discuss a bespoke senator piece?",
  },
  {
    keywords: ["suit", "suits"],
    reply:
      "Our bespoke suits are crafted for the man who commands every room he enters. We offer double-breasted charcoal wool, slim-fit emerald with peak lapels, and three-piece navy with gold buttons. The fitting process includes fabric selection, measurements, and two fitting sessions to ensure perfection. Prices start from consultation. Would you like to book a fitting?",
  },
  {
    keywords: ["shirt"],
    reply:
      "Our shirt collection blends classic tailoring with modern flair. From crisp white Oxford shirts with French cuffs to lightweight linen for tropical elegance, and even Ankara-inspired patterns for the bold gentleman. Every shirt can be customized with monogramming, choice of collar style, and cuff design. What occasion are you dressing for?",
  },
  {
    keywords: ["traditional", "agbada", "native"],
    reply:
      "Our Traditional Wear celebrates the rich heritage of Nigerian craftsmanship. The collection features hand-woven Isiagu with traditional caps, royal Agbada with intricate embroidery, and ceremonial attire with gold thread work. Each piece honors ancestral pride while embracing contemporary cuts. Perfect for chieftaincy events, weddings, and cultural celebrations.",
  },
  {
    keywords: ["casual"],
    reply:
      "For the gentleman who appreciates relaxed luxury, our Casual collection offers premium cotton kaftans, contemporary sets with Igbo motifs, and Agbada-inspired lounge wear. Comfort meets sophistication in every piece. Ideal for weekends, brunches, and informal gatherings where you still want to stand out.",
  },
  {
    keywords: ["corporate", "office", "work"],
    reply:
      "Command the boardroom with our Corporate collection. We tailor power suits with structured shoulders, blazers with matching trousers, and modern ensembles with African print linings for that subtle cultural statement. All made-to-measure so you project authority and confidence in every meeting.",
  },
  {
    keywords: ["measure", "size", "fitting"],
    reply:
      "Booking a fitting is simple. Visit our atelier in Abakaliki for an in-person session where we take precise measurements over a complimentary drink. For clients outside Abakaliki, we offer guided measurement sessions via WhatsApp video call. Every garment goes through at least two fitting rounds before completion. Send us a message on WhatsApp to schedule yours.",
  },
  {
    keywords: ["appointment", "book", "visit"],
    reply:
      "We would love to welcome you to our atelier! To book an appointment, simply reach out via WhatsApp at +234 913 127 2407. Our studio is open Monday to Friday 9AM-6PM, Saturday 10AM-4PM, and Sunday by appointment only. We recommend booking at least 2 days ahead so we can dedicate our full attention to you.",
  },
  {
    keywords: ["price", "cost", "how much"],
    reply:
      "At Amaka Fashion Atelier, pricing reflects the quality of materials and craftsmanship in each piece. Senator Wear starts from a premium range, suits are priced based on fabric selection, and shirts offer accessible luxury. For an accurate quote tailored to your preferences, please reach out on WhatsApp. Every piece is an investment in timeless style.",
  },
  {
    keywords: ["style", "advice", "recommend"],
    reply:
      "I would be happy to help with styling advice! For formal events, our Senator Wear or three-piece suits make a commanding statement. Corporate settings call for our tailored blazers and structured suits. Casual occasions pair perfectly with our premium kaftans. For weddings, consider our ceremonial Agbada or a custom suit. What occasion are you dressing for?",
  },
  {
    keywords: ["where", "location", "address"],
    reply:
      "Amaka Fashion Atelier is located in Abakaliki, Ebonyi State, Nigeria. Our atelier is where the magic happens, with skilled artisans bringing designs to life daily. Studio visits are by appointment to ensure you receive our undivided attention. We also offer nationwide delivery for clients across Nigeria.",
  },
  {
    keywords: ["fabric", "material"],
    reply:
      "We source only the finest fabrics for our creations. Our selection includes Italian wool for suits, premium Egyptian cotton for shirts, hand-woven Aso-Oke for traditional pieces, French linen for casual wear, and luxurious silk blends for special occasions. Each fabric is chosen for its drape, durability, and luxurious feel. Would you like guidance on fabric selection?",
  },
  {
    keywords: ["deliver", "shipping"],
    reply:
      "We deliver nationwide across Nigeria. Pieces are carefully packaged in premium garment bags to preserve their quality during transit. Delivery typically takes 3-5 business days depending on your location. Rush delivery options are available for time-sensitive orders. Every package is handled with the same care we put into crafting your garment.",
  },
  {
    keywords: ["wedding", "groom"],
    reply:
      "Congratulations! Our wedding and special occasion collection is designed to make the groom shine. We offer custom three-piece suits, traditional Agbada sets for the ceremony, and coordinated groomsmen packages. The process begins with a consultation to understand your wedding theme, followed by fabric selection and multiple fittings. Let us make your special day unforgettable.",
  },
  {
    keywords: ["quality", "craftsmanship"],
    reply:
      "Every piece from Amaka Fashion Atelier undergoes meticulous quality control. Our master tailors bring decades of experience to every stitch. We use reinforced seams, hand-finished buttonholes, and premium linings. Each garment is inspected at multiple stages to ensure it meets our exacting standards before it reaches you.",
  },
  {
    keywords: ["time", "how long", "turnaround"],
    reply:
      "Turnaround times vary by piece: shirts typically take 5-7 days, suits and Senator Wear 2-3 weeks, and elaborate traditional pieces with embroidery 3-4 weeks. Rush orders can sometimes be accommodated for an additional fee. We never compromise quality for speed. Contact us on WhatsApp with your timeline and we will do our best.",
  },
  {
    keywords: ["help", "what can"],
    reply:
      "I can assist you with exploring our collections (Senator Wear, Suits, Shirts, Casual, Traditional, Corporate), booking appointments, understanding our fitting process, fabric guidance, pricing information, delivery details, and styling advice for any occasion. Simply ask about what interests you, or reach out on WhatsApp for personalized service.",
  },
  {
    keywords: ["thank", "thanks"],
    reply:
      "The pleasure is entirely ours! At Amaka Fashion Atelier, we believe every gentleman deserves to look and feel exceptional. If you need anything else, I am here. You can also reach our team directly on WhatsApp for personalized assistance. Dress well, live well.",
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    reply:
      "It has been a pleasure assisting you. Remember, great style is not about following trends, it is about knowing who you are. When you are ready to elevate your wardrobe, Amaka Fashion Atelier is here. Wishing you a distinguished day ahead!",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    reply:
      "Welcome to Amaka Fashion Atelier! I am Dapper, your personal style consultant. I can help you explore our collections, book fittings, learn about fabrics, and much more. What would you like to know about today?",
  },
];

function generateReply(input: string): string {
  const lower = input.toLowerCase();
  for (const intent of intents) {
    if (
      intent.keywords.some((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`);
        return regex.test(lower);
      })
    ) {
      return intent.reply;
    }
  }
  return "Thank you for your interest in Amaka Fashion Atelier. I am not quite sure I understand that query, but I would love to help. You can ask me about our collections (Senator Wear, Suits, Shirts, Casual, Traditional, Corporate), appointments, sizing, pricing, delivery, or styling advice. Alternatively, reach out directly on WhatsApp for personalized assistance.";
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
