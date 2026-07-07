"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";
import Lightbox from "@/components/Lightbox";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface LookbookItem {
  id: number;
  title: string;
  caption: string;
  gradient: string;
  image_url?: string | null;
}

// Gradient palette used only as a fallback tile colour for uploaded photos
// that don't carry their own gradient. The gallery itself starts empty and is
// populated from Supabase once the owner uploads her work.
const FALLBACK_GRADIENTS = [
  "bg-gradient-to-br from-emerald via-emerald-dark to-black",
  "bg-gradient-to-br from-black via-gray-900 to-emerald-dark",
  "bg-gradient-to-br from-emerald-dark via-black to-gray-900",
  "bg-gradient-to-br from-yellow-900 via-emerald-dark to-black",
  "bg-gradient-to-br from-emerald via-green-900 to-black",
  "bg-gradient-to-br from-amber-100 via-yellow-200 to-emerald/30",
];

export default function LookbookPage() {
  const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadFromSupabase() {
      if (!isSupabaseConfigured() || !supabase) return;
      const { data, error } = await supabase
        .from("lookbook")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        const items: LookbookItem[] = data.map((row, idx) => ({
          id: row.id ?? idx + 1,
          title: row.title || `Look ${idx + 1}`,
          caption: row.caption || row.description || "",
          gradient: row.gradient || FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length],
          image_url: row.image_url || null,
        }));
        setLookbookItems(items);
      }
    }
    loadFromSupabase();
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % lookbookItems.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + lookbookItems.length) % lookbookItems.length
    );
  };

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
            Gallery
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-bold text-black mt-4"
          >
            Lookbook
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-black/60 max-w-xl mx-auto"
          >
            Explore our curated collection of luxury menswear. Each piece tells
            a story of heritage, craftsmanship, and modern Nigerian elegance.
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {lookbookItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                {/* Show uploaded image or gradient fallback */}
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 ${item.gradient} transition-transform duration-500 group-hover:scale-105`}
                  />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
              <h3 className="mt-3 font-heading text-sm md:text-base font-semibold text-black line-clamp-1">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-black/60 line-clamp-2">
                {item.caption}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state - shown until the atelier uploads its first photos */}
        {lookbookItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 rounded-3xl border border-dashed border-emerald/25 bg-white/40 px-6 py-16 text-center"
          >
            <p className="font-heading text-2xl md:text-3xl italic text-emerald">
              The lookbook is being curated.
            </p>
            <p className="mt-3 text-sm text-black/60 max-w-md mx-auto leading-relaxed">
              Our latest pieces are being photographed and will appear here
              shortly. In the meantime, explore our collections or reach us on
              WhatsApp to see current work.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/collections"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-cream transition-all hover:bg-emerald-dark min-h-[44px]"
              >
                View Collections
              </a>
              <a
                href="https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier%2C%20may%20I%20see%20your%20latest%20work%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald/40 px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-emerald transition-all hover:border-emerald hover:bg-emerald/5 min-h-[44px]"
              >
                Ask on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <Lightbox
          items={lookbookItems}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={goToNext}
          onPrev={goToPrev}
        />
      )}
    </section>
  );
}
