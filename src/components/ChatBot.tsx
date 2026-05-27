"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const WHATSAPP_URL =
  "https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier%2C%20I%27d%20like%20to%20inquire%20about%20your%20services";

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
    if (intent.keywords.some((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`);
      return regex.test(lower);
    })) {
      return intent.reply;
    }
  }
  return "Thank you for your interest in Amaka Fashion Atelier. I am not quite sure I understand that query, but I would love to help. You can ask me about our collections (Senator Wear, Suits, Shirts, Casual, Traditional, Corporate), appointments, sizing, pricing, delivery, or styling advice. Alternatively, reach out directly on WhatsApp for personalized assistance.";
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  from: "bot",
  text: "Welcome to Amaka Fashion Atelier! I am Dapper, your personal style consultant. How may I assist you today? Ask me about our collections, appointments, sizing, or styling advice.",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: makeId(), from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = generateReply(trimmed);
      const botMsg: Message = { id: makeId(), from: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Dapper style consultant chat"
        className="fixed bottom-24 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald shadow-lg transition-all duration-300 hover:bg-emerald-dark hover:-translate-y-0.5 hover:shadow-xl"
      >
        <span className="absolute inset-0 rounded-full border-2 border-gold/40" />
        {open ? (
          <X size={22} className="text-cream" />
        ) : (
          <MessageCircle size={22} className="text-cream" />
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-40 right-6 z-50 flex h-[min(520px,70vh)] w-[min(350px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-cream shadow-2xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 bg-emerald px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gold/20">
                  <Sparkles size={16} className="text-gold" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-cream">Dapper</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-cream/70">
                    Your Style Consultant
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full bg-cream/10 transition-colors hover:bg-cream/20"
              >
                <X size={14} className="text-cream" />
              </button>
            </header>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-sm bg-gold text-black"
                        : "rounded-bl-sm bg-emerald text-cream"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-emerald/80 px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cream [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cream [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cream" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-black/10 bg-white px-3 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our collections..."
                className="flex-1 rounded-full bg-cream px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-emerald"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="grid h-9 w-9 place-items-center rounded-full bg-emerald text-cream transition-colors hover:bg-emerald-dark disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
