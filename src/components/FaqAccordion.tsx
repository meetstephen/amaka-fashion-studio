"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does a bespoke order begin?",
    a: "Send us a WhatsApp message at +234 913 127 2407 with the occasion and your preferred date. We'll book a consultation - in-person at our Abakaliki atelier, or guided over WhatsApp video. From there it's measurement, fabric selection, and fittings.",
  },
  {
    q: "What's the typical turnaround time?",
    a: "Shirts run 5-7 days. Suits and senator wear 2-3 weeks. Heavily embroidered ceremonial pieces 3-4 weeks. For weddings and big occasions, we recommend booking 8-12 weeks ahead so nothing is rushed.",
  },
  {
    q: "Can you tailor for clients outside Abakaliki?",
    a: "Yes - we serve gentlemen across Nigeria and internationally. Our remote process uses guided WhatsApp video for measurements, then we ship in branded garment bags. International couriers available on request.",
  },
  {
    q: "Do you offer fabric options I can feel before deciding?",
    a: "Absolutely. Visit the atelier to handle our full library, or request a curated fabric kit by post. For first-time clients, we'll send three to five swatches matched to your brief.",
  },
  {
    q: "How is pricing structured?",
    a: "Each garment is bespoke, so pricing follows the fabric and detailing you choose. Shirts begin in our premium tier; senator wear and suits sit in luxury; ceremonial agbada is fully bespoke. WhatsApp us for an exact quote tailored to your vision.",
  },
  {
    q: "Can I commission a coordinated look for my groomsmen?",
    a: "Yes - this is one of our specialities. We'll align silhouettes, fabrics, and finishing across the entire party so every man looks distinct yet unified. Plan 8-12 weeks ahead for best results.",
  },
];

export default function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-sm divide-y divide-black/10">
      {FAQS.map((item, idx) => {
        const open = openIdx === idx;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : idx)}
              aria-expanded={open}
              aria-controls={`faq-panel-${idx}`}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left min-h-[60px]"
            >
              <span className="font-heading text-lg text-black">
                {item.q}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-emerald transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`faq-panel-${idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm text-black/70 leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
