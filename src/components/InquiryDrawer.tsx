"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, X, Send } from "lucide-react";
import {
  buildInquiryWhatsappUrl,
  clearAll,
  getItems,
  removeItem,
  subscribe,
  type InquiryItem,
} from "@/lib/inquiry-store";

export default function InquiryDrawer() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage
    setItems(getItems());
    const unsub = subscribe((next) => {
      setItems(next);
      setPulse(true);
      const t = window.setTimeout(() => setPulse(false), 700);
      return () => window.clearTimeout(t);
    });
    return unsub;
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (items.length === 0 && !open) return null;

  const url = buildInquiryWhatsappUrl(items);

  return (
    <>
      {/* Floating gold pill trigger - bottom-left to avoid WhatsApp/chat clusters */}
      {items.length > 0 && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open inquiry list (${items.length} items)`}
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: pulse ? [1, 1.08, 1] : 1,
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed bottom-24 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-black shadow-xl hover:bg-gold-light transition-colors"
        >
          <ShoppingBag size={16} />
          Inquiry
          <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-black px-1.5 text-[11px] text-gold">
            {items.length}
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Inquiry list"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl sm:max-w-md"
            >
              {/* Header */}
              <header className="flex items-center justify-between border-b border-black/10 bg-emerald px-5 py-5 text-cream">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-gold-light">
                    Bespoke
                  </p>
                  <h2 className="font-heading text-2xl font-semibold mt-1">
                    Your Inquiry
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close inquiry"
                  className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </header>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <div className="grid h-full place-items-center text-center text-black/55">
                    <div>
                      <p className="font-heading text-xl italic">Nothing here yet.</p>
                      <p className="mt-2 text-sm">
                        Browse the collections and tap &ldquo;Add to Inquiry&rdquo;
                        on any piece you&rsquo;d like to discuss.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {items.map((it) => (
                        <motion.li
                          key={it.id}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 24 }}
                          transition={{ duration: 0.22 }}
                          className="rounded-xl border border-black/5 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.28em] text-emerald">
                                {it.category}
                              </p>
                              <h3 className="mt-1 font-heading text-lg font-semibold text-black">
                                {it.name}
                              </h3>
                              {it.description && (
                                <p className="mt-1 text-xs text-black/55 line-clamp-2">
                                  {it.description}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(it.id)}
                              aria-label={`Remove ${it.name}`}
                              className="grid h-9 w-9 place-items-center rounded-full text-red-600/80 hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {/* Footer CTA */}
              {items.length > 0 && (
                <footer className="space-y-3 border-t border-black/10 bg-white px-5 py-4">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald px-5 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-cream hover:bg-emerald-dark transition-colors min-h-[48px]"
                  >
                    <Send size={16} />
                    Send Inquiry on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => clearAll()}
                    className="w-full text-center text-[11px] uppercase tracking-[0.2em] text-black/50 hover:text-black/70 transition-colors min-h-[44px]"
                  >
                    Clear all
                  </button>
                </footer>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
