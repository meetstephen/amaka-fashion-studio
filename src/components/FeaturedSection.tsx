"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface FeaturedData {
  title: string;
  subtitle: string;
  image_url: string | null;
}

const DEFAULTS: FeaturedData = {
  title: "The Harmattan Edit",
  subtitle: "Cooler weights of Italian wool. Earth-toned silks. The pieces we reach for as the dust rises and the season turns inward.",
  image_url: null,
};

export default function FeaturedSection() {
  const [data, setData] = useState<FeaturedData>(DEFAULTS);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured() || !supabase) return;
      const { data: row, error } = await supabase
        .from("featured")
        .select("title, subtitle, image_url")
        .limit(1)
        .single();
      if (!error && row) {
        setData({
          title: row.title || DEFAULTS.title,
          subtitle: row.subtitle || DEFAULTS.subtitle,
          image_url: row.image_url || null,
        });
      }
    }
    load();
  }, []);

  return (
    <section className="relative bg-black grain-overlay">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[16/9] w-full overflow-hidden"
        >
          {/* Image or gradient fallback */}
          {data.image_url ? (
            <img
              src={data.image_url}
              alt={data.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald via-emerald-dark to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
          <div className="absolute inset-0 flex items-end justify-start p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-[10px] uppercase tracking-[0.42em] text-gold font-medium">
                Featured · This Season
              </p>
              <h2 className="mt-4 font-heading text-3xl md:text-5xl font-semibold text-cream">
                {data.title}
              </h2>
              <p className="mt-3 max-w-lg text-cream/75 text-sm md:text-base leading-relaxed">
                {data.subtitle}
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
  );
}
