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

const defaultLookbookItems: LookbookItem[] = [
  {
    id: 1,
    title: "Royal Emerald Agbada",
    caption: "Flowing silhouette in deep emerald, embroidered with gold thread",
    gradient: "bg-gradient-to-br from-emerald via-emerald-dark to-black",
  },
  {
    id: 2,
    title: "Midnight Senator",
    caption: "Tailored precision in black with gold button accents",
    gradient: "bg-gradient-to-br from-black via-gray-900 to-emerald-dark",
  },
  {
    id: 3,
    title: "Heritage Kaftan",
    caption: "Traditional kaftan reimagined with contemporary clean lines",
    gradient: "bg-gradient-to-br from-emerald-dark via-black to-gray-900",
  },
  {
    id: 4,
    title: "Gold Coast Blazer",
    caption: "Structured blazer with hand-finished lapels and gold piping",
    gradient: "bg-gradient-to-br from-yellow-900 via-emerald-dark to-black",
  },
  {
    id: 5,
    title: "Abakaliki Two-Piece",
    caption: "Modern two-piece suit with Igbo-inspired embroidery details",
    gradient: "bg-gradient-to-br from-emerald via-green-900 to-black",
  },
  {
    id: 6,
    title: "Ivory Ceremony Set",
    caption: "Cream-toned ensemble for weddings and celebrations",
    gradient: "bg-gradient-to-br from-amber-100 via-yellow-200 to-emerald/30",
  },
  {
    id: 7,
    title: "Obsidian Formal",
    caption: "All-black formal wear with subtle emerald inner lining",
    gradient: "bg-gradient-to-br from-gray-900 via-black to-emerald-dark/50",
  },
  {
    id: 8,
    title: "Safari Linen Shirt",
    caption: "Relaxed luxury in lightweight linen with hand-stitched details",
    gradient: "bg-gradient-to-br from-emerald/60 via-green-800 to-black",
  },
  {
    id: 9,
    title: "Ankara Fusion Jacket",
    caption: "Bold Ankara prints fused with Western tailoring",
    gradient: "bg-gradient-to-br from-orange-900 via-emerald-dark to-black",
  },
  {
    id: 10,
    title: "The Gentleman Cape",
    caption: "Flowing cape over fitted suit - statement occasion wear",
    gradient: "bg-gradient-to-br from-emerald via-black to-emerald-dark",
  },
  {
    id: 11,
    title: "Vintage Palm Beach",
    caption: "Lightweight tropical suiting with retro-inspired silhouette",
    gradient: "bg-gradient-to-br from-green-700 via-emerald to-yellow-900/40",
  },
  {
    id: 12,
    title: "Coronation Grand",
    caption: "Floor-length ceremonial robe with intricate gold beadwork",
    gradient: "bg-gradient-to-br from-yellow-800 via-emerald-dark to-black",
  },
];

export default function LookbookPage() {
  const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>(defaultLookbookItems);
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
          gradient: row.gradient || defaultLookbookItems[idx % defaultLookbookItems.length].gradient,
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
