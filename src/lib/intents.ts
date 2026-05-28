// Shared chatbot intents and keyword-based reply generation.
// Used by both the ChatBot client component (offline fallback) and the
// /api/chat server route. Keep replies under ~120 words; warm, knowledgeable,
// bespoke-sales-consultant tone.

export interface Intent {
  keywords: string[];
  reply: string;
}

export const intents: Intent[] = [
  {
    keywords: ["senator"],
    reply:
      "Senator Wear is the heart of our atelier. Think The Statesman in ivory with whisper-fine gold embroidery, The Diplomat in onyx black with tonal motifs, The Elder in deep navy. We hand-finish each piece in Italian wool blends and silk-cotton, cut for the Nigerian gentleman's silhouette. Shall I open a conversation on WhatsApp so we can plan your bespoke senator?",
  },
  {
    keywords: ["suit", "suits"],
    reply:
      "Our suits are built to command. Three-piece navy with gold buttons, a slim emerald with peak lapels, double-breasted charcoal in Italian wool - all bespoke and made-to-measure. Linings can carry a discreet Ankara print. The journey begins with a consultation; I'll connect you on WhatsApp at +234 913 127 2407 to book a fitting.",
  },
  {
    keywords: ["shirt"],
    reply:
      "We craft shirts in Egyptian cotton and French linen, with French cuffs, hidden plackets, or hand-stitched collars to your preference. Ankara-lined cuffs are a quiet favourite. Monogramming is included. Whisper your colour and occasion and I'll guide you - or message us on WhatsApp to begin.",
  },
  {
    keywords: ["traditional", "agbada", "native", "isiagu", "aso"],
    reply:
      "Our Traditional collection honours Igbo heritage and Nigerian ceremonial dress: hand-woven Aso-Oke isiagu, royal agbada with bullion gold thread, and ceremonial robes for chieftaincy and weddings. Each piece is paired with a matching cap. WhatsApp the team to start your bespoke commission.",
  },
  {
    keywords: ["casual"],
    reply:
      "Relaxed luxury: premium cotton kaftans, contemporary sets with subtle Igbo motifs, and agbada-inspired loungewear. Cut for movement, finished for elegance. Perfect for Sunday brunches, owambe afternoons, and anywhere you want to look effortless.",
  },
  {
    keywords: ["corporate", "office", "work", "boardroom"],
    reply:
      "Power dressing, the Amaka way. Structured shoulders, cleaner lapels, and African-print linings whispered inside the jacket. Tailored blazers, two-pieces, and boardroom suits in worsted Italian wool. Made to your measurements so authority sits on you naturally.",
  },
  {
    keywords: ["measure", "size", "fitting"],
    reply:
      "Our fitting journey is six steps: Consultation, Measurement, Fabric Selection, First Fitting, Adjustments, and Final Delivery. In-person at our Abakaliki atelier with complimentary refreshments, or guided over WhatsApp video for clients elsewhere. Ready to start? +234 913 127 2407.",
  },
  {
    keywords: ["appointment", "book", "visit"],
    reply:
      "We'd love to host you. Send a message to +234 913 127 2407 with your preferred date and the occasion you're dressing for. Studio hours: Mon-Fri 9-6, Sat 10-4, Sun by appointment. Booking 48 hours ahead lets us prepare swatches just for you.",
  },
  {
    keywords: ["price", "cost", "how much", "naira", "ngn"],
    reply:
      "Each garment is bespoke, so pricing follows the fabric and detailing you choose. Shirts begin in our premium tier; senator wear and suits are luxury; ceremonial agbada is fully bespoke. For an exact quote tailored to your vision, please WhatsApp us - we'll respond within minutes.",
  },
  {
    keywords: ["style", "advice", "recommend", "what should"],
    reply:
      "Tell me the moment you're dressing for and I'll suggest a starting point. Boardroom or wedding? Owambe or church Sunday? Daytime garden or candlelit reception? Each calls for a different fabric weight, palette, and silhouette - and we tailor every detail accordingly.",
  },
  {
    keywords: ["where", "location", "address"],
    reply:
      "Our atelier is in Abakaliki, Ebonyi State. Studio visits are by appointment so each gentleman receives our undivided attention. We deliver across Nigeria and ship internationally on request. Map and directions on the Contact page.",
  },
  {
    keywords: ["fabric", "material", "wool", "cotton", "linen", "silk"],
    reply:
      "We work with Italian wool (Loro Piana-grade for suits), Egyptian cotton (shirts), French linen (warm-weather pieces), hand-woven Aso-Oke (traditional), and silk blends (ceremonial linings). Each fabric is chosen for drape, durability, and how it moves with you. Want to feel a swatch? Visit the atelier or request a fabric kit on WhatsApp.",
  },
  {
    keywords: ["deliver", "shipping"],
    reply:
      "Nationwide delivery in branded garment bags - typically 3-5 business days. International shipping via courier on request. Rush options available; we'll never compromise the finish to meet a deadline though, so book early for big occasions.",
  },
  {
    keywords: ["wedding", "groom", "groomsmen"],
    reply:
      "Weddings are our craft at its finest. Three-piece bespoke for the groom, ceremonial agbada for the traditional rite, coordinated groomsmen packages with consistent cuts and colours. We start 8-12 weeks ahead - WhatsApp us with your date and I'll outline the timeline.",
  },
  {
    keywords: ["quality", "craftsmanship", "stitch"],
    reply:
      "Every piece is hand-finished: pick-stitched lapels, hand-rolled buttonholes, French seams, and silk linings cut on the bias. Master tailors with decades of practice quality-check each stage. We make fewer pieces, better.",
  },
  {
    keywords: ["time", "how long", "turnaround", "ready"],
    reply:
      "Shirts: 5-7 days. Suits and senator wear: 2-3 weeks. Heavily embroidered ceremonial pieces: 3-4 weeks. Rush is sometimes possible for an additional fee. Tell us your deadline on WhatsApp and we'll be honest about what's achievable.",
  },
  {
    keywords: ["heritage", "culture", "igbo", "nigerian"],
    reply:
      "We are rooted in Igbo craftsmanship - Abakaliki cotton, Aso-Oke weaving, and ceremonial dress traditions - reimagined for the gentleman who moves between worlds. Heritage isn't a costume here; it's the blueprint we tailor distinction onto.",
  },
  {
    keywords: ["help", "what can"],
    reply:
      "I can walk you through any of our six collections, explain our fitting process, talk fabrics, suggest pieces for a specific occasion, or hand you off to our team on WhatsApp for orders and appointments. What's on your mind?",
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    reply:
      "The pleasure is ours entirely. When you're ready to begin, the atelier is one WhatsApp message away. Dress well; live distinguished.",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later"],
    reply:
      "Until next time. Remember - elegance is never an accident. The atelier is here when you're ready.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings"],
    reply:
      "Welcome - I'm Dapper, your style consultant at Amaka Fashion Atelier. Ask me about senator wear, bespoke suits, traditional pieces, fabrics, fittings, or anything else. Where shall we begin?",
  },
];

export function generateReply(input: string): string {
  const lower = input.toLowerCase();
  for (const intent of intents) {
    if (
      intent.keywords.some((kw) => {
        // Allow multi-word keywords as-is, but otherwise enforce word boundaries
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = / /.test(kw)
          ? new RegExp(escaped)
          : new RegExp(`\\b${escaped}\\b`);
        return regex.test(lower);
      })
    ) {
      return intent.reply;
    }
  }
  return "I'd love to help. Try asking about our Senator Wear, Suits, Shirts, Casual, Traditional, or Corporate collections - or about fabrics, fittings, or pricing. For appointments, WhatsApp us at +234 913 127 2407.";
}

/**
 * Suggested quick-reply chips that surface after a bot response.
 * Returned ordering matters; we cycle through these to avoid repetition.
 */
export const QUICK_REPLIES: Array<{ id: string; label: string; prompt: string }> = [
  { id: "qr-senator", label: "Senator Wear", prompt: "Tell me about Senator Wear" },
  { id: "qr-suits", label: "Bespoke suits", prompt: "What suits do you offer?" },
  { id: "qr-fitting", label: "Book a fitting", prompt: "I'd like to book a fitting" },
  { id: "qr-fabric", label: "What fabrics?", prompt: "What fabrics do you use?" },
  { id: "qr-wedding", label: "Wedding options", prompt: "We have a wedding coming up - what do you suggest?" },
  { id: "qr-process", label: "Fitting process", prompt: "Walk me through your fitting process" },
];
