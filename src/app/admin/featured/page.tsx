"use client";

import { useEffect, useState } from "react";
import { Upload, Save, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { uploadImage } from "@/lib/upload";

export default function AdminFeaturedPage() {
  const [title, setTitle] = useState("The Modern Nigerian Gentleman");
  const [subtitle, setSubtitle] = useState(
    "Luxury menswear crafted with heritage and distinction"
  );
  const [saved, setSaved] = useState(false);
  const [hasImage, setHasImage] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [featuredId, setFeaturedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("featured")
          .select("*")
          .limit(1)
          .single();
        if (!error && data) {
          setTitle(data.title || "The Modern Nigerian Gentleman");
          setSubtitle(data.subtitle || "Luxury menswear crafted with heritage and distinction");
          setImageUrl(data.image_url || null);
          setHasImage(!!data.image_url);
          setFeaturedId(data.id);
          return;
        }
      }
    }
    loadData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isSupabaseConfigured() && supabase) {
      const url = await uploadImage(files[0], "featured");
      if (url) {
        setImageUrl(url);
        setHasImage(true);
        setSaved(false);
      }
    } else {
      setHasImage(true);
      setSaved(false);
    }
    e.target.value = "";
  };

  const handleSave = async () => {
    if (isSupabaseConfigured() && supabase) {
      const payload = {
        title,
        subtitle,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (featuredId) {
        const { error } = await supabase
          .from("featured")
          .update(payload)
          .eq("id", featuredId);
        if (!error) {
          setSaved(true);
          return;
        }
      } else {
        const { data, error } = await supabase
          .from("featured")
          .insert(payload)
          .select()
          .single();
        if (!error && data) {
          setFeaturedId(data.id);
          setSaved(true);
          return;
        }
      }
    }
    setSaved(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-black">
          Featured Image Manager
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Update the homepage hero featured image and overlay text
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Upload */}
          <div className="bg-white rounded-xl border border-emerald/10 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-black mb-3">
              Featured Image
            </h3>
            <label
              className="flex flex-col items-center justify-center gap-3 min-h-[120px] border-2 border-dashed border-emerald/30 rounded-lg cursor-pointer hover:border-emerald/60 hover:bg-emerald/5 transition-colors"
              aria-label="Upload featured image"
            >
              <Upload size={24} className="text-emerald/60" />
              <span className="text-sm text-black/60">
                {hasImage ? "Replace current image" : "Upload an image"}
              </span>
              <span className="text-xs text-black/40">
                Tap to use camera or choose from gallery
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                aria-label="Choose featured image file"
              />
            </label>
            {(hasImage || imageUrl) && (
              <button
                type="button"
                onClick={async () => {
                  if (isSupabaseConfigured() && supabase && featuredId) {
                    await supabase.from("featured").update({ image_url: null }).eq("id", featuredId);
                    if (imageUrl) {
                      const { deleteImage } = await import("@/lib/upload");
                      await deleteImage(imageUrl);
                    }
                  }
                  setImageUrl(null);
                  setHasImage(false);
                  setSaved(false);
                }}
                className="mt-3 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                aria-label="Remove featured image"
              >
                <Trash2 size={16} />
                Remove Current Image
              </button>
            )}
          </div>

          {/* Overlay text fields */}
          <div className="bg-white rounded-xl border border-emerald/10 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-medium text-black">Overlay Text</h3>
            <div>
              <label
                htmlFor="featured-title"
                className="block text-xs text-black/60 mb-1"
              >
                Title
              </label>
              <input
                id="featured-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaved(false);
                }}
                className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300 text-sm text-black focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none"
                aria-label="Featured image title"
              />
            </div>
            <div>
              <label
                htmlFor="featured-subtitle"
                className="block text-xs text-black/60 mb-1"
              >
                Subtitle
              </label>
              <input
                id="featured-subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  setSaved(false);
                }}
                className="w-full min-h-[48px] px-4 rounded-lg border border-gray-300 text-sm text-black focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none"
                aria-label="Featured image subtitle"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 bg-emerald text-cream rounded-lg font-medium hover:bg-emerald-dark transition-colors"
              aria-label="Save featured image settings"
            >
              {saved ? (
                <>
                  <Check size={18} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live preview */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-black">Live Preview</h3>
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            {/* Featured image or gradient placeholder */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Featured preview"
                className="aspect-[16/9] w-full object-cover"
              />
            ) : (
              <div className="aspect-[16/9] bg-gradient-to-br from-emerald via-emerald-dark to-black" />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
              <h4 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-cream mb-2">
                {title || "Title goes here"}
              </h4>
              <p className="text-sm sm:text-base text-cream/80">
                {subtitle || "Subtitle goes here"}
              </p>
            </div>
          </div>
          <p className="text-xs text-black/40 text-center">
            This is how the featured section will appear on the homepage
          </p>
        </div>
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
