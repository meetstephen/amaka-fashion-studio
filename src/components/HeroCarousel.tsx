"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
  /** Editorial right-column data (desktop only) */
  portraitGradient: string;
  portraitLabel: string;
  fabricName: string;
  fabricOrigin: string;
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
    portraitGradient: "from-emerald via-emerald-dark to-black",
    portraitLabel: "The Atelier · Heritage",
    fabricName: "Italian Wool",
    fabricOrigin: "Premium · 14oz",
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
      "Italian wool in conversation with ancestral cadence. Cut for the man whose silence speaks before he does - and whose presence settles the room.",
    ctaLabel: "View Senator Wear",
    ctaHref: "/collections",
    secondaryLabel: "Speak to a Stylist",
    secondaryHref:
      "https://wa.me/2349131272407?text=Hello%2C%20I%27d%20like%20to%20discuss%20a%20Senator%20piece",
    gradient: "from-emerald-dark via-black to-emerald",
    portraitGradient: "from-emerald-dark via-black to-emerald-dark",
    portraitLabel: "Senator · Statesman",
    fabricName: "Aso-Oke",
    fabricOrigin: "Hand-Woven · Abakaliki",
  },
  {
    id: "wedding",
    eyebrow: "The Wedding House",
    title: (
      <>
        An heirloom, <span className="italic text-gold">in the making</span>
      </>
    ),
    subtitle:
      "From the first muslin to the final hand-finished buttonhole, we weave heritage into every thread - bullion-gold agbada, three-piece bespoke, groomsmen perfectly attuned. We begin eight to twelve weeks before the day.",
    ctaLabel: "Begin a Wedding Suite",
    ctaHref:
      "https://wa.me/2349131272407?text=Hello%21%20I%27d%20like%20to%20begin%20a%20wedding%20suite",
    secondaryLabel: "View the Lookbook",
    secondaryHref: "/lookbook",
    gradient: "from-black via-emerald-dark to-emerald-dark",
    portraitGradient: "from-black via-emerald-dark to-emerald",
    portraitLabel: "Wedding · Ceremony",
    fabricName: "Bullion Gold",
    fabricOrigin: "24K Thread · Hand-Laid",
  },
];

const ROTATE_MS = 6000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const [slidePhotos, setSlidePhotos] = useState<Record<string, string>>({});

  // Tilt motion values for the editorial right column
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 80, damping: 15 });
  const springY = useSpring(tiltY, { stiffness: 80, damping: 15 });
  const rotateY = useTransform(springX, [-1, 1], [-6, 6]);
  const rotateX = useTransform(springY, [-1, 1], [4, -4]);

  useEffect(() => {
    async function loadHeroPhotos() {
      if (!isSupabaseConfigured() || !supabase) return;
      const { data, error } = await supabase
        .from("images")
        .select("name, url")
        .eq("category", "hero");
      if (error || !data) return;

      const map: Record<string, string> = {};
      for (const s of SLIDES) {
        const match = data.find(
          (row) =>
            row.url &&
            typeof row.name === "string" &&
            row.name.toLowerCase().includes(s.id)
        );
        if (match?.url) map[s.id] = match.url;
      }
      setSlidePhotos(map);
    }
    loadHeroPhotos();
  }, []);

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

  const onPortraitMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(x * 2);
    tiltY.set(y * 2);
  };
  const onPortraitLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const slide = SLIDES[active];
  const photoUrl = slidePhotos[slide.id];

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
          className={"absolute inset-0 bg-cover bg-center " + (photoUrl ? "" : "bg-gradient-to-br " + slide.gradient)}
          style={photoUrl ? { backgroundImage: "url(" + JSON.stringify(photoUrl) + ")" } : undefined}
          aria-hidden
        />
      </AnimatePresence>

      {photoUrl && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/55"
        />
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT: copy column */}
          <div className="md:col-span-7 lg:col-span-7">
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
                  <Link href={slide.ctaHref} target={slide.ctaHref.startsWith("http") ? "_blank" : undefined} rel={slide.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-black transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-lg min-h-[48px]">
                    {slide.ctaLabel} <ArrowRight size={14} />
                  </Link>
                  <Link href={slide.secondaryHref} target={slide.secondaryHref.startsWith("http") ? "_blank" : undefined} rel={slide.secondaryHref.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-all hover:border-gold hover:text-gold hover:-translate-y-0.5 min-h-[48px]">
                    {slide.secondaryLabel}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: editorial column - desktop only */}
          <div
            className="hidden md:block md:col-span-5 lg:col-span-5"
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="relative mx-auto w-full max-w-[380px]"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={onPortraitMove}
              onMouseLeave={onPortraitLeave}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5 }}
            >
              {/* Portrait card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-gold/30 bg-gradient-to-br ${slide.portraitGradient} shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]`}
                >
                  {/* Inner gold-ring frame */}
                  <div
                    aria-hidden
                    className="absolute inset-3 border border-gold/15 pointer-events-none"
                  />

                  {/* Soft vignette */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"
                  />

                  {/* Subtle vertical hairlines (editorial spread feel) */}
                  <div
                    aria-hidden
                    className="absolute inset-y-6 left-8 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-y-6 right-8 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent"
                  />

                  {/* Center monogram */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="font-heading italic text-gold/30 text-7xl select-none">
                      A
                    </div>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.32em] text-gold/80 mb-1">
                        Edition · MMXXIV
                      </p>
                      <p className="font-heading text-cream text-lg leading-tight">
                        {slide.portraitLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-[0.32em] text-cream/50">
                        Plate
                      </p>
                      <p className="font-heading text-gold text-base tabular-nums">
                        0{active + 1}
                        <span className="text-cream/40">/</span>0{SLIDES.length}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating fabric swatch card - top right */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`fabric-${slide.id}`}
                  initial={{ opacity: 0, x: 12, y: -8 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transform: "translateZ(40px)" }}
                  className="absolute -right-3 top-10 lg:-right-6 w-[160px] rounded-sm border border-gold/40 bg-cream/95 backdrop-blur-sm p-3 shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      aria-hidden
                      className={`h-6 w-6 rounded-full bg-gradient-to-br ${slide.portraitGradient} ring-1 ring-gold/40`}
                    />
                    <p className="text-[8px] uppercase tracking-[0.28em] text-emerald-dark">
                      Fabric
                    </p>
                  </div>
                  <p className="font-heading text-emerald-dark text-sm leading-tight">
                    {slide.fabricName}
                  </p>
                  <p className="text-[10px] text-emerald-dark/65 mt-0.5">
                    {slide.fabricOrigin}
                  </p>
                  <div className="mt-2 h-px bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0" />
                </motion.div>
              </AnimatePresence>

              {/* Atelier stamp - bottom left, slowly rotating gold ring */}
              <div
                style={{ transform: "translateZ(60px)" }}
                className="absolute -left-4 -bottom-4 lg:-left-8 lg:-bottom-6 h-24 w-24"
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
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="rgba(201,169,97,0.55)"
                      strokeWidth="1"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="rgba(15,15,15,0.92)"
                      stroke="rgba(201,169,97,0.4)"
                      strokeWidth="0.5"
                    />
                    <text
                      fill="#C9A961"
                      fontSize="7.5"
                      fontFamily="var(--font-jost), sans-serif"
                      letterSpacing="2.4"
                    >
                      <textPath href="#atelier-stamp-circle" startOffset="0">
                        AFA · ATELIER · EST · MMXXIV ·
                      </textPath>
                    </text>
                  </svg>
                </motion.div>
                {/* Static center monogram */}
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <span className="font-heading italic text-gold text-2xl">
                    A
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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