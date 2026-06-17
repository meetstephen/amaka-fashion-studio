"use client";

import { useState } from "react";
import { Upload, Pencil, Trash2, X, Check, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────

interface ImageItem {
  /** Local ID used for React keys and state management */
  id: number;
  /** Display name of the image */
  name: string;
  /** Category tag e.g. "collections", "lookbook", "hero" */
  category: string;
  /** Tailwind gradient class shown as a placeholder when no URL is available */
  gradient: string;
  /** Real Supabase Storage public URL — only set after a successful upload */
  url?: string;
}

// ── Seed data (placeholder items shown before real images are fetched) ────
// TODO: Replace this with a real Supabase query from the 'images' table.

const SEED_IMAGES: ImageItem[] = [
  {
    id: 1,
    name: "Senator Wear Collection",
    category: "collections",
    gradient: "bg-gradient-to-br from-emerald via-emerald-dark to-black",
  },
  {
    id: 2,
    name: "Bespoke Suits Hero",
    category: "hero",
    gradient: "bg-gradient-to-br from-black via-gray-900 to-emerald-dark",
  },
  {
    id: 3,
    name: "Kaftan Lookbook Shot",
    category: "lookbook",
    gradient: "bg-gradient-to-br from-emerald-dark via-black to-gray-900",
  },
  {
    id: 4,
    name: "Agbada Detail Close-up",
    category: "collections",
    gradient: "bg-gradient-to-br from-yellow-900 via-emerald-dark to-black",
  },
  {
    id: 5,
    name: "Atelier Workshop",
    category: "about",
    gradient: "bg-gradient-to-br from-emerald via-green-900 to-black",
  },
  {
    id: 6,
    name: "Gold Embroidery Detail",
    category: "featured",
    gradient: "bg-gradient-to-br from-amber-100 via-yellow-200 to-emerald/30",
  },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageItem[]>(SEED_IMAGES);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // ── Upload handler ───────────────────────────────────────────────────────
  /**
   * Sends the selected file to our secure server-side API route
   * /api/admin/upload, which verifies the admin session cookie and
   * then uploads to Supabase Storage using the service role key.
   *
   * The service role key bypasses all RLS — no Supabase policy change needed.
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // Reset the input so the same file can be selected again later
    e.target.value = "";

    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadError(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "collections");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
        // No Content-Type header — browser sets it automatically with
        // the correct multipart boundary when body is FormData.
      });

      const result = await response.json() as {
        success?: boolean;
        url?: string;
        path?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Upload failed. Please try again.");
      }

      // Add the uploaded image to the top of the list
      const newImage: ImageItem = {
        id: Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ""), // strip file extension from display name
        category: "uncategorized",
        gradient: "bg-gradient-to-br from-gray-400 to-gray-600",
        url: result.url, // real Supabase CDN public URL
      };

      setImages((prev) => [newImage, ...prev]);

      // TODO: Also save a row to your Supabase 'images' table:
      // import { supabase } from "@/lib/supabase";
      // await supabase.from("images").insert({
      //   name: newImage.name,
      //   category: newImage.category,
      //   url: result.url,
      // });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  // ── Edit handlers ────────────────────────────────────────────────────────

  const startEdit = (image: ImageItem) => {
    setEditingId(image.id);
    setEditName(image.name);
    setEditCategory(image.category);
  };

  const saveEdit = () => {
    // TODO: Also update the row in Supabase 'images' table
    setImages((prev) =>
      prev.map((img) =>
        img.id === editingId
          ? { ...img, name: editName, category: editCategory }
          : img
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  // ── Delete handler ───────────────────────────────────────────────────────

  const handleDelete = (id: number) => {
    // TODO: Also delete from Supabase Storage and 'images' table
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDeleteConfirmId(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-black">
            Image Management
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Upload and manage all site images
          </p>
        </div>

        {/* Upload button — wraps a hidden file input */}
        <label
          aria-label="Upload image"
          className={[
            "inline-flex items-center gap-2 px-5 min-h-[48px] rounded-lg font-medium transition-colors select-none",
            uploading
              ? "bg-emerald/60 text-cream cursor-not-allowed pointer-events-none"
              : "bg-emerald text-cream hover:bg-emerald-dark cursor-pointer",
          ].join(" ")}
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload Image
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            aria-label="Choose an image file to upload"
          />
        </label>
      </div>

      {/* Upload error banner */}
      {uploadError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">Upload failed</p>
            <p className="mt-1 text-red-600">{uploadError}</p>
          </div>
          <button
            onClick={() => setUploadError(null)}
            aria-label="Dismiss error"
            className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={16} />
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
            {/* Thumbnail: real image if URL available, gradient placeholder otherwise */}
            {image.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.url}
                alt={image.name}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className={`aspect-video ${image.gradient}`} />
            )}

            {/* Card body */}
            <div className="p-4">
              {editingId === image.id ? (
                /* ── Edit mode ── */
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
                      onClick={cancelEdit}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-gray-300 text-black rounded-md text-sm hover:bg-gray-50 transition-colors"
                      aria-label="Cancel editing"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-black text-sm truncate">
                      {image.name}
                    </h3>
                    {image.url && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-black/50 mt-1 capitalize">
                    {image.category}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEdit(image)}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-emerald/20 text-emerald rounded-md text-sm hover:bg-emerald/5 transition-colors"
                      aria-label={`Edit ${image.name}`}
                    >
                      <Pencil size={14} />
                      Edit
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
