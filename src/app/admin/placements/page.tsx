"use client";

import { useEffect, useState, useMemo } from "react";
import { Check, ImageOff, X } from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface PlacementRecord {
  id: string;
  slot_key: string;
  slot_label: string;
  page_group: string;
  image_id: string | null;
  images: { url: string | null } | null;
}

interface ImageOption {
  id: string;
  name: string;
  url: string | null;
}

export default function AdminPlacementsPage() {
  const [placements, setPlacements] = useState<PlacementRecord[] | null>(null);
  const [images, setImages] = useState<ImageOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pickerForSlot, setPickerForSlot] = useState<string | null>(null);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);

  const loadAll = async () => {
    setLoadError(null);
    if (!isSupabaseConfigured() || !supabase) {
      setLoadError("Supabase is not configured.");
      return;
    }

    const [placementsRes, imagesRes] = await Promise.all([
      supabase
        .from("placements")
        .select("id, slot_key, slot_label, page_group, image_id, images(url)")
        .order("page_group")
        .order("sort_order"),
      supabase
        .from("images")
        .select("id, name, url")
        .order("created_at", { ascending: false }),
    ]);

    if (placementsRes.error) {
      setLoadError("Could not load placements: " + placementsRes.error.message);
      return;
    }
    if (imagesRes.error) {
      setLoadError("Could not load images: " + imagesRes.error.message);
      return;
    }

    setPlacements(placementsRes.data as unknown as PlacementRecord[]);
    setImages((imagesRes.data ?? []) as ImageOption[]);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const grouped = useMemo(() => {
    if (!placements) return [];
    const groups: Record<string, PlacementRecord[]> = {};
    for (const p of placements) {
      if (!groups[p.page_group]) groups[p.page_group] = [];
      groups[p.page_group].push(p);
    }
    return Object.entries(groups);
  }, [placements]);

  const assignImage = async (slotKey: string, imageId: string | null) => {
    if (!supabase) return;
    setSavingSlot(slotKey);
    const { error } = await supabase
      .from("placements")
      .update({ image_id: imageId, updated_at: new Date().toISOString() })
      .eq("slot_key", slotKey);
    if (error) {
      setLoadError("Failed to assign image: " + error.message);
      setSavingSlot(null);
      return;
    }
    await loadAll();
    setSavingSlot(null);
    setPickerForSlot(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-black">
          Page Placements
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Decide exactly where every uploaded photo appears on the site. No
          filenames, no categories to remember - just tap a slot, pick a
          photo.
        </p>
      </div>

      {loadError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
          <ImageOff size={18} className="mt-0.5 shrink-0 text-red-500" />
          <p>{loadError}</p>
        </div>
      )}

      {placements === null && !loadError && (
        <p className="text-black/50 py-10 text-center">Loading placements...</p>
      )}

      {grouped.map(([groupName, rows]) => (
        <div key={groupName} className="mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald mb-3">
            {groupName}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((p) => (
              <div
                key={p.slot_key}
                className="bg-white rounded-xl border border-emerald/10 overflow-hidden shadow-sm"
              >
                <div
                  className="aspect-video w-full bg-cover bg-center bg-gray-100"
                  style={
                    p.images?.url
                      ? { backgroundImage: "url(" + JSON.stringify(p.images.url) + ")" }
                      : undefined
                  }
                >
                  {!p.images?.url && (
                    <div className="h-full w-full flex items-center justify-center text-black/30 text-xs">
                      No photo assigned
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-black truncate">
                    {p.slot_label}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPickerForSlot(p.slot_key)}
                    className="mt-2 w-full min-h-[40px] rounded-md border border-emerald/30 text-emerald text-xs font-medium hover:bg-emerald/5 transition-colors"
                  >
                    {p.images?.url ? "Change Photo" : "Assign Photo"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {pickerForSlot && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => setPickerForSlot(null)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-black/5">
              <p className="font-medium text-black">Choose a photo</p>
              <button
                type="button"
                onClick={() => setPickerForSlot(null)}
                aria-label="Close"
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => assignImage(pickerForSlot, null)}
                disabled={savingSlot === pickerForSlot}
                className="aspect-square rounded-lg border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-1 text-black/50 hover:border-emerald hover:text-emerald transition-colors text-xs"
              >
                <ImageOff size={20} />
                Clear
              </button>
              {images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => assignImage(pickerForSlot, img.id)}
                  disabled={savingSlot === pickerForSlot || !img.url}
                  className="relative aspect-square rounded-lg overflow-hidden border border-black/10 bg-gray-100 bg-cover bg-center disabled:opacity-40"
                  style={img.url ? { backgroundImage: "url(" + JSON.stringify(img.url) + ")" } : undefined}
                >
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-cream text-[10px] px-1.5 py-1 truncate">
                    {img.name}
                  </span>
                  {savingSlot === pickerForSlot && (
                    <span className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <Check size={18} className="text-emerald animate-pulse" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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