"use client";
import { useState } from "react";
import { Upload, Pencil, Trash2, X, Check, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ImageItem {
  id: number; name: string; category: string; gradient: string; url?: string;
}

const SEED_IMAGES: ImageItem[] = [
  { id: 1, name: "Senator Wear Collection", category: "collections", gradient: "bg-gradient-to-br from-emerald via-emerald-dark to-black" },
  { id: 2, name: "Bespoke Suits Hero", category: "hero", gradient: "bg-gradient-to-br from-black via-gray-900 to-emerald-dark" },
  { id: 3, name: "Kaftan Lookbook Shot", category: "lookbook", gradient: "bg-gradient-to-br from-emerald-dark via-black to-gray-900" },
  { id: 4, name: "Agbada Detail Close-up", category: "collections", gradient: "bg-gradient-to-br from-yellow-900 via-emerald-dark to-black" },
  { id: 5, name: "Atelier Workshop", category: "about", gradient: "bg-gradient-to-br from-emerald via-green-900 to-black" },
  { id: 6, name: "Gold Embroidery Detail", category: "featured", gradient: "bg-gradient-to-br from-amber-100 via-yellow-200 to-emerald/30" },
];

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageItem[]>(SEED_IMAGES);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    e.target.value = "";
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "collections");
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(typeof data.error === "string" ? data.error : "Upload failed. Please try again.");
      }
      setImages((prev) => [
        { id: Date.now(), name: file.name.replace(/\.[^/.]+$/, ""), category: "uncategorized",
          gradient: "bg-gradient-to-br from-gray-400 to-gray-600",
          url: typeof data.url === "string" ? data.url : undefined },
        ...prev,
      ]);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (image: ImageItem) => { setEditingId(image.id); setEditName(image.name); setEditCategory(image.category); };
  const saveEdit = () => {
    setImages((prev) => prev.map((img) => img.id === editingId ? { ...img, name: editName, category: editCategory } : img));
    setEditingId(null);
  };
  const handleDelete = (id: number) => { setImages((prev) => prev.filter((img) => img.id !== id)); setDeleteConfirmId(null); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-black">Image Management</h2>
          <p className="text-black/60 text-sm mt-1">Upload and manage all site images</p>
        </div>
        <label aria-label="Upload image" className={"inline-flex items-center gap-2 px-5 min-h-[48px] rounded-lg font-medium transition-colors select-none " + (uploading ? "bg-emerald/60 text-cream cursor-not-allowed pointer-events-none" : "bg-emerald text-cream hover:bg-emerald-dark cursor-pointer")}>
          {uploading ? (<><Loader2 size={18} className="animate-spin" />Uploading…</>) : (<><Upload size={18} />Upload Image</>)}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handleUpload} disabled={uploading} className="hidden" aria-label="Choose an image file" />
        </label>
      </div>

      {uploadError && (
        <div role="alert" aria-live="assertive" className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
          <div className="flex-1"><p className="font-semibold">Upload failed</p><p className="mt-1 text-red-600">{uploadError}</p></div>
          <button onClick={() => setUploadError(null)} aria-label="Dismiss error" className="shrink-0 text-red-400 hover:text-red-600 transition-colors"><X size={16} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-xl border border-emerald/10 overflow-hidden shadow-sm">
            <div className="aspect-video w-full bg-cover bg-center bg-no-repeat" style={image.url ? { backgroundImage: "url(" + JSON.stringify(image.url) + ")" } : undefined}>
              {!image.url && <div className={"h-full w-full " + image.gradient} />}
            </div>
            <div className="p-4">
              {editingId === image.id ? (
                <div className="space-y-3">
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full min-h-[44px] px-3 rounded-md border border-gray-300 text-sm text-black focus:border-emerald outline-none" placeholder="Image name" aria-label="Image name" />
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full min-h-[44px] px-3 rounded-md border border-gray-300 text-sm text-black focus:border-emerald outline-none" aria-label="Image category">
                    <option value="collections">Collections</option><option value="lookbook">Lookbook</option>
                    <option value="hero">Hero</option><option value="about">About</option>
                    <option value="featured">Featured</option><option value="uncategorized">Uncategorized</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 bg-emerald text-cream rounded-md text-sm font-medium hover:bg-emerald-dark transition-colors" aria-label="Save changes"><Check size={16} />Save</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-gray-300 text-black rounded-md text-sm hover:bg-gray-50 transition-colors" aria-label="Cancel editing"><X size={16} />Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-black text-sm truncate">{image.name}</h3>
                    {image.url && (<span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded-full"><span className="h-1.5 w-1.5 rounded-full bg-emerald" />Live</span>)}
                  </div>
                  <p className="text-xs text-black/50 mt-1 capitalize">{image.category}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => startEdit(image)} className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-emerald/20 text-emerald rounded-md text-sm hover:bg-emerald/5 transition-colors" aria-label={"Edit " + image.name}><Pencil size={14} />Edit</button>
                    {deleteConfirmId === image.id ? (
                      <div className="flex-1 flex gap-1">
                        <button onClick={() => handleDelete(image.id)} className="flex-1 min-h-[44px] inline-flex items-center justify-center bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors" aria-label="Confirm delete">Confirm</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] inline-flex items-center justify-center border border-gray-300 text-black rounded-md text-xs hover:bg-gray-50 transition-colors" aria-label="Cancel delete">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(image.id)} className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors" aria-label={"Delete " + image.name}><Trash2 size={14} />Delete</button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-emerald hover:text-emerald-dark text-sm font-medium transition-colors min-h-[44px]">&larr; Back to Dashboard</Link>
      </div>
    </div>
  );
}
