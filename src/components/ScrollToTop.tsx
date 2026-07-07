"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Stack: WhatsApp (bottom-6) > ChatBot (bottom-24) > ScrollToTop (bottom-44)
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-44 right-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-charcoal text-cream shadow-lg ring-1 ring-gold/40 transition-all duration-300 hover:bg-black hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <ChevronUp size={22} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
