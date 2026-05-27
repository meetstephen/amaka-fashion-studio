"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

type Category =
  | "All"
  | "Senator Wear"
  | "Shirts"
  | "Suits"
  | "Casual"
  | "Traditional"
  | "Corporate";

const categories: Category[] = [
  "All",
  "Senator Wear",
  "Shirts",
  "Suits",
  "Casual",
  "Traditional",
  "Corporate",
];

const items = [
  {
    id: 1,
    name: "The Statesman",
    category: "Senator Wear" as Category,
    description: "Ivory senator with gold embroidery accents",
    gradient: "from-emerald to-emerald-dark",
  },
  {
    id: 2,
    name: "The Diplomat",
    category: "Senator Wear" as Category,
    description: "Classic black senator with subtle patterns",
    gradient: "from-black to-emerald-dark",
  },
  {
    id: 3,
    name: "The Elder",
    category: "Senator Wear" as Category,
    description: "Rich navy senator with traditional detailing",
    gradient: "from-emerald-dark to-black",
  },
  {
    id: 4,
    name: "The Executive",
    category: "Senator Wear" as Category,
    description: "Slate grey senator for the modern leader",
    gradient: "from-emerald to-black",
  },
  {
    id: 5,
    name: "Oxford Classic",
    category: "Shirts" as Category,
    description: "Crisp white oxford with French cuffs",
    gradient: "from-emerald-light to-emerald",
  },
  {
    id: 6,
    name: "The Artisan",
    category: "Shirts" as Category,
    description: "Patterned shirt with Ankara-inspired print",
    gradient: "from-emerald to-emerald-light",
  },
  {
    id: 7,
    name: "Linen Breeze",
    category: "Shirts" as Category,
    description: "Lightweight linen shirt for tropical elegance",
    gradient: "from-emerald-dark to-emerald-light",
  },
  {
    id: 8,
    name: "The Chairman",
    category: "Suits" as Category,
    description: "Double-breasted suit in charcoal wool",
    gradient: "from-black to-emerald",
  },
  {
    id: 9,
    name: "The Maverick",
    category: "Suits" as Category,
    description: "Slim-fit emerald suit with peak lapels",
    gradient: "from-emerald to-emerald-dark",
  },
  {
    id: 10,
    name: "The Pinnacle",
    category: "Suits" as Category,
    description: "Three-piece navy suit with gold buttons",
    gradient: "from-emerald-dark to-black",
  },
  {
    id: 11,
    name: "Weekend Luxe",
    category: "Casual" as Category,
    description: "Relaxed-fit kaftan in premium cotton",
    gradient: "from-emerald-light to-emerald",
  },
  {
    id: 12,
    name: "The Wanderer",
    category: "Casual" as Category,
    description: "Contemporary casual set with Igbo motifs",
    gradient: "from-emerald to-emerald-light",
  },
  {
    id: 13,
    name: "The Lounger",
    category: "Casual" as Category,
    description: "Premium agbada-inspired lounge wear",
    gradient: "from-emerald-dark to-emerald",
  },
  {
    id: 14,
    name: "Igbo Heritage",
    category: "Traditional" as Category,
    description: "Hand-woven isiagu with traditional cap",
    gradient: "from-emerald to-black",
  },
  {
    id: 15,
    name: "The Chieftain",
    category: "Traditional" as Category,
    description: "Royal agbada with intricate embroidery",
    gradient: "from-black to-emerald",
  },
  {
    id: 16,
    name: "Ancestral Pride",
    category: "Traditional" as Category,
    description: "Ceremonial attire with gold thread work",
    gradient: "from-emerald-dark to-emerald",
  },
  {
    id: 17,
    name: "Boardroom Authority",
    category: "Corporate" as Category,
    description: "Power suit with structured shoulders",
    gradient: "from-black to-emerald-dark",
  },
  {
    id: 18,
    name: "The Director",
    category: "Corporate" as Category,
    description: "Tailored blazer with matching trousers",
    gradient: "from-emerald-dark to-black",
  },
  {
    id: 19,
    name: "Executive Edge",
    category: "Corporate" as Category,
    description: "Modern corporate ensemble with African print lining",
    gradient: "from-emerald to-emerald-dark",
  },
];

export default function CollectionsPage() {
  const [filter, setFilter] = useState<Category>("All");

  const visible = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((item) => item.category === filter);
  }, [filter]);

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
            The Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-bold text-black mt-4"
          >
            Our Collections
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
            Browse our curated selection of luxury menswear. Every piece is
            crafted with precision and designed for the modern Nigerian
            gentleman.
          </motion.p>
        </div>

        {/* Filter Chips */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap justify-center gap-2.5 md:gap-3"
        >
          {categories.map((cat) => {
            const active = filter === cat;
            return (
              <motion.button
                key={cat}
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-300 sm:text-xs ${
                  active
                    ? "border-emerald bg-emerald text-cream"
                    : "border-black/15 text-black/70 hover:border-emerald hover:text-emerald"
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Items Grid */}
        <motion.div
          layout
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((item) => (
            <motion.div
              key={item.id}
              layout
              variants={staggerItem}
              className="group"
            >
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              >
                <div
                  className={`aspect-[4/3] bg-gradient-to-br ${item.gradient} relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block rounded-full bg-cream/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald font-medium backdrop-blur">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-black">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-black/60">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-emerald">
                    <span className="text-xs uppercase tracking-[0.15em] font-medium">
                      View Details
                    </span>
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {visible.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-black/20 p-12 text-center text-black/60">
            No pieces in this category yet. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
}
