"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const TAP_THRESHOLD = 5;
const TAP_RESET_MS = 3000;

export default function Footer() {
  const router = useRouter();
  const tapCountRef = useRef(0);
  const [flash, setFlash] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Discrete owner entry point: tapping the copyright text
   * five times within three seconds opens the admin login.
   * No visible link or hint - just a tiny gold flash on each tap.
   */
  const handleSecretTap = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 220);

    tapCountRef.current += 1;
    if (tapCountRef.current >= TAP_THRESHOLD) {
      tapCountRef.current = 0;
      router.push("/admin/login");
      return;
    }
    // Reset window if no further taps within the threshold
    resetTimer.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TAP_RESET_MS);
  }, [router]);

  return (
    <footer className="relative bg-black text-cream grain-overlay">
      {/* Gold hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Logo wordmarkClass="text-gold-light" showWordmark showSubtitle />
            <p className="mt-5 md:mt-6 max-w-md text-sm text-cream/65 leading-relaxed">
              Bespoke menswear hand-finished in Abakaliki. We craft for the
              gentleman who walks between worlds with quiet authority.
            </p>
            <div className="mt-6 md:mt-7 flex flex-wrap gap-2">
              {[
                "Italian wool",
                "Egyptian cotton",
                "Aso-Oke",
                "French linen",
                "Hand-finished",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full border border-gold/25 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold/85"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.32em] text-gold mb-4 md:mb-5">
              Atelier
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/collections", label: "Collections" },
                { href: "/lookbook", label: "Lookbook" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-[44px] items-center text-cream/65 hover:text-gold transition-colors text-sm py-1"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Measurements CTA */}
            <div className="mt-5 pt-4 border-t border-cream/10">
              <Link
                href="/measurements"
                className="inline-flex min-h-[44px] items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium py-1"
              >
                <span className="inline-block w-4 h-4 border border-gold/60 rounded-sm text-center text-[9px] leading-4">&#x1F4CF;</span>
                Submit Measurements
              </Link>
            </div>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.32em] text-gold mb-4 md:mb-5">
              Find Us
            </h4>
            <address className="not-italic space-y-3 text-sm text-cream/65">
              <p>Abakaliki, Ebonyi State, Nigeria</p>
              <a
                href="https://wa.me/2349131272407"
                target="_blank"
                rel="noopener noreferrer"
                className="block min-h-[44px] py-1 hover:text-gold transition-colors"
              >
                WhatsApp · +234 913 127 2407
              </a>
              <a
                href="tel:+2349131272407"
                className="block min-h-[44px] py-1 hover:text-gold transition-colors"
              >
                Phone · +234 913 127 2407
              </a>
              <a
                href="mailto:lucynwoka959@gmail.com"
                className="block min-h-[44px] py-1 hover:text-gold transition-colors break-all"
              >
                Email · lucynwoka959@gmail.com
              </a>
              <p className="text-xs text-cream/45 pt-2 leading-relaxed">
                Mon - Fri · 9:00 AM - 6:00 PM
                <br />
                Sat · 10:00 AM - 4:00 PM
                <br />
                Sun · By appointment
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 md:mt-14 pt-7 md:pt-8 border-t border-cream/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[10px] uppercase tracking-[0.32em] text-cream/45">
          {/* Copyright text doubles as the discrete owner-entry tap pattern.
              Generous touch target for mobile thumbs; no visible hint. */}
          <button
            type="button"
            onClick={handleSecretTap}
            aria-label="Copyright"
            className={`relative inline-flex min-h-[44px] items-center text-left tracking-[0.32em] transition-colors duration-200 cursor-default select-none ${
              flash ? "text-gold" : "text-cream/45"
            }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            &copy; {new Date().getFullYear()} Amaka Fashion Atelier · All rights
            reserved.
            {/* Subtle gold flash sweep on tap - feedback for the owner only */}
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity duration-200 ${
                flash ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
          <p className="italic font-heading text-cream/65 normal-case tracking-normal text-sm sm:text-xs">
            Where heritage meets distinction.
          </p>
        </div>
      </div>
    </footer>
  );
}
