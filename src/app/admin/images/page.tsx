"use client";

import { useState } from "react";
import { Upload, Pencil, Trash2, X, Check } from "lucide-react";
import Link from "next/link";

interface ImageItem {
  id: number;
  name: string;
  category: string;
  gradient: string;
}

// TODO: Fetch from Supabase 'images' table
const initialImages: ImageItem[] = [
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

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Upload to Supabase Storage
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImage: ImageItem = {
        id: Date.now(),
        name: files[0].name.replace(/\.[^/.]+$/, ""),
        category: "uncategorized",
        gradient: "bg-gradient-to-br from-gray-400 to-gray-600",
      };
      setImages([newImage, ...images]);
    }
    e.target.value = "";
  };

  const startEdit = (image: ImageItem) => {
    setEditingId(image.id);
    setEditName(image.name);
    setEditCategory(image.category);
  };

  const saveEdit = () => {
    // TODO: Update in Supabase 'images' table
    setImages(
      images.map((img) =>
        img.id === editingId
          ? { ...img, name: editName, category: editCategory }
          : img
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    // TODO: Delete from Supabase Storage and 'images' table
    setImages(images.filter((img) => img.id !== id));
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
            Upload and manage all site images
          </p>
        </div>

        {/* Upload button */}
        <label
          className="inline-flex items-center gap-2 px-5 min-h-[48px] bg-emerald text-cream rounded-lg hover:bg-emerald-dark transition-colors cursor-pointer font-medium"
          aria-label="Upload image"
        >
          <Upload size={18} />
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            aria-label="Choose image file"
          />
        </label>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-xl border border-emerald/10 overflow-hidden shadow-sm"
          >
            {/* Thumbnail */}
            <div className={`aspect-video ${image.gradient}`} />

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
