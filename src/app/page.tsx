"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterCTA from "@/components/NewsletterCTA";
import { EditPencil } from "@/components/AdminEditOverlay";
import {
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

const featuredCollections = [
  {
    name: "Senator Wear",
    line: "The garment of statesmen.",
    gradient: "from-emerald to-emerald-dark",
  },
  {
    name: "Bespoke Suits",
    line: "A second skin in worsted wool.",
    gradient: "from-emerald-dark to-black",
  },
  {
    name: "Shirts",
    line: "Egyptian cotton. French linen.",
    gradient: "from-black to-emerald",
  },
  {
    name: "Casual",
    line: "Off-duty, never off-form.",
    gradient: "from-emerald-light to-emerald",
  },
  {
    name: "Traditional",
    line: "Heritage rendered in thread.",
    gradient: "from-emerald to-black",
  },
  {
    name: "Corporate",
    line: "Authority, lined in Ankara.",
    gradient: "from-black to-emerald-dark",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      {/* Featured image / season block */}
      <section className="relative bg-black grain-overlay">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[16/9] w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald via-emerald-dark to-black" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex items-end justify-start p-8 md:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <p className="text-[10px] uppercase tracking-[0.42em] text-gold font-medium">
                    Featured · This Season
                  </p>
                  <EditPencil href="/admin/featured" label="Edit featured" />
                </div>
                <h2 className="mt-4 font-heading text-3xl md:text-5xl font-semibold text-cream">
                  The Harmattan Edit
                </h2>
                <p className="mt-3 max-w-lg text-cream/75 text-sm md:text-base leading-relaxed">
                  Cooler weights of Italian wool. Earth-toned silks. The pieces we
                  reach for as the dust rises and the season turns inward.
                </p>
                <Link
                  href="/collections"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-black transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-lg min-h-[44px]"
                >
                  Discover the Edit <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="py-20 md:py-32 bg-cream grain-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
              Six Houses, One Atelier
            </p>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl font-semibold text-black">
              Crafted for the moments <span className="italic text-emerald">that matter</span>
            </h2>
            <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featuredCollections.map((c) => (
              <motion.div key={c.name} variants={staggerItem}>
                <Link href="/collections" className="group block">
                  <motion.div
                    whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300"
                  >
                    <div
                      className={`relative aspect-[4/3] bg-gradient-to-br ${c.gradient} flex items-end p-6`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="relative z-10">
                        <h3 className="font-heading text-2xl font-semibold text-cream">
                          {c.name}
                        </h3>
                        <p className="mt-1 font-heading text-sm italic text-cream/80">
                          {c.line}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.32em] text-emerald font-medium">
                        View Collection
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-emerald transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
              <div className="flex items-center gap-3">
                <p className="text-[10px] uppercase tracking-[0.42em] text-gold font-medium">
                  Our Heritage
                </p>
                <EditPencil href="/admin/content" label="Edit story" />
              </div>
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
