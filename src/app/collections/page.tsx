"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Check, Ruler } from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  CATEGORIES,
  CATEGORY_INTRO,
  COLLECTION_ITEMS,
  type Category,
  type CollectionItem,
} from "@/data/collections";
import { addItem, getItems } from "@/lib/inquiry-store";

export default function CollectionsPage() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [addedIds, setAddedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    return new Set(getItems().map((i) => i.id));
  });
  const [flashId, setFlashId] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (filter === "All") return COLLECTION_ITEMS;
    return COLLECTION_ITEMS.filter((item) => item.category === filter);
  }, [filter]);

  const handleAdd = (item: CollectionItem) => {
    addItem({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
    });
    setAddedIds((prev) => new Set(prev).add(item.id));
    setFlashId(item.id);
    window.setTimeout(() => setFlashId(null), 1400);
  };

  const intro = filter !== "All" ? CATEGORY_INTRO[filter] : null;

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-32 bg-cream min-h-screen grain-overlay">
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
            The Collection
          </p>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl font-semibold text-black">
            Our Houses
          </h1>
          <div className="mt-6 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-6 text-black/70 leading-relaxed">
            Six houses, one atelier. Browse the categories below - tap{" "}
            <span className="font-medium text-emerald">Add to Inquiry</span> on
            anything you&apos;d like to discuss, then send the whole list to us
            on WhatsApp in one go.
          </p>
        </div>

        {/* Filter Chips */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap justify-center gap-2.5 md:gap-3"
        >
          {CATEGORIES.map((cat) => {
            const active = filter === cat;
            return (
              <motion.button
                key={cat}
                variants={staggerItem}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={active}
                className={`min-h-[44px] whitespace-nowrap rounded-full border px-5 py-2 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-300 ${
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

        {/* Category intro line */}
        <AnimatePresence mode="wait">
          {intro && (
            <motion.p
              key={filter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="mx-auto mt-7 max-w-2xl text-center font-heading text-lg italic text-emerald"
            >
              &ldquo;{intro}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>

        {/* Items Grid */}
        <motion.div
          layout
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((item) => {
            const added = addedIds.has(item.id);
            const justAdded = flashId === item.id;
            return (
              <motion.div
                key={item.id}
                layout
                variants={staggerItem}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm flex flex-col h-full"
                >
                  <div
                    className={`relative aspect-[4/3] bg-gradient-to-br ${item.gradient}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block rounded-full bg-cream/90 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-emerald font-medium backdrop-blur">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-heading text-xl font-semibold text-black">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-black/60 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      <a
                        href={`https://wa.me/2349131272407?text=${encodeURIComponent(
                          `Hello! I'm interested in "${item.name}" from your ${item.category} collection.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px]"
                      >
                        Order on WhatsApp
                        <ArrowRight size={12} />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleAdd(item)}
                        disabled={added && !justAdded}
                        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] transition-colors min-h-[44px] ${
                          justAdded
                            ? "border-gold bg-gold text-black"
                            : added
                            ? "border-emerald/30 bg-emerald/5 text-emerald/70 cursor-default"
                            : "border-emerald/40 text-emerald hover:bg-emerald hover:text-cream hover:border-emerald"
                        }`}
                      >
                        {justAdded ? (
                          <>
                            <Check size={12} /> Added!
                          </>
                        ) : added ? (
                          <>
                            <Check size={12} /> In inquiry
                          </>
                        ) : (
                          <>
                            <Plus size={12} /> Add to inquiry
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {visible.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-black/20 p-12 text-center text-black/60">
            No pieces in this category yet. Check back soon!
          </div>
        )}

        {/* Measurements CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-2xl border border-emerald/10 bg-white p-6 md:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald/10">
            <Ruler size={22} className="text-emerald" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-heading text-lg font-semibold text-black">
              Ready to be measured?
            </h3>
            <p className="mt-1 text-sm text-black/60">
              Submit your measurements online so we can craft your perfect fit.
            </p>
          </div>
          <Link
            href="/measurements"
            className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px] whitespace-nowrap"
          >
            Submit Measurements <ArrowRight size={12} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
