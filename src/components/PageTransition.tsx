"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Smooth fade + slight scale page entry, paired with a single gold sweep
 * curtain that wipes across the viewport on mount. Subtle, never showy.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <>
      {/* Gold sweep curtain */}
      <motion.div
        aria-hidden
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-0 z-[80] origin-left bg-gradient-to-r from-transparent via-gold/35 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -14, scale: 0.995 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
