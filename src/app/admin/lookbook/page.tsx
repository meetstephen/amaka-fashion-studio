"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Plus, Camera, Check } from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { uploadImage, deleteImage } from "@/lib/upload";

interface LookbookItem {
  id: number | string;
  title: string;
  caption: string;
  gradient: string;
  image_url?: string;
}

// Starts empty - the owner uploads real lookbook photos which persist to Supabase.
const initialItems: LookbookItem[] = [];

export default function AdminLookbookPage() {
  const [items, setItems] = useState<LookbookItem[]>(initialItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [replaceFlashId, setReplaceFlashId] = useState<number | string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("lookbook")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          setItems(
            data.map((row) => ({
              id: row.id,
              title: row.title || "",
              caption: row.caption || "",
              gradient: "bg-gradient-to-br from-emerald via-emerald-dark to-black",
              image_url: row.image_url || undefined,
            }))
          );
          return;
        }
      }
      setItems(initialItems);
    }
    loadData();
  }, []);

  const handleAddItem = async () => {
    if (!newTitle.trim()) return;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("lookbook")
        .insert({ title: newTitle, caption: newCaption })
        .select()
        .single();
      if (!error && data) {
        setItems((prev) => [
          { id: data.id, title: data.title || "", caption: data.caption || "", gradient: "bg-gradient-to-br from-gray-400 to-gray-600", image_url: data.image_url || undefined },
          ...prev,
        ]);
        setNewTitle("");
        setNewCaption("");
        setShowAddForm(false);
        return;
      }
    }

    const newItem: LookbookItem = {
      id: Date.now(),
      title: newTitle,
      caption: newCaption,
      gradient: "bg-gradient-to-br from-gray-400 to-gray-600",
    };
    setItems((prev) => [newItem, ...prev]);
    setNewTitle("");
    setNewCaption("");
    setShowAddForm(false);
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    if (isSupabaseConfigured() && supabase) {
      let successCount = 0;
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, "lookbook");
        if (url) {
          const { data, error } = await supabase
            .from("lookbook")
            .insert({ image_url: url, title: file.name.replace(/\.[^/.]+$/, ""), caption: "" })
            .select()
            .single();
          if (!error && data) {
            setItems((prev) => [
              { id: data.id, title: data.title || "", caption: data.caption || "", gradient: "bg-gradient-to-br from-emerald via-emerald-dark to-black", image_url: data.image_url || undefined },
              ...prev,
            ]);
            successCount++;
          }
        }
      }
      if (successCount === 0) {
        setUploadError("Upload failed. Please check that your Supabase Storage bucket 'images' has the correct policies enabled. See supabase/rls-policies.sql for the SQL to run.");
      }
    } else {
      const palette = [
        "bg-gradient-to-br from-emerald via-emerald-dark to-black",
        "bg-gradient-to-br from-black via-gray-900 to-emerald-dark",
        "bg-gradient-to-br from-emerald-dark via-black to-gray-900",
        "bg-gradient-to-br from-yellow-900 via-emerald-dark to-black",
        "bg-gradient-to-br from-emerald via-green-900 to-black",
        "bg-gradient-to-br from-amber-100 via-yellow-200 to-emerald/30",
      ];
      const newItems: LookbookItem[] = Array.from(files).map((f, idx) => ({
        id: Date.now() + idx,
        title: f.name.replace(/\.[^/.]+$/, ""),
        caption: "",
        gradient: palette[idx % palette.length],
      }));
      setItems((prev) => [...newItems, ...prev]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleUpdateItem = async (id: number | string, field: "title" | "caption", value: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("lookbook").update({ [field]: value }).eq("id", id);
      if (!error) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
        return;
      }
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDelete = async (id: number | string) => {
    if (isSupabaseConfigured() && supabase) {
      const current = items.find((item) => item.id === id);
      if (current?.image_url) {
        await deleteImage(current.image_url);
      }
      const { error } = await supabase.from("lookbook").delete().eq("id", id);
      if (!error) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        return;
      }
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReplace = async (id: number | string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    if (isSupabaseConfigured() && supabase) {
      const current = items.find((item) => item.id === id);
      if (current?.image_url) {
        await deleteImage(current.image_url);
      }
      const url = await uploadImage(file, "lookbook");
      if (url) {
        const { error } = await supabase.from("lookbook").update({ image_url: url }).eq("id", id);
        if (!error) {
          setItems((prev) => prev.map((item) => (item.id === id ? { ...item, image_url: url } : item)));
        } else {
          setUploadError("Failed to update lookbook record. Please try again.");
        }
      } else {
        setUploadError("Upload failed. Please check that your Supabase Storage bucket 'images' has the correct policies enabled. See supabase/rls-policies.sql for the SQL to run.");
      }
    }

    setReplaceFlashId(id);
    setTimeout(() => setReplaceFlashId(null), 1500);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-black">
            Lookbook Manager
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Manage lookbook gallery photos and descriptions. Tap the badge on
            any thumbnail to swap its photo.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className={`inline-flex items-center gap-2 px-4 min-h-[48px] bg-emerald text-cream rounded-lg hover:bg-emerald-dark transition-colors font-medium text-sm ${uploading ? "pointer-events-none opacity-60" : ""}`}
            aria-label="Add new item"
            aria-disabled={uploading}
          >
            <Plus size={18} />
            Add Item
          </button>
          <label
            className={`inline-flex items-center gap-2 px-4 min-h-[48px] border border-emerald text-emerald rounded-lg hover:bg-emerald/5 transition-colors cursor-pointer font-medium text-sm ${uploading ? "pointer-events-none opacity-60" : ""}`}
            aria-label="Upload photos from gallery (multiple supported)"
            aria-disabled={uploading}
          >
            <Upload size={18} />
            Upload photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUploadPhoto}
              className="hidden"
              aria-label="Choose one or more lookbook photos"
              disabled={uploading}
            />
          </label>
          <label
            className={`inline-flex items-center gap-2 px-4 min-h-[48px] border border-emerald/30 text-emerald rounded-lg hover:bg-emerald/5 transition-colors cursor-pointer font-medium text-sm ${uploading ? "pointer-events-none opacity-60" : ""}`}
            aria-label="Take photo with camera"
            aria-disabled={uploading}
          >
            <Upload size={16} />
            Camera
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleUploadPhoto}
              className="hidden"
              aria-label="Capture lookbook photo with camera"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Add new item form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-emerald/10 p-5 shadow-sm mb-6">
          <h3 className="font-medium text-black mb-4">New Lookbook Item</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="w-full min-h-[44px] px-4 rounded-lg border border-gray-300 text-sm text-black focus:border-emerald focus:ring-1 focus:ring-emerald/20 outline-none"
              aria-label="New item title"
            />
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Caption"
              className="w-full min-h-[44px] px-4 rounded-lg border border-gray-300 text-sm text-black focus:border-emerald focus:ring-1 focus:ring-emerald/20 outline-none"
              aria-label="New item caption"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                className="min-h-[44px] px-5 bg-emerald text-cream rounded-lg text-sm font-medium hover:bg-emerald-dark transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="min-h-[44px] px-5 border border-gray-300 text-black rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload feedback */}
      {uploading && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald/10 px-4 py-3 text-sm text-emerald">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
          Uploading...
        </div>
      )}

      {uploadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {uploadError}
          <button
            onClick={() => setUploadError(null)}
            className="ml-2 text-red-500 hover:text-red-700 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-emerald/10 overflow-hidden shadow-sm"
          >
            {/* Thumbnail with always-visible "Tap to replace" badge */}
            <div className="relative">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className={`aspect-[4/3] ${item.gradient}`} />
              )}

              {/* Bottom gradient overlay so badge always has contrast */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
              />

              {/* "Replaced!" flash feedback */}
              {replaceFlashId === item.id && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream shadow-lg"
                >
                  <Check size={12} />
                  Replaced!
                </div>
              )}

              {/* Always-visible "Tap to replace" badge */}
              <label
                htmlFor={`replace-look-${item.id}`}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-emerald/90 backdrop-blur-sm px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream cursor-pointer hover:bg-emerald transition-colors shadow-lg min-h-[36px]"
                aria-label={`Replace photo for ${item.title}`}
              >
                <Camera size={12} />
                Tap to replace
              </label>
              <input
                id={`replace-look-${item.id}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleReplace(item.id, e)}
                className="hidden"
                aria-label={`Choose replacement file for ${item.title}`}
              />
            </div>

            {/* Editable fields */}
            <div className="p-4 space-y-3">
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-md border border-gray-200 text-sm font-medium text-black focus:border-emerald focus:ring-1 focus:ring-emerald/20 outline-none"
                aria-label={`Title for ${item.title}`}
              />
              <input
                type="text"
                value={item.caption}
                onChange={(e) => handleUpdateItem(item.id, "caption", e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-md border border-gray-200 text-sm text-black/70 focus:border-emerald focus:ring-1 focus:ring-emerald/20 outline-none"
                placeholder="Add a caption..."
                aria-label={`Caption for ${item.title}`}
              />
              <button
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center gap-1 min-h-[44px] px-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                aria-label={`Delete ${item.title}`}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {items.length === 0 && !uploading && (
        <div className="rounded-2xl border border-dashed border-emerald/30 bg-white/50 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald/10">
            <Camera size={24} className="text-emerald" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-black">
            Your lookbook is empty
          </h3>
          <p className="mt-1 text-sm text-black/55 max-w-sm mx-auto">
            Tap <span className="font-medium text-emerald">Upload photos</span> or{" "}
            <span className="font-medium text-emerald">Camera</span> above to add your
            work. Each photo appears in the public lookbook gallery.
          </p>
        </div>
      )}

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
