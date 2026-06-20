"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface CollectionCard {
  name: string;
  line: string;
  gradient: string;
  photoUrl: string | null;
}

const BASE_COLLECTIONS: Omit<CollectionCard, "photoUrl">[] = [
  { name: "Senator Wear", line: "The garment of statesmen.", gradient: "from-emerald to-emerald-dark" },
  { name: "Bespoke Suits", line: "A second skin in worsted wool.", gradient: "from-emerald-dark to-black" },
  { name: "Shirts", line: "Egyptian cotton. French linen.", gradient: "from-black to-emerald" },
  { name: "Casual", line: "Off-duty, never off-form.", gradient: "from-emerald-light to-emerald" },
  { name: "Traditional", line: "Heritage rendered in thread.", gradient: "from-emerald to-black" },
  { name: "Corporate", line: "Authority, lined in Ankara.", gradient: "from-black to-emerald-dark" },
];

export default function CollectionsGrid() {
  const [collections, setCollections] = useState<CollectionCard[]>(
    BASE_COLLECTIONS.map((c) => ({ ...c, photoUrl: null }))
  );

  useEffect(() => {
    async function loadPhotos() {
      if (!isSupabaseConfigured() || !supabase) return;
      const { data, error } = await supabase
        .from("images")
        .select("name, url")
        .eq("category", "collections");
      if (error || !data) return;

      setCollections((prev) =>
        prev.map((card) => {
          const match = data.find(
            (row) =>
              row.url &&
              (row.name?.toLowerCase().includes(card.name.toLowerCase()) ||
                card.name.toLowerCase().includes((row.name ?? "").toLowerCase()))
          );
          return match ? { ...card, photoUrl: match.url } : card;
        })
      );
    }
    loadPhotos();
  }, []);

  return (
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
          {collections.map((c) => (
            <motion.div key={c.name} variants={staggerItem}>
              <Link href="/collections" className="group block">
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300"
                >
                  <div
                    className={
                      "relative aspect-[4/3] flex items-end p-6 bg-cover bg-center " +
                      (c.photoUrl ? "" : "bg-gradient-to-br " + c.gradient)
                    }
                    style={
                      c.photoUrl
                        ? { backgroundImage: "url(" + JSON.stringify(c.photoUrl) + ")" }
                        : undefined
                    }
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
  );
}
