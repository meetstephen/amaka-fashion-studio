"use client";

import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface ContentSection {
  id: string;
  label: string;
  value: string;
  saved: boolean;
}

const defaultSections: ContentSection[] = [
  { id: "tagline", label: "Homepage Tagline", value: "Where Heritage Meets Distinction", saved: false },
  { id: "collection_senator", label: "Senator Wear Collection - Description", value: "Premium senator wear crafted with precision. Each piece features hand-finished details and luxurious fabrics that honor Nigerian sartorial tradition.", saved: false },
  { id: "collection_suits", label: "Bespoke Suits - Description", value: "Tailored to perfection, our bespoke suits blend contemporary silhouettes with traditional craftsmanship for the modern Nigerian gentleman.", saved: false },
  { id: "collection_shirts", label: "Premium Shirts - Description", value: "Expertly tailored shirts in the finest fabrics, designed for the man who appreciates quality in every stitch.", saved: false },
  { id: "collection_kaftan", label: "Kaftan Collection - Description", value: "Flowing elegance meets modern design. Our kaftans are reimagined with contemporary cuts while preserving cultural authenticity.", saved: false },
  { id: "about_story", label: "About Page - Our Story", value: "Founded in the heart of Abakaliki, Ebonyi State, Amaka Fashion Atelier represents the pinnacle of Nigerian menswear craftsmanship. Every garment tells a story of heritage, precision, and modern elegance. Our master tailors bring decades of experience to each piece, ensuring every stitch reflects our commitment to excellence.", saved: false },
  { id: "about_mission", label: "About Page - Mission", value: "To elevate Nigerian menswear to the world stage, blending the rich cultural heritage of Igbo craftsmanship with contemporary luxury fashion. We believe every man deserves to wear garments that reflect his heritage and status.", saved: false },
];

export default function AdminContentPage() {
  const [sections, setSections] = useState<ContentSection[]>(defaultSections);

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.from("content").select("*");
        if (!error && data && data.length > 0) {
          const contentMap = new Map(data.map((row) => [row.key, row.value]));
          setSections(
            defaultSections.map((s) => ({
              ...s,
              value: contentMap.get(s.id) ?? s.value,
              saved: false,
            }))
          );
          return;
        }
      }
      setSections(defaultSections);
    }
    loadData();
  }, []);

  const handleChange = (id: string, newValue: string) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, value: newValue, saved: false } : s
      )
    );
  };

  const handleSave = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from("content")
        .upsert({ key: id, value: section.value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (!error) {
        setSections((prev) => prev.map((s) => (s.id === id ? { ...s, saved: true } : s)));
        return;
      }
    }
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, saved: true } : s)));
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-black">
          Content Editor
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Edit text content across the site
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-xl border border-emerald/10 p-5 shadow-sm"
          >
            <label
              htmlFor={section.id}
              className="block text-sm font-medium text-black mb-2"
            >
              {section.label}
            </label>
            <textarea
              id={section.id}
              value={section.value}
              onChange={(e) => handleChange(section.id, e.target.value)}
              rows={section.value.length > 100 ? 4 : 2}
              className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-gray-300 bg-white text-black text-sm resize-y focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none transition-colors"
              aria-label={section.label}
            />
            <div className="flex items-center justify-end mt-3">
              <button
                onClick={() => handleSave(section.id)}
                className="inline-flex items-center gap-2 px-4 min-h-[44px] bg-emerald text-cream rounded-lg text-sm font-medium hover:bg-emerald-dark transition-colors"
                aria-label={`Save ${section.label}`}
              >
                {section.saved ? (
                  <>
                    <Check size={16} />
                    Saved
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Back to dashboard */}
      <div className="mt-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-emerald hover:text-emerald-dark text-sm font-medium transition-colors min-h-[44px]"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
