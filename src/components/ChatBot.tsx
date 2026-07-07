"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X, Phone } from "lucide-react";
import { generateReply, QUICK_REPLIES } from "@/lib/intents";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
  isAI?: boolean;
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  from: "bot",
  text:
    "Welcome to Amaka Fashion Atelier. I'm Dapper, your style consultant. How shall I dress your day - a senator, a suit, a ceremony?",
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

  // Build the rolling history window (last 6 user/bot turns) for the API
  const buildHistory = (current: Message[]) =>
    current
      .filter((m) => m.id !== "welcome")
      .slice(-6)
      .map((m) => ({
        role: m.from === "user" ? "user" : "model",
        content: m.text,
      }));

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: Message = { id: makeId(), from: "user", text: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: buildHistory(nextMessages),
        }),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const seconds = data.retryAfter || 60;
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            from: "bot",
            text: `Please give me ${seconds} seconds before your next message - I want to give each enquiry full attention.`,
          },
        ]);
        return;
      }

      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: makeId(), from: "bot", text: data.reply, isAI: !data.fallback },
      ]);
    } catch {
      // Network error -> local keyword fallback
      const reply = generateReply(trimmed);
      setMessages((prev) => [...prev, { id: makeId(), from: "bot", text: reply }]);
    } finally {
      setTyping(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Build a WhatsApp summary of the conversation for the "connect to human" CTA
  const whatsappHandoffUrl = (() => {
    const transcript = messages
      .filter((m) => m.id !== "welcome")
      .slice(-8)
      .map((m) => `${m.from === "user" ? "Me" : "Dapper"}: ${m.text}`)
      .join("\n");
    const intro = transcript
      ? `Hello Amaka Fashion Atelier - continuing my chat with Dapper:\n\n${transcript}\n\nCould a stylist take it from here?`
      : "Hello Amaka Fashion Atelier - I'd like to speak with a stylist.";
    return `https://wa.me/2349131272407?text=${encodeURIComponent(intro)}`;
  })();

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Dapper chat" : "Chat with Dapper"}
        aria-expanded={open}
        className="fixed bottom-24 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald shadow-lg transition-all duration-300 hover:bg-emerald-dark hover:-translate-y-0.5 hover:shadow-xl"
      >
        <span className="absolute inset-0 rounded-full border-2 border-gold/40" />
        {open ? (
          <X size={22} className="text-cream" />
        ) : (
          <MessageCircle size={22} className="text-cream" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            // Mobile: nearly full-screen bottom sheet. Desktop: anchored card.
            className="
              fixed z-50 flex flex-col overflow-hidden border border-black/10 bg-cream shadow-2xl
              left-2 right-2 bottom-2 top-24 rounded-3xl
              sm:left-auto sm:right-6 sm:bottom-40 sm:top-auto
              sm:h-[min(560px,72vh)] sm:w-[min(380px,calc(100vw-3rem))]
              sm:rounded-2xl
            "
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 bg-emerald px-4 py-3 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gold/20">
                  <Sparkles size={16} className="text-gold-light" />
                </div>
                <div className="leading-tight">
                  <div className="font-heading text-base font-semibold text-cream">
                    Dapper
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-gold-light/80">
                    Style Consultant · Online
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
              >
                <X size={16} />
              </button>
            </header>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
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
                    {m.from === "bot" && m.isAI && (
                      <span
                        className="ml-1.5 inline-flex items-center align-middle"
                        title="AI-powered"
                      >
                        <Sparkles size={10} className="text-gold-light" />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-emerald/85 px-4 py-2.5">
                    <Sparkles size={12} className="animate-[pulse-soft_2.4s_ease-in-out_infinite] text-gold-light" />
                    <span className="text-[11px] uppercase tracking-[0.22em] text-cream/80">
                      Dapper is thinking
                    </span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cream [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cream [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cream" />
                    </span>
                  </div>
                </div>
              )}

              {/* Quick reply chips - shown when not typing and last message is from bot */}
              {!typing && messages.at(-1)?.from === "bot" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.slice(0, 4).map((qr) => (
                    <button
                      key={qr.id}
                      type="button"
                      onClick={() => sendMessage(qr.prompt)}
                      className="rounded-full border border-emerald/30 bg-white px-3 py-1.5 text-[11px] font-medium text-emerald hover:border-emerald hover:bg-emerald hover:text-cream transition-colors"
                    >
                      {qr.label}
                    </button>
                  ))}
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
                placeholder="Ask about a piece, fabric, or fitting..."
                inputMode="text"
                autoComplete="off"
                aria-label="Type a message to Dapper"
                className="flex-1 rounded-full bg-cream px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-emerald"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="grid h-10 w-10 place-items-center rounded-full bg-emerald text-cream transition-colors hover:bg-emerald-dark disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </form>

            {/* Connect to human */}
            <a
              href={whatsappHandoffUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-t border-black/10 bg-emerald-dark px-3 py-2.5 text-[11px] uppercase tracking-[0.22em] text-gold-light hover:bg-emerald transition-colors"
            >
              <Phone size={12} />
              Connect to a human stylist on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
