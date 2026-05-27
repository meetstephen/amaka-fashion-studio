"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const collections = [
  {
    name: "Senator Wear",
    description: "Distinguished ensembles for the modern statesman",
    gradient: "from-emerald to-emerald-dark",
  },
  {
    name: "Shirts",
    description: "Impeccably tailored shirts for every occasion",
    gradient: "from-emerald-dark to-black",
  },
  {
    name: "Suits",
    description: "Sharp silhouettes crafted with precision",
    gradient: "from-black to-emerald",
  },
  {
    name: "Casual",
    description: "Relaxed luxury for the discerning gentleman",
    gradient: "from-emerald-light to-emerald",
  },
  {
    name: "Traditional",
    description: "Heritage designs honoring Nigerian craftsmanship",
    gradient: "from-emerald to-black",
  },
  {
    name: "Corporate",
    description: "Commanding presence in the boardroom",
    gradient: "from-black to-emerald-dark",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald via-emerald-dark to-black">
        {/* Decorative elements */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-emerald-light/15 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.32em] text-cream/80 backdrop-blur"
            >
              <Sparkles size={12} className="text-gold" />
              Luxury Menswear from Abakaliki
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-heading text-5xl md:text-7xl font-bold text-cream mt-8 leading-tight"
            >
              Amaka Fashion
              <br />
              <span className="italic text-gold">Atelier</span>
            </motion.h1>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 h-px w-24 origin-left bg-gradient-to-r from-gold via-gold to-transparent"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-cream/75"
            >
              Crafting the Modern Nigerian Gentleman. Bespoke luxury menswear
              that blends Nigerian heritage with contemporary elegance, designed
              and handcrafted in Abakaliki.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore Collections <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier!%20I%27d%20like%20to%20book%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-all duration-300 hover:border-gold hover:text-gold hover:-translate-y-0.5"
              >
                Book Appointment
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="py-20 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.3em] text-emerald font-medium"
            >
              Our Collections
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl font-bold text-black mt-4"
            >
              Crafted for the moments that matter.
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
            />
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href="/collections" className="group block">
                  <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div
                      className={`aspect-[4/3] bg-gradient-to-br ${collection.gradient} flex items-end p-6`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="relative z-10">
                        <h3 className="font-heading text-xl font-bold text-cream">
                          {collection.name}
                        </h3>
                        <p className="mt-1 text-sm text-cream/70">
                          {collection.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-emerald font-medium">
                        View Collection
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-emerald transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Teaser */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
                Our Heritage
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-cream mt-4">
                Where tradition meets{" "}
                <span className="italic text-gold">modern luxury</span>
              </h2>
              <div className="mt-6 h-px w-16 bg-gradient-to-r from-gold to-transparent" />
              <p className="mt-6 text-cream/70 leading-relaxed">
                From our atelier in Abakaliki, Ebonyi State, we craft garments
                that honor the rich sartorial traditions of Nigeria while
                embracing the confidence and sophistication of the modern
                gentleman. Every stitch tells a story of heritage, excellence,
                and uncompromising quality.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-light"
              >
                Read Our Story <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative aspect-square rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald via-emerald-dark to-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-6xl font-bold text-gold">
                    A
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.3em] text-cream/60">
                    Amaka Atelier
                  </div>
                </div>
              </div>
              <div className="absolute -translate-x-4 translate-y-4 inset-0 rounded-3xl border border-gold/30" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
