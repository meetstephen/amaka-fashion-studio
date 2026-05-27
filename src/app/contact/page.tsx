"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, MessageCircle, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Amaka Fashion Atelier!%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/2349131272407?text=${text}`, "_blank");
  };

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-32 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.3em] text-emerald font-medium"
          >
            Reach Out
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-bold text-black mt-4"
          >
            Get in Touch
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-black/70"
          >
            Ready to elevate your wardrobe? We would love to hear from you.
            WhatsApp is the fastest way to reach us.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* WhatsApp CTA */}
            <div className="rounded-2xl bg-emerald p-8 text-cream">
              <h3 className="font-heading text-2xl font-bold">
                Chat with Us on WhatsApp
              </h3>
              <p className="mt-2 text-cream/75 text-sm leading-relaxed">
                The quickest way to discuss your bespoke order, ask questions, or
                book a fitting session. We typically respond within minutes.
              </p>
              <a
                href="https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier!%20I%27d%20like%20to%20make%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-emerald transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <MessageCircle size={16} />
                +234 913 127 2407
              </a>
            </div>

            {/* Location Card */}
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10">
                  <MapPin size={18} className="text-emerald" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-black">
                    Our Location
                  </h4>
                  <p className="mt-1 text-sm text-black/60">
                    Abakaliki, Ebonyi State, Nigeria
                  </p>
                  <p className="mt-1 text-xs text-black/50">
                    Fittings available by appointment
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10">
                  <Phone size={18} className="text-emerald" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-black">
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
            </div>

            {/* Business Hours */}
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10">
                  <Clock size={18} className="text-emerald" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-black">
                    Business Hours
                  </h4>
                  <div className="mt-2 space-y-1 text-sm text-black/60">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: By appointment only</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <h3 className="font-heading text-2xl font-bold text-black">
                Send a Message
              </h3>
              <p className="mt-2 text-sm text-black/60">
                Fill out the form below and we will get back to you promptly.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-[0.15em] text-black/60 font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-[0.15em] text-black/60 font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase tracking-[0.15em] text-black/60 font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                    placeholder="+234..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-[0.15em] text-black/60 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-6 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-cream transition-all duration-300 hover:bg-emerald-dark hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Send size={16} />
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
