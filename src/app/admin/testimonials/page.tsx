"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Quote, Plus, Trash2, Save, Star } from "lucide-react";
import {
  DEFAULT_TESTIMONIALS,
  getTestimonials,
  saveTestimonials,
  type Testimonial,
} from "@/lib/testimonials-store";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [draft, setDraft] = useState<Testimonial>({
    id: "",
    name: "",
    location: "",
    quote: "",
    rating: 5,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage
    setItems(getTestimonials());
  }, []);

  const handleAdd = () => {
    if (!draft.name.trim() || !draft.quote.trim()) return;
    const next: Testimonial = {
      ...draft,
      id: crypto.randomUUID(),
    };
    const updated = [next, ...items];
    setItems(updated);
    saveTestimonials(updated);
    setDraft({ id: "", name: "", location: "", quote: "", rating: 5 });
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((t) => t.id !== id);
    setItems(updated);
    saveTestimonials(updated);
  };

  const handleUpdate = (id: string, patch: Partial<Testimonial>) => {
    const updated = items.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setItems(updated);
  };

  const handleSaveAll = () => {
    saveTestimonials(items);
  };

  const handleResetDefaults = () => {
    setItems(DEFAULT_TESTIMONIALS);
    saveTestimonials(DEFAULT_TESTIMONIALS);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-black flex items-center gap-2">
            <Quote className="text-emerald" size={22} />
            Testimonials
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Words from clients - shown on the homepage testimonials grid.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px]"
          >
            <Save size={14} />
            Save all
          </button>
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/60 hover:bg-black/5 transition-colors min-h-[44px]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Add form */}
      <div className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-sm mb-6">
        <h3 className="font-heading text-lg font-semibold text-black mb-4">Add new</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Name"
            className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 py-2.5 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
            autoComplete="off"
          />
          <input
            type="text"
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            placeholder="Location (e.g. Lagos)"
            className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 py-2.5 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
            autoComplete="off"
          />
          <textarea
            value={draft.quote}
            onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
            placeholder="Quote"
            rows={3}
            className="sm:col-span-2 rounded-lg border border-black/10 bg-cream px-4 py-2.5 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none resize-y"
          />
          <label className="flex items-center gap-3 text-sm text-black/70">
            <span>Rating</span>
            <input
              type="number"
              min={1}
              max={5}
              value={draft.rating}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)),
                })
              }
              className="w-20 min-h-[44px] rounded-lg border border-black/10 bg-cream px-3 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
              inputMode="numeric"
            />
          </label>
          <button
            type="button"
            onClick={handleAdd}
            className="sm:justify-self-end inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px]"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-black/55">No testimonials yet.</p>
        )}
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) => handleUpdate(t.id, { name: e.target.value })}
                  className="min-h-[44px] rounded-lg border border-black/10 px-3 text-sm font-medium focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                  autoComplete="off"
                />
                <input
                  type="text"
                  value={t.location}
                  onChange={(e) =>
                    handleUpdate(t.id, { location: e.target.value })
                  }
                  className="min-h-[44px] rounded-lg border border-black/10 px-3 text-sm text-black/70 focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleUpdate(t.id, { rating: i + 1 })}
                      aria-label={`${i + 1} stars`}
                      className="p-0.5"
                    >
                      <Star
                        size={16}
                        className={
                          i < t.rating ? "fill-gold text-gold" : "text-black/15"
                        }
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="grid h-9 w-9 place-items-center rounded-full text-red-600/80 hover:bg-red-50"
                  aria-label={`Delete testimonial from ${t.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <textarea
              value={t.quote}
              onChange={(e) => handleUpdate(t.id, { quote: e.target.value })}
              rows={2}
              className="mt-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none resize-y"
            />
          </div>
        ))}
      </div>

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
