"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, MessageCircle, Ruler, Send } from "lucide-react";
import BackButton from "@/components/BackButton";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

interface MeasurementForm {
  name: string;
  phone: string;
  email: string;
  city: string;
  chest: string;
  waist: string;
  hips: string;
  shoulder: string;
  sleeve: string;
  neck: string;
  inseam: string;
  shirtLength: string;
  notes: string;
}

const initialForm: MeasurementForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  chest: "",
  waist: "",
  hips: "",
  shoulder: "",
  sleeve: "",
  neck: "",
  inseam: "",
  shirtLength: "",
  notes: "",
};

const measurementFields: { key: keyof MeasurementForm; label: string }[] = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoulder", label: "Shoulder Width" },
  { key: "sleeve", label: "Sleeve Length" },
  { key: "neck", label: "Neck" },
  { key: "inseam", label: "Inseam" },
  { key: "shirtLength", label: "Shirt Length" },
];

function buildWhatsAppLink(form: MeasurementForm): string {
  const measurements = measurementFields
    .filter((f) => form[f.key])
    .map((f) => `${f.label}: ${form[f.key]}"`)
    .join(", ");

  const lines = [
    `Hello Amaka Fashion Atelier!`,
    ``,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    form.email ? `Email: ${form.email}` : "",
    form.city ? `City: ${form.city}` : "",
    ``,
    `Measurements (inches):`,
    measurements,
    form.notes ? `\nNotes: ${form.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/2349131272407?text=${encodeURIComponent(lines)}`;
}

export default function MeasurementsPage() {
  const [form, setForm] = useState<MeasurementForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key: keyof MeasurementForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          chest: form.chest,
          waist: form.waist,
          hips: form.hips,
          shoulder: form.shoulder,
          sleeve: form.sleeve,
          neck: form.neck,
          inseam: form.inseam,
          shirtLength: form.shirtLength,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.fallback) {
        setShowWhatsApp(true);
      }
    } catch {
      setShowWhatsApp(true);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="pt-28 pb-20 md:pt-36 md:pb-32 bg-cream min-h-screen grain-overlay">
        <BackButton />
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-2xl border border-emerald/10 bg-white p-10 shadow-sm"
          >
            {/* Success icon with gold accent ring */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald/10 ring-4 ring-gold/20">
              <Check size={36} className="text-emerald" />
            </div>

            <h2 className="mt-6 font-heading text-3xl font-semibold text-black">
              Measurements Received
            </h2>
            <p className="mt-3 text-black/70 leading-relaxed">
              Thank you, {form.name}! Our tailoring team will review your
              measurements and reach out shortly to discuss your bespoke piece.
            </p>

            {/* Gold confetti accents */}
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: (i - 2) * 15 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="inline-block h-2 w-2 rounded-sm bg-gold"
                />
              ))}
            </div>

            {showWhatsApp && (
              <a
                href={buildWhatsAppLink(form)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-6 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-all duration-300 hover:bg-emerald-dark hover:-translate-y-0.5 hover:shadow-lg min-h-[48px]"
              >
                <MessageCircle size={16} />
                Send via WhatsApp Instead
              </a>
            )}

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex min-h-[44px] items-center text-sm text-emerald hover:text-emerald-dark transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-32 bg-cream min-h-screen grain-overlay">
      <BackButton />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
            Bespoke Tailoring
          </p>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl font-semibold text-black">
            Submit Your Measurements
          </h1>
          <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-6 text-black/70 leading-relaxed max-w-lg mx-auto">
            Share your body measurements and our master tailors will craft a
            garment that fits you perfectly. All measurements in inches.
          </p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-12 space-y-8"
        >
          {/* Personal Details */}
          <motion.div
            variants={staggerItem}
            className="rounded-2xl border border-emerald/10 bg-white p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald/10">
                <Send size={16} className="text-emerald" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-black">
                Personal Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                >
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  autoComplete="name"
                  inputMode="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full min-h-[48px] rounded-lg border border-black/10 bg-cream/50 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                >
                  Phone / WhatsApp <span className="text-gold">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full min-h-[48px] rounded-lg border border-black/10 bg-cream/50 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                  placeholder="+234..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                  >
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full min-h-[48px] rounded-lg border border-black/10 bg-cream/50 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    autoComplete="address-level2"
                    inputMode="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full min-h-[48px] rounded-lg border border-black/10 bg-cream/50 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                    placeholder="e.g. Lagos, Abuja"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Body Measurements */}
          <motion.div
            variants={staggerItem}
            className="rounded-2xl border border-emerald/10 bg-white p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald/10">
                <Ruler size={16} className="text-emerald" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-black">
                Body Measurements
              </h2>
            </div>
            <p className="text-xs text-black/50 mb-6">
              All measurements in inches. Leave blank any you are unsure about.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {measurementFields.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={field.key}
                    className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id={field.key}
                      inputMode="decimal"
                      value={form[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full min-h-[48px] rounded-lg border border-black/10 bg-cream/50 px-4 py-3 pr-10 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors"
                      placeholder="0.0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/40">
                      in
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Notes */}
          <motion.div
            variants={staggerItem}
            className="rounded-2xl border border-emerald/10 bg-white p-6 md:p-8 shadow-sm"
          >
            <h2 className="font-heading text-xl font-semibold text-black mb-4">
              Additional Notes
            </h2>
            <label
              htmlFor="notes"
              className="block text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium mb-2"
            >
              Special Requests / Fabric Preferences
            </label>
            <textarea
              id="notes"
              rows={4}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-cream/50 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald transition-colors resize-none"
              placeholder="e.g. I prefer a slim fit, Italian wool fabric, need it by March..."
            />
          </motion.div>

          {/* Submit */}
          <motion.div variants={staggerItem}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-6 py-4 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-all duration-300 hover:bg-emerald-dark hover:-translate-y-0.5 hover:shadow-lg min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
              ) : (
                <Send size={16} />
              )}
              {isSubmitting ? "Submitting..." : "Submit Measurements"}
            </button>
          </motion.div>
        </motion.form>

        {/* CTA Info Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-emerald/10 bg-white p-6 md:p-8 shadow-sm text-center"
        >
          <h3 className="font-heading text-xl font-semibold text-black">
            Prefer In-Person?
          </h3>
          <p className="mt-2 text-sm text-black/70 leading-relaxed max-w-md mx-auto">
            Visit our Abakaliki studio for a complimentary fitting session.
            Our master tailors will take your measurements with precision.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/2349131272407"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald/10 px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-emerald transition-colors hover:bg-emerald/20 min-h-[44px]"
            >
              <MessageCircle size={16} />
              Send via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
