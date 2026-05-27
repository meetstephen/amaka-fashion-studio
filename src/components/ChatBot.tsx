"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
  isAI?: boolean;
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

import { generateReply } from "@/lib/intents";

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

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: makeId(), from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.status === 429) {
        const data = await res.json();
        const seconds = data.retryAfter || 60;
        const botMsg: Message = {
          id: makeId(),
          from: "bot",
          text: `Please wait ${seconds} seconds before sending another message.`,
        };
        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      const botMsg: Message = {
        id: makeId(),
        from: "bot",
        text: data.reply,
        isAI: !data.fallback,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Network error or fetch failure - fall back to local keyword matching
      const reply = generateReply(trimmed);
      const botMsg: Message = { id: makeId(), from: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setTyping(false);
    }
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
                    {m.from === "bot" && m.isAI && (
                      <span className="ml-1.5 inline-flex items-center align-middle" title="AI-powered response">
                        <Sparkles size={10} className="text-gold" />
                      </span>
                    )}
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
