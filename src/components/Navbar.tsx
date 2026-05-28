"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The home page has a dark hero at the top, so navbar can be transparent
  // until scroll. Inner pages have a cream/light background, so we need a
  // solid backdrop from the very top to keep nav links readable.
  const isHome = pathname === "/";
  const useSolidBg = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on route change
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        useSolidBg
          ? "bg-black/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.18)] border-b border-gold/15"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Amaka Fashion Atelier home">
            <Logo wordmarkClass="text-gold-light" showWordmark />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-7 lg:space-x-10">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[11px] uppercase tracking-[0.32em] font-medium transition-colors duration-300 py-2 ${
                    active
                      ? "text-gold"
                      : "text-cream/85 hover:text-gold"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button - high contrast pill */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden grid place-items-center min-h-[44px] min-w-[44px] rounded-full border border-gold/40 bg-black/60 backdrop-blur text-gold-light hover:bg-emerald hover:text-cream transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation - full-screen sheet for high contrast */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-50 overflow-y-auto"
            style={{
              backgroundColor: "#0F0F0F",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            {/* Top bar with brand + close button */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-gold/15 sticky top-0 bg-[#0F0F0F] z-10">
              <span className="font-heading text-sm font-semibold tracking-[0.28em] uppercase text-gold-light">
                Amaka <span className="italic font-light">Fashion</span> Atelier
              </span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="grid place-items-center h-11 w-11 rounded-full border border-gold/40 text-gold-light hover:bg-emerald hover:text-cream transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="px-6 pt-8 pb-12">
              <ul className="space-y-1">
                {navLinks.map((link, idx) => {
                  const active = pathname === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + idx * 0.04, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between border-b border-gold/15 py-5 text-lg font-semibold uppercase tracking-[0.28em] min-h-[56px] transition-colors ${
                          active
                            ? "text-gold"
                            : "text-cream hover:text-gold-light"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span
                          aria-hidden
                          className={`text-xs tracking-[0.4em] font-medium ${
                            active ? "text-gold" : "text-gold/40"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Bespoke enquiries CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 rounded-2xl border border-gold/25 bg-emerald-dark/40 p-5"
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70 font-medium">
                  Bespoke enquiries
                </p>
                <p className="mt-2 font-heading text-xl text-cream italic">
                  A piece is always closer than you think.
                </p>
                <a
                  href="https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier%2C%20I%27d%20like%20to%20enquire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-gold-light min-h-[44px]"
                  onClick={() => setIsOpen(false)}
                >
                  Book on WhatsApp
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
