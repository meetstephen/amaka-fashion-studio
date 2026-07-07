"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center bg-black text-cream px-5 py-20 sm:px-6 overflow-hidden grain-overlay">
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-emerald-light/15 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.32em] text-cream/85 backdrop-blur">
          <span className="h-1 w-1 rounded-full bg-gold" />
          Off the cutting table
        </span>

        {/* Editorial 404 number */}
        <div className="relative mt-8 sm:mt-10">
          <h1 className="font-heading italic font-light leading-[0.85] text-[clamp(7rem,30vw,12rem)] tracking-tight bg-gradient-to-b from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
            404
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="origin-center mt-4 mx-auto h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
        </div>

        {/* Poetic line */}
        <p className="mt-7 sm:mt-8 font-heading italic text-2xl sm:text-3xl leading-snug text-cream">
          This page took a different cut.
        </p>

        <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-cream/65 max-w-md mx-auto">
          The thread you followed has ended. Let&apos;s take you back to the atelier
          floor, where every piece begins.
        </p>

        {/* CTAs - mobile-first stack, expand to row on larger screens */}
        <div className="mt-9 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center items-stretch sm:items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-black transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-lg min-h-[48px]"
          >
            Return to Atelier <ArrowRight size={14} />
          </Link>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-all hover:border-gold hover:text-gold hover:-translate-y-0.5 min-h-[48px]"
          >
            Browse Collections
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
