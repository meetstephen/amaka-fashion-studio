"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";

const PREFILL =
  "Hello%20Amaka%20Fashion%20Atelier!%20Please%20subscribe%20me%20to%20your%20updates%20on%20new%20collections.";

interface NewsletterCTAProps {
  variant?: "dark" | "light";
}

export default function NewsletterCTA({ variant = "dark" }: NewsletterCTAProps) {
  const dark = variant === "dark";
  return (
    <section
      className={`relative grain-overlay ${
        dark
          ? "bg-gradient-to-br from-emerald-dark via-emerald-dark to-black text-cream"
          : "bg-ivory text-black"
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p
            className={`text-[10px] uppercase tracking-[0.42em] ${
              dark ? "text-gold/80" : "text-emerald"
            } font-medium`}
          >
            The Atelier Letter
          </p>
          <h2
            className={`mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-semibold ${
              dark ? "text-cream" : "text-black"
            }`}
          >
            Be the first to see <span className="italic text-gold">new pieces</span>
          </h2>
          <p
            className={`mx-auto mt-5 max-w-xl text-sm md:text-base ${
              dark ? "text-cream/70" : "text-black/65"
            } leading-relaxed`}
          >
            We send a quiet note when a fresh collection drops, when fitting slots
            open, and when the season changes. No noise, only news that matters.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`https://wa.me/2349131272407?text=${PREFILL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-black transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Mail size={14} />
              Subscribe via WhatsApp
            </Link>
            <Link
              href="/contact"
              className={`inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] transition-all ${
                dark
                  ? "border-cream/30 text-cream hover:border-gold hover:text-gold"
                  : "border-black/15 text-black/70 hover:border-emerald hover:text-emerald"
              }`}
            >
              Or send a message
            </Link>
          </div>

          <p
            className={`mt-6 text-[10px] uppercase tracking-[0.32em] ${
              dark ? "text-cream/40" : "text-black/40"
            }`}
          >
            Discreet. Unsubscribe with one word.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
