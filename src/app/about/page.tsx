"use client";

import { motion } from "framer-motion";
import { Award, Gem, Scissors, Star } from "lucide-react";
import BackButton from "@/components/BackButton";
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
      "Every garment is meticulously hand-finished with attention to the finest details, from stitching to button placement.",
  },
  {
    icon: Gem,
    title: "Heritage",
    description:
      "We draw inspiration from the rich tapestry of Nigerian fashion traditions, honoring techniques passed through generations.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We use only the finest fabrics and materials, ensuring every piece meets the highest standards of luxury menswear.",
  },
  {
    icon: Star,
    title: "Style",
    description:
      "Our designs bridge the gap between tradition and modernity, creating a unique aesthetic for the contemporary gentleman.",
  },
];

export default function AboutPage() {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-32 bg-cream min-h-screen">
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.3em] text-emerald font-medium"
          >
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-bold text-black mt-4"
          >
            Our Story
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
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
                  <div className="font-heading text-7xl font-bold text-gold">
                    A
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-[0.3em] text-cream/70">
                    Est. Abakaliki
                  </div>
                </div>
              </div>
              <div className="absolute -translate-x-3 translate-y-3 inset-0 rounded-3xl border border-gold/30" />
            </div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gold-accessible font-medium">
              The Beginning
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-black mt-4">
              Born from a passion for{" "}
              <span className="italic text-emerald">Nigerian elegance</span>
            </h2>
            <div className="mt-8 space-y-5 text-black/75 leading-relaxed">
              <p>
                Amaka Fashion Atelier was founded in Abakaliki, Ebonyi State,
                with a singular vision: to redefine what luxury menswear means
                for the Nigerian gentleman. From our very first stitch, we set
                out to create garments that embody both the grandeur of our
                cultural heritage and the refined sophistication of modern
                fashion.
              </p>
              <p>
                What began as a small tailoring workshop has grown into a
                respected atelier known for impeccable craftsmanship and
                distinctive design. Every piece that leaves our studio carries
                the DNA of Nigerian sartorial tradition, reimagined for the
                contemporary world.
              </p>
              <p>
                We believe that how a man dresses is an expression of his
                identity, his values, and his aspirations. At Amaka Fashion
                Atelier, we do not simply make clothes. We craft confidence. We
                tailor distinction. We dress the modern Nigerian gentleman for
                every chapter of his story.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Brand Values */}
        <div className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.3em] text-emerald font-medium"
            >
              What We Stand For
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl font-bold text-black mt-4"
            >
              Our Values
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
            />
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
                  <Icon className="text-emerald" size={24} />
                </div>
                <h3 className="font-heading text-lg font-bold text-black mt-4">
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
          className="mt-24 rounded-3xl bg-black p-10 md:p-16 text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
            Our Philosophy
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream mt-4 max-w-2xl mx-auto">
            Dressing the modern Nigerian gentleman is not just our craft.{" "}
            <span className="italic text-gold">It is our calling.</span>
          </h2>
          <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-8 max-w-2xl mx-auto text-cream/70 leading-relaxed">
            We understand that the Nigerian man of today walks between worlds
            with grace. He commands boardrooms and graces ceremonies. He honors
            tradition while embracing the future. Our garments are designed for
            this man: a canvas upon which strength, heritage, and modern
            sophistication converge.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
