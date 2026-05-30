"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, MessageCircle, Phone, Ruler, Send } from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import FaqAccordion from "@/components/FaqAccordion";
import {
  fadeInRight,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello Amaka Fashion Atelier!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
    window.open(
      `https://wa.me/2349131272407?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-32 bg-cream min-h-screen grain-overlay">
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
            Reach Out
          </p>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl font-semibold text-black">
            Get in Touch
          </h1>
          <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-6 text-black/70 leading-relaxed">
            Ready to elevate your wardrobe? We&apos;d love to hear from you.
            WhatsApp is the fastest path to our team.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              variants={staggerItem}
              className="rounded-2xl bg-emerald p-8 text-cream"
            >
              <h3 className="font-heading text-2xl font-semibold">
                Chat with Us on WhatsApp
              </h3>
              <p className="mt-2 text-cream/75 text-sm leading-relaxed">
                The quickest way to discuss a bespoke commission, ask
                questions, or book a fitting. We typically respond within
                minutes.
              </p>
              <a
                href="https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier!%20I%27d%20like%20to%20make%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-emerald transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg min-h-[44px]"
              >
                <MessageCircle size={16} />
                +234 913 127 2407
              </a>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10">
                  <MapPin size={18} className="text-emerald" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-black">
                    Our Location
                  </h4>
                  <p className="mt-1 text-sm text-black/60">
                    Abakaliki, Ebonyi State, Nigeria
                  </p>
                  <p className="mt-1 text-xs text-black/50">
                    Fittings by appointment
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10">
                  <Phone size={18} className="text-emerald" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-black">
                    Call Us
                  </h4>
                  <a
                    href="tel:+2349131272407"
                    className="mt-1 text-sm text-emerald hover:text-emerald-dark transition-colors"
                  >
                    +234 913 127 2407
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10">
                  <Mail size={18} className="text-emerald" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-lg font-semibold text-black">
                    Email Us
                  </h4>
                  <a
                    href="mailto:lucynwoka959@gmail.com"
                    className="mt-1 block text-sm text-emerald hover:text-emerald-dark transition-colors break-all"
                  >
                    lucynwoka959@gmail.com
                  </a>
                  <p className="mt-1 text-xs text-black/50">
                    For detailed enquiries &amp; commissions
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10">
                  <Clock size={18} className="text-emerald" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-black">
                    Business Hours
                  </h4>
                  <div className="mt-2 space-y-1 text-sm text-black/60">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: By appointment only</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <h3 className="font-heading text-2xl font-semibold text-black">
                Send a Message
              </h3>
              <p className="mt-2 text-sm text-black/60">
                Fill in below and we&apos;ll continue the conversation on
                WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    inputMode="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full min-h-[48px] rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full min-h-[48px] rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full min-h-[48px] rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                    placeholder="+234..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors resize-none"
                    placeholder="Tell us about the garment you have in mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-6 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-all duration-300 hover:bg-emerald-dark hover:-translate-y-0.5 hover:shadow-lg min-h-[48px]"
                >
                  <Send size={16} />
                  Send via WhatsApp
                </button>

                <p className="text-center text-xs text-black/50">
                  Prefer email?{" "}
                  <a
                    href="mailto:lucynwoka959@gmail.com"
                    className="font-medium text-emerald hover:text-emerald-dark transition-colors"
                  >
                    Write to us directly
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
              Common Questions
            </p>
            <h2 className="mt-4 font-heading text-3xl md:text-4xl font-semibold text-black">
              Frequently asked
            </h2>
            <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <FaqAccordion />
          </div>
        </div>

        {/* Measurements CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 mx-auto max-w-3xl"
        >
          <div className="rounded-2xl border border-emerald/10 bg-emerald p-8 md:p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream/15">
              <Ruler size={28} className="text-gold" />
            </div>
            <h3 className="mt-5 font-heading text-2xl md:text-3xl font-semibold text-cream">
              Submit Your Measurements
            </h3>
            <p className="mt-3 text-cream/75 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Get perfectly fitted garments by submitting your body measurements online.
              Our tailors will use them to craft your bespoke pieces.
            </p>
            <Link
              href="/measurements"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-black transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-lg min-h-[48px]"
            >
              <Ruler size={14} />
              Submit Measurements
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
