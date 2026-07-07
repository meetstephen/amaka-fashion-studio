"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import {
  DEFAULT_TESTIMONIALS,
  getTestimonials,
  subscribeTestimonials,
  type Testimonial,
} from "@/lib/testimonials-store";

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage
    setItems(getTestimonials());
    return subscribeTestimonials((next) => setItems(next));
  }, []);

  // Hide the entire section until the owner has added real testimonials.
  if (items.length === 0) return null;

  return (
    <section className="relative bg-cream py-20 md:py-28 grain-overlay">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
            What gentlemen say
          </p>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-semibold text-black">
            Words from those who <span className="italic text-emerald">wear us</span>
          </h2>
          <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="relative rounded-2xl border border-black/5 bg-white p-7 shadow-sm hover:shadow-lg transition-shadow"
            >
              <Quote
                size={32}
                className="absolute -top-3 left-6 text-gold-light"
                aria-hidden
              />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={
                      idx < t.rating ? "fill-gold text-gold" : "text-black/15"
                    }
                  />
                ))}
              </div>
              <blockquote className="mt-4 font-heading text-lg leading-snug text-black italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-xs uppercase tracking-[0.22em] text-emerald">
                {t.name}
                <span className="mx-2 text-black/30">·</span>
                <span className="text-black/55">{t.location}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
