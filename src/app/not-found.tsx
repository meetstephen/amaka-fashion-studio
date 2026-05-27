"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <div className="font-heading text-8xl md:text-9xl font-bold text-emerald/20">
          404
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-black mt-4">
          Page Not Found
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <p className="mt-6 text-black/70 leading-relaxed">
          The page you are looking for does not exist or has been moved.
          Let us take you back to our collections.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-all duration-300 hover:bg-emerald-dark hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <Home size={16} />
            Back to Homepage
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
