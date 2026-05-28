"use client";

import { motion } from "framer-motion";
import { MessageSquare, PenTool, Scissors, Truck } from "lucide-react";

const STEPS = [
  {
    id: "consult",
    icon: MessageSquare,
    label: "Consultation",
    body:
      "We listen first. Your occasion, palette, silhouette, and the silhouettes you admire. Refreshments, never rushed.",
  },
  {
    id: "design",
    icon: PenTool,
    label: "Design",
    body:
      "Sketches, swatches, lining choices. The piece is drawn around you - never the other way around.",
  },
  {
    id: "craft",
    icon: Scissors,
    label: "Crafting",
    body:
      "Master tailors hand-finish each garment. Pick-stitched lapels, hand-rolled buttonholes, silk linings cut on the bias.",
  },
  {
    id: "deliver",
    icon: Truck,
    label: "Delivery",
    body:
      "Final fitting, then your piece arrives in our branded garment bag - delivered nationwide, hand-folded.",
  },
];

export default function ProcessSection() {
  return (
    <section className="relative bg-ivory py-20 md:py-28 grain-overlay">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
            The Atelier Way
          </p>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-semibold text-black">
            How a piece becomes <span className="italic text-emerald">yours</span>
          </h2>
          <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="relative rounded-2xl border border-black/5 bg-white p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  aria-hidden
                  className="absolute right-5 top-5 font-heading text-3xl italic text-gold/40"
                >
                  0{i + 1}
                </span>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald/10 text-emerald">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-black">
                  {s.label}
                </h3>
                <p className="mt-3 text-sm text-black/65 leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
