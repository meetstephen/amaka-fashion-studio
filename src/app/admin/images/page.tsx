"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Pencil, Trash2, X, Check, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ImageRow {
  id: string;
  name: string;
  category: string;
  gradient: string | null;
  url: string | null;
  created_at: string;
}

const SEED_DEFINITIONS = [
  { name: "Senator Wear Collection", category: "collections", gradient: "bg-gradient-to-br from-emerald via-emerald-dark to-black" },
  { name: "Bespoke Suits Hero", category: "hero", gradient: "bg-gradient-to-br from-black via-gray-900 to-emerald-dark" },
  { name: "Kaftan Lookbook Shot", category: "lookbook", gradient: "bg-gradient-to-br from-emerald-dark via-black to-gray-900" },
  { name: "Agbada Detail Close-up", category: "collections", gradient: "bg-gradient-to-br from-yellow-900 via-emerald-dark to-black" },
  { name: "Atelier Workshop", category: "about", gradient: "bg-gradient-to-br from-emerald via-green-900 to-black" },
  { name: "Gold Embroidery Detail", category: "featured", gradient: "bg-gradient-to-br from-amber-100 via-yellow-200 to-emerald/30" },
];

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async () => {
    setLoadError(null);
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      setLoadError(
        "Could not load images from the database: " +
          error.message +
          ". Make sure the 'images' table has been created in Supabase."
      );
      return;
    }

    if (!data || data.length === 0) {
      const { error: seedError } = await supabase.from("images").insert(
        SEED_DEFINITIONS.map((s) => ({
          name: s.name,
          category: s.category,
          gradient: s.gradient,
          url: null,
        }))
      );
      if (seedError) {
        setLoadError("Could not seed default images: " + seedError.message);
        return;
      }
      const { data: seeded, error: refetchError } = await supabase
        .from("images")
        .select("*")
        .order("created_at", { ascending: true });
      if (refetchError) {
        setLoadError("Could not load images: " + refetchError.message);
        return;
      }
      setImages(seeded ?? []);
      return;
    }

    setImages(data);
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const processFile = useCallback(
    async (file: File, targetId: string | null) => {
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
            typeof data.error === "string" ? data.error : "Upload failed. Please try again."
          );
        }

        const newUrl: string | null = typeof data.url === "string" ? data.url : null;

        if (targetId !== null) {
          const { error } = await supabase
            .from("images")
            .update({ url: newUrl })
            .eq("id", targetId);
          if (error) throw new Error("Saved file but failed to update database: " + error.message);
        } else {
          const { error } = await supabase.from("images").insert({
            name: file.name.replace(/\.[^/.]+$/, ""),
            category: "uncategorized",
            gradient: "bg-gradient-to-br from-gray-400 to-gray-600",
            url: newUrl,
          });
          if (error) throw new Error("Saved file but failed to save database row: " + error.message);
        }

        await loadImages();
      } catch (err: unknown) {
        setUploadError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setUploading(false);
        setReplaceTargetId(null);
      }
    },
    [loadImages]
  );

  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;

    const handleNativeChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      const targetId = replaceTargetId;
      if (!files || files.length === 0) return;
      const selectedFile = files[0];
      target.value = "";
      void processFile(selectedFile, targetId);
    };

    input.addEventListener("change", handleNativeChange);
    return () => input.removeEventListener("change", handleNativeChange);
  }, [replaceTargetId, processFile]);

  const triggerAddUpload = () => {
    setReplaceTargetId(null);
    fileInputRef.current?.click();
  };

  const triggerReplaceUpload = (id: string) => {
    setReplaceTargetId(id);
    fileInputRef.current?.click();
  };

  const startEdit = (image: ImageRow) => {
    setEditingId(image.id);
    setEditName(image.name);
    setEditCategory(image.category);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("images")
      .update({ name: editName, category: editCategory })
      .eq("id", editingId);
    if (error) {
      setUploadError("Failed to save changes: " + error.message);
      return;
    }
    setEditingId(null);
    await loadImages();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("images").delete().eq("id", id);
    if (error) {
      setUploadError("Failed to delete: " + error.message);
      setDeleteConfirmId(null);
      return;
    }
    setDeleteConfirmId(null);
    await loadImages();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        aria-label="Choose an image file"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-black">Image Management</h2>
          <p className="text-black/60 text-sm mt-1">Upload and manage all site images</p>
        </div>

        <button
          type="button"
          onClick={triggerAddUpload}
          disabled={uploading}
          aria-label="Upload image"
          className={
            "inline-flex items-center gap-2 px-5 min-h-[48px] rounded-lg font-medium transition-colors select-none " +
            (uploading
              ? "bg-emerald/60 text-cream cursor-not-allowed"
              : "bg-emerald text-cream hover:bg-emerald-dark cursor-pointer")
          }
        >
          {uploading && replaceTargetId === null ? (
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
        </button>
      </div>

      {loadError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">Could not load images</p>
            <p className="mt-1 text-red-600">{loadError}</p>
          </div>
        </div>
      )}

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

      {images === null && !loadError ? (
        <div className="flex items-center justify-center py-20 text-black/50 gap-2">
          <Loader2 size={20} className="animate-spin" />
          Loading images…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(images ?? []).map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-xl border border-emerald/10 overflow-hidden shadow-sm"
            >
              <div
                className="aspect-video w-full bg-cover bg-center bg-no-repeat"
                style={
                  image.url
                    ? { backgroundImage: "url(" + JSON.stringify(image.url) + ")" }
                    : undefined
                }
              >
                {!image.url && (
                  <div className={"h-full w-full " + (image.gradient ?? "bg-gray-200")} />
                )}
              </div>

              <div className="p-4">
                {editingId === image.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-md border border-gray-300 text-sm text-black focus:border-emerald outline-none"
                      placeholder="Image name"
                      aria-label="Image name"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-md border border-gray-300 text-sm text-black focus:border-emerald outline-none"
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
                        className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-gray-300 text-black rounded-md text-sm hover:bg-gray-50 transition-colors"
                        aria-label="Cancel editing"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-black text-sm truncate">{image.name}</h3>
                      {image.url && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-black/50 mt-1 capitalize">{image.category}</p>

                    <button
                      type="button"
                      onClick={() => triggerReplaceUpload(image.id)}
                      disabled={uploading}
                      className="w-full mt-3 min-h-[44px] inline-flex items-center justify-center gap-1 border border-emerald/20 text-emerald rounded-md text-sm hover:bg-emerald/5 transition-colors disabled:opacity-50"
                      aria-label={(image.url ? "Replace photo for " : "Add photo for ") + image.name}
                    >
                      {uploading && replaceTargetId === image.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      {image.url ? "Replace Photo" : "Add Photo"}
                    </button>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEdit(image)}
                        className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-emerald/20 text-emerald rounded-md text-sm hover:bg-emerald/5 transition-colors"
                        aria-label={"Edit " + image.name}
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
                          aria-label={"Delete " + image.name}
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
