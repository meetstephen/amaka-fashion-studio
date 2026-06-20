"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedSection from "@/components/FeaturedSection";
import CollectionsGrid from "@/components/CollectionsGrid";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterCTA from "@/components/NewsletterCTA";
import { fadeInLeft, fadeInRight } from "@/lib/animations";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      {/* Featured image / season block */}
      <FeaturedSection />

      {/* Featured Collections Grid */}
      <CollectionsGrid />

      <ProcessSection />

      {/* Brand Story Teaser */}
      <section className="py-20 md:py-32 bg-black grain-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[10px] uppercase tracking-[0.42em] text-gold font-medium">
                Our Heritage
              </p>
              <h2 className="mt-4 font-heading text-4xl md:text-5xl font-semibold text-cream">
                Where tradition meets <span className="italic text-gold">modern luxury</span>
              </h2>
              <div className="mt-6 h-px w-16 bg-gradient-to-r from-gold to-transparent" />
              <p className="mt-6 text-cream/75 leading-relaxed">
                From our atelier in Abakaliki, Ebonyi State, we craft garments
                rooted in Igbo sartorial tradition and finished for the
                gentleman of today. Every stitch is a quiet conversation between
                heritage and the present moment.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold transition-colors hover:text-gold-light min-h-[44px]"
              >
                Read Our Story <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald via-emerald-dark to-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-7xl font-semibold text-gold italic">
                    A
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.42em] text-cream/65">
                    Amaka Atelier
                  </div>
                  <div className="mt-1 text-[9px] tracking-[0.5em] text-gold/60">
                    EST · MMXXIV
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-3xl border border-gold/30" />
            </motion.div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <NewsletterCTA />
    </>
  );
}
