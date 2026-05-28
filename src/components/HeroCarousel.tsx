"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSlide {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  gradient: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: "heritage",
    eyebrow: "Where Heritage Meets Distinction",
    title: (
      <>
        Amaka Fashion
        <br />
        <span className="italic text-gold">Atelier</span>
      </>
    ),
    subtitle:
      "Bespoke menswear from Abakaliki - hand-finished, deeply rooted, quietly luxurious. The blueprint of the modern Nigerian gentleman.",
    ctaLabel: "Explore Collections",
    ctaHref: "/collections",
    secondaryLabel: "Book Appointment",
    secondaryHref:
      "https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier%2C%20I%27d%20like%20to%20book%20an%20appointment",
    gradient: "from-emerald via-emerald-dark to-black",
  },
  {
    id: "senator",
    eyebrow: "Flagship · Senator Wear",
    title: (
      <>
        The garment of <span className="italic text-gold">statesmen</span>
      </>
    ),
    subtitle:
      "Italian wool blends, silk-cotton, hand-laid gold accents. Cut for the man who shapes rooms simply by entering them.",
    ctaLabel: "View Senator Wear",
    ctaHref: "/collections",
    secondaryLabel: "Speak to a Stylist",
    secondaryHref:
      "https://wa.me/2349131272407?text=Hello%2C%20I%27d%20like%20to%20discuss%20a%20Senator%20piece",
    gradient: "from-emerald-dark via-black to-emerald",
  },
  {
    id: "wedding",
    eyebrow: "Wedding & Ceremony",
    title: (
      <>
        Dress the day they will <span className="italic text-gold">remember</span>
      </>
    ),
    subtitle:
      "Three-piece bespoke. Royal agbada with bullion gold thread. Coordinated groomsmen packages. We start eight to twelve weeks ahead.",
    ctaLabel: "Plan a Wedding Suite",
    ctaHref:
      "https://wa.me/2349131272407?text=Hello%21%20I%27d%20like%20to%20plan%20a%20wedding%20suite",
    secondaryLabel: "Browse Lookbook",
    secondaryHref: "/lookbook",
    gradient: "from-black via-emerald-dark to-emerald-dark",
  },
];

const ROTATE_MS = 6000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(t);
  }, [paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setActive((i) => (i + 1) % SLIDES.length);
      else setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length);
    }
    startX.current = null;
    setPaused(false);
  };

  const slide = SLIDES[active];

  return (
    <section
      className="relative isolate min-h-[100svh] flex items-center overflow-hidden grain-overlay"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* Slide background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
          aria-hidden
        />
      </AnimatePresence>

      {/* Decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-emerald-light/15 blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
            role="group"
            aria-roledescription="slide"
            aria-label={`${active + 1} of ${SLIDES.length}`}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.32em] text-cream/85 backdrop-blur">
              <Sparkles size={12} className="text-gold" />
              {slide.eyebrow}
            </span>

            <h1 className="mt-8 font-heading text-5xl md:text-7xl font-semibold leading-[1.05] text-cream">
              {slide.title}
            </h1>

            <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold via-gold to-transparent" />

            <p className="mt-7 max-w-xl text-base md:text-lg leading-relaxed text-cream/80">
              {slide.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={slide.ctaHref}
                target={slide.ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={slide.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-black transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-lg min-h-[48px]"
              >
                {slide.ctaLabel} <ArrowRight size={14} />
              </Link>
              <Link
                href={slide.secondaryHref}
                target={slide.secondaryHref.startsWith("http") ? "_blank" : undefined}
                rel={slide.secondaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-all hover:border-gold hover:text-gold hover:-translate-y-0.5 min-h-[48px]"
              >
                {slide.secondaryLabel}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? "w-10 bg-gold"
                : "w-5 bg-cream/40 hover:bg-cream/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
