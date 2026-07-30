"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ImageOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface HeroSlideRow {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_href: string;
  secondary_label: string;
  secondary_href: string;
  fabric_name: string;
  fabric_origin: string;
  sort_order: number;
  image_id: string | null;
  images: { url: string | null } | null;
}

interface CardRow {
  id: string;
  name: string;
  tagline: string;
  sort_order: number;
  image_id: string | null;
  images: { url: string | null } | null;
}

interface ImageOption {
  id: string;
  name: string;
  url: string | null;
}

type Tab = "hero" | "cards";
type PhotoTarget = { type: Tab; id: string } | null;

const emptyHeroForm = {
  eyebrow: "",
  title: "",
  subtitle: "",
  cta_label: "Explore Collections",
  cta_href: "/collections",
  secondary_label: "",
  secondary_href: "",
  fabric_name: "",
  fabric_origin: "",
};

const emptyCardForm = { name: "", tagline: "" };

export default function AdminHomepageSectionsPage() {
  const [tab, setTab] = useState<Tab>("hero");
  const [heroSlides, setHeroSlides] = useState<HeroSlideRow[]>([]);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [images, setImages] = useState<ImageOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [heroForm, setHeroForm] = useState(emptyHeroForm);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState(emptyCardForm);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [photoTarget, setPhotoTarget] = useState<PhotoTarget>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  };

  const loadAll = useCallback(async () => {
    setLoadError(null);
    if (!isSupabaseConfigured() || !supabase) {
      setLoadError("Supabase is not configured.");
      return;
    }
    const [heroRes, cardsRes, imagesRes] = await Promise.all([
      supabase
        .from("hero_slides")
        .select(
          "id, eyebrow, title, subtitle, cta_label, cta_href, secondary_label, secondary_href, fabric_name, fabric_origin, sort_order, image_id, images(url)"
        )
        .order("sort_order"),
      supabase
        .from("collection_cards")
        .select("id, name, tagline, sort_order, image_id, images(url)")
        .order("sort_order"),
      supabase.from("images").select("id, name, url").order("created_at", { ascending: false }),
    ]);
    if (heroRes.error) return setLoadError(heroRes.error.message);
    if (cardsRes.error) return setLoadError(cardsRes.error.message);
    if (imagesRes.error) return setLoadError(imagesRes.error.message);
    setHeroSlides(heroRes.data as unknown as HeroSlideRow[]);
    setCards(cardsRes.data as unknown as CardRow[]);
    setImages((imagesRes.data ?? []) as ImageOption[]);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ---- Reordering ----
  const moveHero = async (id: string, dir: -1 | 1) => {
    if (!supabase) return;
    const idx = heroSlides.findIndex((s) => s.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= heroSlides.length) return;
    const a = heroSlides[idx];
    const b = heroSlides[swapIdx];
    await supabase.from("hero_slides").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("hero_slides").update({ sort_order: a.sort_order }).eq("id", b.id);
    await loadAll();
  };

  const moveCard = async (id: string, dir: -1 | 1) => {
    if (!supabase) return;
    const idx = cards.findIndex((c) => c.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= cards.length) return;
    const a = cards[idx];
    const b = cards[swapIdx];
    await supabase.from("collection_cards").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("collection_cards").update({ sort_order: a.sort_order }).eq("id", b.id);
    await loadAll();
  };

  // ---- Edit hero ----
  const startEditHero = (row: HeroSlideRow) => {
    setEditingHeroId(row.id);
    setHeroForm({
      eyebrow: row.eyebrow,
      title: row.title,
      subtitle: row.subtitle,
      cta_label: row.cta_label,
      cta_href: row.cta_href,
      secondary_label: row.secondary_label,
      secondary_href: row.secondary_href,
      fabric_name: row.fabric_name,
      fabric_origin: row.fabric_origin,
    });
  };

  const saveHero = async () => {
    if (!supabase || !editingHeroId) return;
    const { error } = await supabase
      .from("hero_slides")
      .update(heroForm)
      .eq("id", editingHeroId);
    if (error) return setLoadError(error.message);
    setEditingHeroId(null);
    await loadAll();
    showToast("Slide updated.");
  };

  const addHero = async () => {
    if (!supabase) return;
    const maxOrder = heroSlides.reduce((m, s) => Math.max(m, s.sort_order), 0);
    const { data, error } = await supabase
      .from("hero_slides")
      .insert({ ...emptyHeroForm, title: "New Slide", sort_order: maxOrder + 1 })
      .select()
      .single();
    if (error || !data) return setLoadError(error?.message ?? "Could not add slide.");
    await loadAll();
    startEditHero(data as HeroSlideRow);
  };

  const deleteHero = async (id: string) => {
    if (!supabase) return;
    await supabase.from("hero_slides").delete().eq("id", id);
    setDeleteConfirmId(null);
    await loadAll();
  };

  // ---- Edit card ----
  const startEditCard = (row: CardRow) => {
    setEditingCardId(row.id);
    setCardForm({ name: row.name, tagline: row.tagline });
  };

  const saveCard = async () => {
    if (!supabase || !editingCardId) return;
    const { error } = await supabase
      .from("collection_cards")
      .update(cardForm)
      .eq("id", editingCardId);
    if (error) return setLoadError(error.message);
    setEditingCardId(null);
    await loadAll();
    showToast("Card updated.");
  };

  const addCard = async () => {
    if (!supabase) return;
    const maxOrder = cards.reduce((m, c) => Math.max(m, c.sort_order), 0);
    const { data, error } = await supabase
      .from("collection_cards")
      .insert({ name: "New Collection", tagline: "", sort_order: maxOrder + 1 })
      .select()
      .single();
    if (error || !data) return setLoadError(error?.message ?? "Could not add card.");
    await loadAll();
    startEditCard(data as CardRow);
  };

  const deleteCard = async (id: string) => {
    if (!supabase) return;
    await supabase.from("collection_cards").delete().eq("id", id);
    setDeleteConfirmId(null);
    await loadAll();
  };

  // ---- Photo assignment ----
  const assignPhoto = async (target: PhotoTarget, imageId: string | null) => {
    if (!supabase || !target) return;
    const table = target.type === "hero" ? "hero_slides" : "collection_cards";
    const { error } = await supabase.from(table).update({ image_id: imageId }).eq("id", target.id);
    if (error) return setLoadError(error.message);
    await loadAll();
    setPhotoTarget(null);
    showToast("Photo updated.");
  };

  const uploadAndAssignPhoto = useCallback(
    async (file: File, target: PhotoTarget) => {
      if (!supabase || !target) return;
      setUploading(true);
      setUploadError(null);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", "collections");
        const response = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(typeof data.error === "string" ? data.error : "Upload failed.");
        }
        const { data: newRow, error: insertError } = await supabase
          .from("images")
          .insert({ name: file.name.replace(/\.[^/.]+$/, ""), category: "uncategorized", url: data.url })
          .select()
          .single();
        if (insertError || !newRow) {
          throw new Error("Photo saved, but could not create its record.");
        }
        await assignPhoto(target, newRow.id);
      } catch (err: unknown) {
        setUploadError(err instanceof Error ? err.message : "An unexpected error occurred.");
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
    const handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      const ptarget = photoTarget;
      if (!files || files.length === 0 || !ptarget) return;
      const selectedFile = files[0];
      target.value = "";
      void uploadAndAssignPhoto(selectedFile, ptarget);
    };
    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, [photoTarget, uploadAndAssignPhoto]);

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        aria-label="Choose a new photo"
      />

      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-black">Homepage Sections</h2>
        <p className="text-black/60 text-sm mt-1">
          Add, remove, and reorder the hero slides and collection cards on
          your homepage.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab("hero")}
          className={`min-h-[44px] px-4 rounded-lg text-sm font-medium transition-colors ${
            tab === "hero" ? "bg-emerald text-cream" : "bg-white border border-black/10 text-black/70"
          }`}
        >
          Hero Slides ({heroSlides.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("cards")}
          className={`min-h-[44px] px-4 rounded-lg text-sm font-medium transition-colors ${
            tab === "cards" ? "bg-emerald text-cream" : "bg-white border border-black/10 text-black/70"
          }`}
        >
          Collection Cards ({cards.length})
        </button>
      </div>

      {loadError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
          <ImageOff size={18} className="mt-0.5 shrink-0 text-red-500" />
          <p>{loadError}</p>
        </div>
      )}

      {tab === "hero" && (
        <div className="space-y-4">
          {heroSlides.map((s, idx) => (
            <div key={s.id} className="bg-white rounded-xl border border-emerald/10 shadow-sm overflow-hidden">
              <div className="flex items-stretch gap-3 p-3">
                <button
                  type="button"
                  onClick={() => setPhotoTarget({ type: "hero", id: s.id })}
                  className="shrink-0 w-24 h-24 rounded-lg bg-gray-100 bg-cover bg-center relative overflow-hidden"
                  style={s.images?.url ? { backgroundImage: "url(" + JSON.stringify(s.images.url) + ")" } : undefined}
                  aria-label="Change photo"
                >
                  {!s.images?.url && (
                    <span className="absolute inset-0 flex items-center justify-center text-black/30">
                      <Upload size={18} />
                    </span>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wide text-emerald/70">{s.eyebrow}</p>
                  <p className="font-medium text-black truncate">{s.title}</p>
                  <p className="text-xs text-black/50 line-clamp-2 mt-1">{s.subtitle}</p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button type="button" onClick={() => moveHero(s.id, -1)} disabled={idx === 0} className="h-8 w-8 grid place-items-center rounded-md border border-black/10 disabled:opacity-30">
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" onClick={() => moveHero(s.id, 1)} disabled={idx === heroSlides.length - 1} className="h-8 w-8 grid place-items-center rounded-md border border-black/10 disabled:opacity-30">
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 px-3 pb-3">
                <button
                  type="button"
                  onClick={() => (editingHeroId === s.id ? setEditingHeroId(null) : startEditHero(s))}
                  className="flex-1 min-h-[40px] inline-flex items-center justify-center gap-1 rounded-md border border-emerald/30 text-emerald text-xs font-medium"
                >
                  <Pencil size={13} /> {editingHeroId === s.id ? "Close" : "Edit Text"}
                </button>
                {deleteConfirmId === s.id ? (
                  <>
                    <button type="button" onClick={() => deleteHero(s.id)} className="flex-1 min-h-[40px] rounded-md bg-red-600 text-white text-xs font-medium">
                      Confirm Delete
                    </button>
                    <button type="button" onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[40px] rounded-md border border-black/10 text-xs font-medium">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setDeleteConfirmId(s.id)} className="flex-1 min-h-[40px] inline-flex items-center justify-center gap-1 rounded-md border border-red-200 text-red-600 text-xs font-medium">
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>

              {editingHeroId === s.id && (
                <div className="border-t border-black/5 p-3 space-y-2 bg-black/[0.02]">
                  <input value={heroForm.eyebrow} onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })} placeholder="Eyebrow (small label above title)" className="w-full min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                  <input value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} placeholder="Title" className="w-full min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                  <textarea value={heroForm.subtitle} onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })} placeholder="Subtitle" rows={2} className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={heroForm.cta_label} onChange={(e) => setHeroForm({ ...heroForm, cta_label: e.target.value })} placeholder="Button text" className="min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                    <input value={heroForm.cta_href} onChange={(e) => setHeroForm({ ...heroForm, cta_href: e.target.value })} placeholder="Button link" className="min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={heroForm.secondary_label} onChange={(e) => setHeroForm({ ...heroForm, secondary_label: e.target.value })} placeholder="2nd button text (optional)" className="min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                    <input value={heroForm.secondary_href} onChange={(e) => setHeroForm({ ...heroForm, secondary_href: e.target.value })} placeholder="2nd button link" className="min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={heroForm.fabric_name} onChange={(e) => setHeroForm({ ...heroForm, fabric_name: e.target.value })} placeholder="Fabric name (optional)" className="min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                    <input value={heroForm.fabric_origin} onChange={(e) => setHeroForm({ ...heroForm, fabric_origin: e.target.value })} placeholder="Fabric origin (optional)" className="min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                  </div>
                  <button type="button" onClick={saveHero} className="w-full min-h-[44px] rounded-md bg-emerald text-cream text-sm font-medium">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addHero} className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald/30 text-emerald text-sm font-medium hover:bg-emerald/5">
            <Plus size={18} /> Add New Slide
          </button>
        </div>
      )}

      {tab === "cards" && (
        <div className="space-y-4">
          {cards.map((c, idx) => (
            <div key={c.id} className="bg-white rounded-xl border border-emerald/10 shadow-sm overflow-hidden">
              <div className="flex items-stretch gap-3 p-3">
                <button
                  type="button"
                  onClick={() => setPhotoTarget({ type: "cards", id: c.id })}
                  className="shrink-0 w-24 h-24 rounded-lg bg-gray-100 bg-cover bg-center relative overflow-hidden"
                  style={c.images?.url ? { backgroundImage: "url(" + JSON.stringify(c.images.url) + ")" } : undefined}
                  aria-label="Change photo"
                >
                  {!c.images?.url && (
                    <span className="absolute inset-0 flex items-center justify-center text-black/30">
                      <Upload size={18} />
                    </span>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black truncate">{c.name}</p>
                  <p className="text-xs text-black/50 line-clamp-2 mt-1">{c.tagline}</p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button type="button" onClick={() => moveCard(c.id, -1)} disabled={idx === 0} className="h-8 w-8 grid place-items-center rounded-md border border-black/10 disabled:opacity-30">
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" onClick={() => moveCard(c.id, 1)} disabled={idx === cards.length - 1} className="h-8 w-8 grid place-items-center rounded-md border border-black/10 disabled:opacity-30">
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 px-3 pb-3">
                <button
                  type="button"
                  onClick={() => (editingCardId === c.id ? setEditingCardId(null) : startEditCard(c))}
                  className="flex-1 min-h-[40px] inline-flex items-center justify-center gap-1 rounded-md border border-emerald/30 text-emerald text-xs font-medium"
                >
                  <Pencil size={13} /> {editingCardId === c.id ? "Close" : "Edit Text"}
                </button>
                {deleteConfirmId === c.id ? (
                  <>
                    <button type="button" onClick={() => deleteCard(c.id)} className="flex-1 min-h-[40px] rounded-md bg-red-600 text-white text-xs font-medium">
                      Confirm Delete
                    </button>
                    <button type="button" onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[40px] rounded-md border border-black/10 text-xs font-medium">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setDeleteConfirmId(c.id)} className="flex-1 min-h-[40px] inline-flex items-center justify-center gap-1 rounded-md border border-red-200 text-red-600 text-xs font-medium">
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>

              {editingCardId === c.id && (
                <div className="border-t border-black/5 p-3 space-y-2 bg-black/[0.02]">
                  <input value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} placeholder="Name" className="w-full min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                  <input value={cardForm.tagline} onChange={(e) => setCardForm({ ...cardForm, tagline: e.target.value })} placeholder="Tagline" className="w-full min-h-[40px] px-3 rounded-md border border-gray-300 text-sm" />
                  <button type="button" onClick={saveCard} className="w-full min-h-[44px] rounded-md bg-emerald text-cream text-sm font-medium">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addCard} className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald/30 text-emerald text-sm font-medium hover:bg-emerald/5">
            <Plus size={18} /> Add New Card
          </button>
        </div>
      )}

      {photoTarget && (
        <div className="fixed inset-0 z-[80] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => !uploading && setPhotoTarget(null)}>
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-black/5">
              <p className="font-medium text-black">Choose a photo</p>
              <button type="button" onClick={() => setPhotoTarget(null)} disabled={uploading} aria-label="Close" className="h-9 w-9 grid place-items-center rounded-full hover:bg-black/5 disabled:opacity-40">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 border-b border-black/5">
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-lg bg-emerald text-cream text-sm font-medium disabled:opacity-70">
                {uploading ? (<><Loader2 size={18} className="animate-spin" />Uploading...</>) : (<><Upload size={18} />Take Photo or Choose from Gallery</>)}
              </button>
              {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
            </div>
            <div className="overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button type="button" onClick={() => assignPhoto(photoTarget, null)} disabled={uploading} className="aspect-square rounded-lg border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-1 text-black/50 text-xs">
                <ImageOff size={20} /> No Photo
              </button>
              {images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => assignPhoto(photoTarget, img.id)}
                  disabled={uploading || !img.url}
                  className="relative aspect-square rounded-lg overflow-hidden border border-black/10 bg-gray-100 bg-cover bg-center disabled:opacity-40"
                  style={img.url ? { backgroundImage: "url(" + JSON.stringify(img.url) + ")" } : undefined}
                >
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-cream text-[10px] px-1.5 py-1 truncate">{img.name}</span>
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
        <Link href="/admin" className="inline-flex items-center gap-2 text-emerald hover:text-emerald-dark text-sm font-medium min-h-[44px]">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}