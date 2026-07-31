"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Check, ImageOff, Loader2, Upload, X } from "lucide-react";
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

function shortLabel(label: string): string {
  const parts = label.split(" — ");
  return parts.length > 1 ? parts[1] : label;
}

export default function AdminPlacementsPage() {
  const [placements, setPlacements] = useState<PlacementRecord[] | null>(null);
  const [images, setImages] = useState<ImageOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pickerForSlot, setPickerForSlot] = useState<string | null>(null);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const loadAll = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

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
    showToast(imageId ? "Photo updated! Check the live site." : "Photo cleared.");
  };

  const uploadAndAssign = useCallback(
    async (file: File, slotKey: string) => {
      if (!supabase) return;
      setUploading(true);
      setUploadError(null);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", "collections");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(
            typeof data.error === "string" ? data.error : "Upload failed."
          );
        }

        const { data: newRow, error: insertError } = await supabase
          .from("images")
          .insert({
            name: file.name.replace(/\.[^/.]+$/, ""),
            category: "uncategorized",
            url: data.url,
          })
          .select()
          .single();

        if (insertError || !newRow) {
          throw new Error(
            "Photo saved, but could not create its record: " +
              (insertError?.message ?? "unknown error")
          );
        }

        await assignImage(slotKey, newRow.id);
      } catch (err: unknown) {
        setUploadError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setUploading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;

    const handleNativeChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      const slotKey = pickerForSlot;
      if (!files || files.length === 0 || !slotKey) return;
      const selectedFile = files[0];
      target.value = "";
      void uploadAndAssign(selectedFile, slotKey);
    };

    input.addEventListener("change", handleNativeChange);
    return () => input.removeEventListener("change", handleNativeChange);
  }, [pickerForSlot, uploadAndAssign]);

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        aria-label="Choose a new photo from your device"
      />

      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-black">
          Manage Photos
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Tap any photo below to change it. Pick from your gallery, take a
          new one with your camera, or reuse a photo you already added.
        </p>
      </div>

      {loadError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
          <ImageOff size={18} className="mt-0.5 shrink-0 text-red-500" />
          <p>{loadError}</p>
        </div>
      )}

      {placements === null && !loadError && (
        <p className="text-black/50 py-10 text-center">Loading your photos...</p>
      )}

      {grouped.map(([groupName, rows]) => (
        <div key={groupName} className="mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald mb-3">
            {groupName}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {rows.map((p) => (
              <button
                key={p.slot_key}
                type="button"
                onClick={() => {
                  setUploadError(null);
                  setPickerForSlot(p.slot_key);
                }}
                className="text-left bg-white rounded-xl border border-emerald/10 overflow-hidden shadow-sm hover:border-emerald/40 hover:shadow-md transition-all"
              >
                <div
                  className="aspect-square w-full bg-cover bg-center bg-gray-100 relative"
                  style={
                    p.images?.url
                      ? { backgroundImage: "url(" + JSON.stringify(p.images.url) + ")" }
                      : undefined
                  }
                >
                  {!p.images?.url && (
                    <div className="h-full w-full flex flex-col items-center justify-center text-emerald/50 gap-1.5">
                      <Upload size={22} />
                      <span className="text-[10px] font-medium uppercase tracking-wide">
                        Tap to add
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-black truncate">
                    {shortLabel(p.slot_label)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {pickerForSlot && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => !uploading && setPickerForSlot(null)}
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
                disabled={uploading}
                aria-label="Close"
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-black/5 disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-black/5">
              <button
                type="button"
                onClick={triggerUpload}
                disabled={uploading}
                className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-lg bg-emerald text-cream text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-70"
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Take Photo or Choose from Gallery
                  </>
                )}
              </button>
              {uploadError && (
                <p className="mt-2 text-xs text-red-600">{uploadError}</p>
              )}
              <p className="mt-3 text-xs text-black/40 text-center">
                Or pick a photo you already added, below
              </p>
            </div>

            <div className="overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => assignImage(pickerForSlot, null)}
                disabled={savingSlot === pickerForSlot || uploading}
                className="aspect-square rounded-lg border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-1 text-black/50 hover:border-emerald hover:text-emerald transition-colors text-xs"
              >
                <ImageOff size={20} />
                No Photo
              </button>
              {images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => assignImage(pickerForSlot, img.id)}
                  disabled={savingSlot === pickerForSlot || uploading || !img.url}
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-black text-cream text-sm font-medium px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
          <Check size={16} className="text-emerald" />
          {toast}
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