"use client";

import { useEffect, useState } from "react";
import { Upload, Pencil, Trash2, X, Check, Camera } from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { uploadImage, deleteImage } from "@/lib/upload";

interface ImageItem {
  id: number | string;
  name: string;
  category: string;
  gradient: string;
  url?: string;
}

// Starts empty - the owner uploads real photos which persist to Supabase.
const initialImages: ImageItem[] = [];

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);
  const [replaceFlashId, setReplaceFlashId] = useState<number | string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("images")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          setImages(
            data.map((row) => ({
              id: row.id,
              name: row.name || "",
              category: row.category || "uncategorized",
              gradient: "bg-gradient-to-br from-emerald via-emerald-dark to-black",
              url: row.url || undefined,
            }))
          );
          return;
        }
      }
      setImages(initialImages);
    }
    loadData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    if (isSupabaseConfigured() && supabase) {
      let successCount = 0;
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, "gallery");
        if (url) {
          const { data, error } = await supabase
            .from("images")
            .insert({
              url,
              name: file.name.replace(/\.[^/.]+$/, ""),
              category: "uncategorized",
            })
            .select()
            .single();
          if (!error && data) {
            setImages((prev) => [
              {
                id: data.id,
                name: data.name || "",
                category: data.category || "uncategorized",
                gradient: "bg-gradient-to-br from-emerald via-emerald-dark to-black",
                url: data.url || undefined,
              },
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
      // localStorage fallback
      const placeholderGradients = [
        "bg-gradient-to-br from-emerald to-emerald-dark",
        "bg-gradient-to-br from-emerald-dark to-black",
        "bg-gradient-to-br from-black to-emerald",
        "bg-gradient-to-br from-emerald-light to-emerald",
        "bg-gradient-to-br from-emerald to-black",
      ];
      const newImages: ImageItem[] = Array.from(files).map((f, idx) => ({
        id: Date.now() + idx,
        name: f.name.replace(/\.[^/.]+$/, ""),
        category: "uncategorized",
        gradient: placeholderGradients[idx % placeholderGradients.length],
      }));
      setImages((prev) => [...newImages, ...prev]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleReplace = async (id: number | string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    if (isSupabaseConfigured() && supabase) {
      const current = images.find((img) => img.id === id);
      if (current?.url) {
        await deleteImage(current.url);
      }
      const url = await uploadImage(file, "gallery");
      if (url) {
        const { error } = await supabase.from("images").update({ url }).eq("id", id);
        if (!error) {
          setImages((prev) =>
            prev.map((img) => (img.id === id ? { ...img, url } : img))
          );
        } else {
          setUploadError("Failed to update image record. Please try again.");
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

  const startEdit = (image: ImageItem) => {
    setEditingId(image.id);
    setEditName(image.name);
    setEditCategory(image.category);
  };

  const saveEdit = async () => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from("images")
        .update({ name: editName, category: editCategory })
        .eq("id", editingId);
      if (!error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === editingId
              ? { ...img, name: editName, category: editCategory }
              : img
          )
        );
        setEditingId(null);
        return;
      }
    }
    setImages((prev) =>
      prev.map((img) =>
        img.id === editingId
          ? { ...img, name: editName, category: editCategory }
          : img
      )
    );
    setEditingId(null);
  };

  const handleDelete = async (id: number | string) => {
    if (isSupabaseConfigured() && supabase) {
      const current = images.find((img) => img.id === id);
      if (current?.url) {
        await deleteImage(current.url);
      }
      const { error } = await supabase.from("images").delete().eq("id", id);
      if (!error) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        setDeleteConfirmId(null);
        return;
      }
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-black">
            Image Management
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Upload, rename and replace site images. Tap the badge on any
            thumbnail to replace it. Multi-select supported on mobile.
          </p>
        </div>

        {/* Upload buttons - gallery (multi-select) + camera */}
        <div className="flex flex-wrap gap-2">
          <label
            className={`inline-flex items-center gap-2 px-5 min-h-[48px] bg-emerald text-cream rounded-lg hover:bg-emerald-dark transition-colors cursor-pointer font-medium text-sm ${uploading ? "pointer-events-none opacity-60" : ""}`}
            aria-label="Upload images from gallery"
            aria-disabled={uploading}
          >
            <Upload size={18} />
            Upload images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              aria-label="Choose one or more image files"
              disabled={uploading}
            />
          </label>
          <label
            className={`inline-flex items-center gap-2 px-4 min-h-[48px] border border-emerald text-emerald rounded-lg hover:bg-emerald/5 transition-colors cursor-pointer font-medium text-sm ${uploading ? "pointer-events-none opacity-60" : ""}`}
            aria-label="Take photo with camera"
            aria-disabled={uploading}
          >
            <Upload size={16} />
            Take photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleUpload}
              className="hidden"
              aria-label="Capture photo with camera"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

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

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-xl border border-emerald/10 overflow-hidden shadow-sm"
          >
            {/* Thumbnail with always-visible "Tap to replace" badge */}
            <div className="relative">
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.name}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className={`aspect-video ${image.gradient}`} />
              )}

              {/* Bottom gradient overlay so badge always has contrast */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
              />

              {/* "Replaced!" flash feedback */}
              {replaceFlashId === image.id && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream shadow-lg"
                >
                  <Check size={12} />
                  Replaced!
                </div>
              )}

              {/* Always-visible "Tap to replace" badge - mobile-first */}
              <label
                htmlFor={`replace-${image.id}`}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-emerald/90 backdrop-blur-sm px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream cursor-pointer hover:bg-emerald transition-colors shadow-lg min-h-[36px]"
                aria-label={`Replace image ${image.name}`}
              >
                <Camera size={12} />
                Tap to replace
              </label>
              <input
                id={`replace-${image.id}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleReplace(image.id, e)}
                className="hidden"
                aria-label={`Choose replacement file for ${image.name}`}
              />
            </div>

            {/* Info */}
            <div className="p-4">
              {editingId === image.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-md border border-gray-300 text-sm text-black focus:border-emerald focus:ring-1 focus:ring-emerald/20 outline-none"
                    placeholder="Image name"
                    aria-label="Image name"
                  />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-md border border-gray-300 text-sm text-black focus:border-emerald focus:ring-1 focus:ring-emerald/20 outline-none"
                    aria-label="Image category"
                  >
                    <option value="collections">Collections</option>
                    <option value="lookbook">Lookbook</option>
                    <option value="hero">Hero</option>
                    <option value="about">About</option>
                    <option value="featured">Featured</option>
                    <option value="uncategorized">Uncategorized</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 bg-emerald text-cream rounded-md text-sm font-medium hover:bg-emerald-dark transition-colors"
                      aria-label="Save changes"
                    >
                      <Check size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-gray-300 text-black rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                      aria-label="Cancel editing"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-black text-sm truncate">
                    {image.name}
                  </h3>
                  <p className="text-xs text-black/50 mt-1 capitalize">
                    {image.category}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEdit(image)}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-emerald/20 text-emerald rounded-md text-sm hover:bg-emerald/5 transition-colors"
                      aria-label={`Rename ${image.name}`}
                    >
                      <Pencil size={14} />
                      Rename
                    </button>
                    {deleteConfirmId === image.id ? (
                      <div className="flex-1 flex gap-1">
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="flex-1 min-h-[44px] inline-flex items-center justify-center bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors"
                          aria-label="Confirm delete"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 min-h-[44px] inline-flex items-center justify-center border border-gray-300 text-black rounded-md text-xs hover:bg-gray-50 transition-colors"
                          aria-label="Cancel delete"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(image.id)}
                        className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${image.name}`}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {images.length === 0 && !uploading && (
        <div className="rounded-2xl border border-dashed border-emerald/30 bg-white/50 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald/10">
            <Camera size={24} className="text-emerald" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-black">
            No images yet
          </h3>
          <p className="mt-1 text-sm text-black/55 max-w-sm mx-auto">
            Tap <span className="font-medium text-emerald">Upload images</span> or{" "}
            <span className="font-medium text-emerald">Take photo</span> above to add
            your first piece. Photos appear here and on the public site instantly.
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
