"use client";

import { motion } from "framer-motion";
import { Award, Gem, Quote, Scissors, Star } from "lucide-react";
import BackButton from "@/components/BackButton";
import NewsletterCTA from "@/components/NewsletterCTA";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

const values = [
  {
    icon: Scissors,
    title: "Craftsmanship",
    description:
      "Pick-stitched lapels, hand-rolled buttonholes, French seams. Every garment is finished by hand because it cannot be hurried into elegance.",
  },
  {
    icon: Gem,
    title: "Heritage",
    description:
      "Aso-Oke weaving, Igbo motif, ceremonial dress traditions - reimagined as the blueprint for the modern Nigerian gentleman.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Italian wool. Egyptian cotton. French linen. We refuse anything that doesn't earn its place against your skin.",
  },
  {
    icon: Star,
    title: "Distinction",
    description:
      "We make fewer pieces, better. Each one is a quiet argument for why the man wearing it walks differently.",
  },
];

export default function AboutPage() {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-32 bg-cream min-h-screen grain-overlay">
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
            About Us
          </p>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl font-semibold text-black">
            Our Story
          </h1>
          <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Brand Story */}
        <div className="mt-16 grid items-center gap-14 md:grid-cols-12">
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald via-emerald-dark to-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-8xl italic font-semibold text-gold">
                    A
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.42em] text-cream/70">
                    Est. Abakaliki · MMXXIV
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl border border-gold/30" />
            </div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <p className="text-[10px] uppercase tracking-[0.42em] text-gold-accessible font-medium">
              The Beginning
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-black mt-4">
              Born of a love for{" "}
              <span className="italic text-emerald">Nigerian elegance</span>
            </h2>
            <div className="mt-8 space-y-5 text-black/75 leading-relaxed">
              <p>
                Amaka Fashion Atelier began in Abakaliki, Ebonyi State, with a
                stubborn idea: that a Nigerian gentleman should never have to
                travel beyond his own city to be dressed at the very highest
                level. We set out to put a master atelier within driving
                distance of every man who values his cloth.
              </p>
              <p>
                What began as a small tailoring workshop has grown into an
                atelier known for the cleanness of its line, the patience of
                its hand-finishing, and the discreet poetry of its detailing.
                Every piece carries the DNA of Nigerian sartorial tradition,
                reimagined for the present moment.
              </p>
              <p>
                We believe how a man dresses is an expression of his identity,
                his values, and his aspirations. At Amaka Fashion Atelier we
                don&apos;t simply make clothes - we tailor distinction. We
                dress the modern Nigerian gentleman for every chapter of his
                story.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Founder quote block */}
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mt-24 rounded-3xl border border-gold/15 bg-white p-10 md:p-14 shadow-sm"
        >
          <Quote
            size={42}
            className="absolute -top-5 left-10 text-gold-light bg-cream rounded-full p-1"
            aria-hidden
          />
          <blockquote className="font-heading text-2xl md:text-3xl leading-snug text-black italic max-w-3xl">
            &ldquo;A garment should arrive at the man, not the other way
            around. Our work is to disappear into how well he carries
            himself.&rdquo;
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-emerald">
            <span className="inline-block h-px w-8 bg-emerald" />
            Founder &middot; Amaka Fashion Atelier
          </figcaption>
        </motion.figure>

        {/* Brand Values */}
        <div className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
              What We Stand For
            </p>
            <h2 className="mt-4 font-heading text-3xl md:text-4xl font-semibold text-black">
              Our Values
            </h2>
            <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={staggerItem}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition-all duration-300"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald/10">
                  <Icon className="text-emerald" size={22} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-black mt-4">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-black/60 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-24 rounded-3xl bg-black p-10 md:p-16 text-center grain-overlay"
        >
          <p className="text-[10px] uppercase tracking-[0.42em] text-gold font-medium">
            Our Philosophy
          </p>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl font-semibold text-cream max-w-2xl mx-auto">
            Dressing the modern Nigerian gentleman is not just our craft.{" "}
            <span className="italic text-gold">It is our calling.</span>
          </h2>
          <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-8 max-w-2xl mx-auto text-cream/75 leading-relaxed">
            The Nigerian man of today walks between worlds with grace. He
            commands boardrooms and graces ceremonies. He honours tradition
            while embracing the future. Our garments are designed for this
            man - a canvas upon which strength, heritage, and modern
            sophistication converge.
          </p>
        </motion.div>
      </div>

      <div className="mt-24">
        <NewsletterCTA variant="light" />
      </div>
    </section>
  );
}
