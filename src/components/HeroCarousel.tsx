"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_href: string;
  secondary_label: string;
  secondary_href: string;
  fabric_name: string;
  fabric_origin: string;
  photoUrl: string | null;
}

const ROTATE_MS = 6000;
const FALLBACK_GRADIENT = "from-emerald via-emerald-dark to-black";

export default function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[] | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    async function loadSlides() {
      if (!isSupabaseConfigured() || !supabase) return;
      const { data, error } = await supabase
        .from("hero_slides")
        .select(
          "id, eyebrow, title, subtitle, cta_label, cta_href, secondary_label, secondary_href, fabric_name, fabric_origin, images(url)"
        )
        .order("sort_order");
      if (error || !data) return;
      setSlides(
        data.map((row: Record<string, unknown>) => ({
          id: row.id as string,
          eyebrow: (row.eyebrow as string) ?? "",
          title: (row.title as string) ?? "",
          subtitle: (row.subtitle as string) ?? "",
          cta_label: (row.cta_label as string) ?? "Explore Collections",
          cta_href: (row.cta_href as string) ?? "/collections",
          secondary_label: (row.secondary_label as string) ?? "",
          secondary_href: (row.secondary_href as string) ?? "",
          fabric_name: (row.fabric_name as string) ?? "",
          fabric_origin: (row.fabric_origin as string) ?? "",
          photoUrl: (row.images as { url: string | null } | null)?.url ?? null,
        }))
      );
    }
    loadSlides();
  }, []);

  useEffect(() => {
    if (paused || !slides || slides.length < 2) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(t);
  }, [paused, slides]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null || !slides) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setActive((i) => (i + 1) % slides.length);
      else setActive((i) => (i - 1 + slides.length) % slides.length);
    }
    startX.current = null;
    setPaused(false);
  };

  if (!slides || slides.length === 0) {
    return (
      <section className="relative isolate min-h-[100svh] flex items-center overflow-hidden grain-overlay bg-gradient-to-br from-emerald via-emerald-dark to-black">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl md:text-7xl font-semibold text-cream">
            Amaka Fashion Atelier
          </h1>
        </div>
      </section>
    );
  }

  const slide = slides[active];

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
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={"absolute inset-0 bg-cover bg-center " + (slide.photoUrl ? "" : "bg-gradient-to-br " + FALLBACK_GRADIENT)}
          style={slide.photoUrl ? { backgroundImage: "url(" + JSON.stringify(slide.photoUrl) + ")" } : undefined}
          aria-hidden
        />
      </AnimatePresence>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-emerald-light/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
            role="group"
            aria-roledescription="slide"
            aria-label={`${active + 1} of ${slides.length}`}
          >
            {slide.eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.32em] text-cream/85 backdrop-blur">
                <Sparkles size={12} className="text-gold" />
                {slide.eyebrow}
              </span>
            )}

            <h1 className="mt-8 font-heading text-5xl md:text-7xl font-semibold leading-[1.05] text-cream">
              {slide.title}
            </h1>

            <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold via-gold to-transparent" />

            {slide.subtitle && (
              <p className="mt-7 max-w-xl text-base md:text-lg leading-relaxed text-cream/80">
                {slide.subtitle}
              </p>
            )}

            {(slide.fabric_name || slide.fabric_origin) && (
              <p className="mt-4 text-xs uppercase tracking-[0.28em] text-gold/80">
                {slide.fabric_name}
                {slide.fabric_name && slide.fabric_origin ? " · " : ""}
                {slide.fabric_origin}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {slide.cta_label && (
                <Link href={slide.cta_href || "/collections"} target={slide.cta_href?.startsWith("http") ? "_blank" : undefined} rel={slide.cta_href?.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-black transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-lg min-h-[48px]">
                  {slide.cta_label} <ArrowRight size={14} />
                </Link>
              )}
              {slide.secondary_label && (
                <Link href={slide.secondary_href || "/"} target={slide.secondary_href?.startsWith("http") ? "_blank" : undefined} rel={slide.secondary_href?.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-all hover:border-gold hover:text-gold hover:-translate-y-0.5 min-h-[48px]">
                  {slide.secondary_label}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        aria-hidden
        className="hidden md:block absolute -left-6 -bottom-6 h-24 w-24 opacity-90"
      >
        <motion.div
          className="relative h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <defs>
              <path
                id="atelier-stamp-circle"
                d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              />
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(201,169,97,0.55)" strokeWidth="1" />
            <circle cx="50" cy="50" r="40" fill="rgba(15,15,15,0.92)" stroke="rgba(201,169,97,0.4)" strokeWidth="0.5" />
            <text fill="#C9A961" fontSize="7.5" fontFamily="var(--font-jost), sans-serif" letterSpacing="2.4">
              <textPath href="#atelier-stamp-circle" startOffset="0">
                AFA · ATELIER · EST · MMXXIV ·
              </textPath>
            </text>
          </svg>
        </motion.div>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <span className="font-heading italic text-gold text-2xl">A</span>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-10 bg-gold" : "w-5 bg-cream/40 hover:bg-cream/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}