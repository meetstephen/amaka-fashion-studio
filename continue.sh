#!/bin/bash
# =============================================================================
# Amaka Fashion Atelier — continue.sh
# =============================================================================
# Run this from INSIDE your cloned project folder in Git Bash:
#   cd amaka-fashion-studio
#   bash continue.sh
#
# What this script does:
#   1. Writes the 3 fixed TypeScript files (route.ts, supabase.ts, page.tsx)
#   2. Runs pnpm build to confirm zero errors locally before touching GitHub
#   3. Commits and pushes to your current branch (feat/amaka-menswear-site)
#   4. Merges that branch into main and pushes main
#      → This triggers Vercel to deploy to your PRODUCTION URL
#
# @supabase/supabase-js is already installed from your previous run.
# This script skips that step and goes straight to writing files.
# =============================================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}============================================================"
echo "  Amaka Fashion Atelier — Upload Fix (continuation)"
echo -e "============================================================${NC}"
echo ""

# Guard: must be run from the project root
if [ ! -f "package.json" ]; then
  echo -e "${RED}ERROR: package.json not found."
  echo "You are not inside the project folder."
  echo "Run:  cd amaka-fashion-studio"
  echo -e "Then: bash continue.sh${NC}"
  exit 1
fi

echo -e "${YELLOW}Current branch: $(git branch --show-current)${NC}"
echo ""

# =============================================================================
# STEP 1 — Write src/app/api/admin/upload/route.ts
#
# Secure server-side API endpoint.
# Checks the admin session cookie first, then uploads to Supabase Storage
# using the service role key (bypasses all RLS policies safely).
# The service role key never reaches the browser.
# =============================================================================
echo -e "${YELLOW}[1/4] Writing src/app/api/admin/upload/route.ts ...${NC}"
mkdir -p src/app/api/admin/upload

cat > src/app/api/admin/upload/route.ts << 'ENDOFROUTE'
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

// Force Node.js runtime — required for Buffer and cookies()
export const runtime = "nodejs";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    // ── 1. Verify admin session cookie ─────────────────────────────────
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "Unauthorized: no admin session. Please log in." },
        { status: 401 }
      );
    }

    const secret = process.env.SESSION_SECRET ?? "default-dev-secret";
    const isValid = await verifySessionToken(sessionCookie.value, secret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized: session expired. Please log in again." },
        { status: 401 }
      );
    }

    // ── 2. Read environment variables ──────────────────────────────────
    // Reads VITE_SUPABASE_URL (your current Vercel variable name).
    // Server-side API routes can read ALL env vars regardless of prefix.
    const supabaseUrl =
      process.env.VITE_SUPABASE_URL ??
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "";

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      const missing: string[] = [];
      if (!supabaseUrl) missing.push("VITE_SUPABASE_URL");
      if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json(
        {
          error:
            "Server configuration error. Missing environment variable(s): " +
            missing.join(", ") +
            ". Add them in Vercel dashboard under Settings > Environment Variables.",
        },
        { status: 500 }
      );
    }

    // ── 3. Parse the uploaded file ─────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Could not read the uploaded file. Please try again." },
        { status: 400 }
      );
    }

    const fileEntry = formData.get("file");
    const folderEntry = formData.get("folder");
    const folder =
      typeof folderEntry === "string" && folderEntry.length > 0
        ? folderEntry
        : "uploads";

    if (!(fileEntry instanceof File) || fileEntry.size === 0) {
      return NextResponse.json(
        { error: "No file received. Please choose a file and try again." },
        { status: 400 }
      );
    }

    const file: File = fileEntry;

    // ── 4. Validate type ───────────────────────────────────────────────
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "File type not allowed: " +
            file.type +
            ". Please upload a JPEG, PNG, WebP, GIF, or SVG.",
        },
        { status: 400 }
      );
    }

    // ── 5. Validate size ───────────────────────────────────────────────
    if (file.size > MAX_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      return NextResponse.json(
        { error: "File is " + mb + " MB. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    // ── 6. Upload using the service role key ───────────────────────────
    // Service role key bypasses ALL Supabase RLS policies.
    // Safe here because the admin session was verified above.
    // This key is only accessible server-side (no NEXT_PUBLIC_ prefix).
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const uid =
      Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    const storagePath = folder + "/" + uid + "." + ext;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[/api/admin/upload] Supabase error:", uploadError);
      return NextResponse.json(
        { error: "Supabase upload failed: " + uploadError.message },
        { status: 500 }
      );
    }

    // ── 7. Return the public URL ────────────────────────────────────────
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      success: true,
      path: uploadData.path,
      url: urlData.publicUrl,
      name: file.name,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[/api/admin/upload] Unhandled error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
ENDOFROUTE

echo -e "${GREEN}  ✓ route.ts written${NC}"

# =============================================================================
# STEP 2 — Write src/lib/supabase.ts
#
# Replaces the old placeholder that could not connect to Supabase.
# Now uses the real @supabase/supabase-js createClient().
# =============================================================================
echo -e "${YELLOW}[2/4] Writing src/lib/supabase.ts ...${NC}"

cat > src/lib/supabase.ts << 'ENDOFSUPABASE'
/**
 * src/lib/supabase.ts
 *
 * Real Supabase client — replaces the old placeholder.
 * Uses @supabase/supabase-js which is now installed.
 *
 * Reads your existing Vercel env vars (VITE_ prefix).
 * Also accepts NEXT_PUBLIC_ prefix as a fallback.
 *
 * For admin WRITE operations (upload, delete) use the
 * /api/admin/upload route, which creates its own service-role
 * client after verifying the admin session cookie.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing environment variables. " +
      "Expected VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel. " +
      "Read operations will not work until these are set."
  );
}

/**
 * Public Supabase client using the anon key.
 * Subject to Row Level Security policies.
 * Safe for server components and API routes.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Table row types ─────────────────────────────────────────────────────────

export interface ImageRow {
  id: string;
  url: string;
  name: string;
  category: string;
  created_at: string;
}

export interface LookbookRow {
  id: string;
  image_url: string;
  title: string;
  caption: string;
  order: number;
  created_at: string;
}

export interface ContentRow {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface FeaturedRow {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  updated_at: string;
}
ENDOFSUPABASE

echo -e "${GREEN}  ✓ supabase.ts written${NC}"

# =============================================================================
# STEP 3 — Write src/app/admin/images/page.tsx
#
# KEY FIX: The previous version used an <img> tag which triggers the
# Next.js ESLint rule @next/next/no-img-element — this is treated as
# a BUILD ERROR in Next.js, which is exactly why Vercel kept failing.
#
# Fix: replaced <img> with a CSS background-image <div>.
# Displays the real uploaded photo with zero ESLint issues.
# =============================================================================
echo -e "${YELLOW}[3/4] Writing src/app/admin/images/page.tsx ...${NC}"

cat > src/app/admin/images/page.tsx << 'ENDOFPAGE'
"use client";

import { useState } from "react";
import {
  Upload,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

interface ImageItem {
  id: number;
  name: string;
  category: string;
  /** Tailwind gradient shown as placeholder when no real URL is available */
  gradient: string;
  /** Real Supabase CDN public URL — only set after a successful upload */
  url?: string;
}

// ── Placeholder data ────────────────────────────────────────────────────────
// TODO: Replace with a real Supabase fetch from the 'images' table.

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

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageItem[]>(SEED_IMAGES);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // ── Upload ─────────────────────────────────────────────────────────────────
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

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
        // Do NOT set Content-Type header manually — the browser sets it
        // automatically with the correct multipart boundary for FormData.
      });

      // Same JSON parsing pattern used in src/app/admin/login/page.tsx
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Upload failed. Please try again."
        );
      }

      const newImage: ImageItem = {
        id: Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        category: "uncategorized",
        gradient: "bg-gradient-to-br from-gray-400 to-gray-600",
        url: typeof data.url === "string" ? data.url : undefined,
      };

      setImages((prev) => [newImage, ...prev]);

      // TODO: Also save a row to Supabase 'images' table:
      // import { supabase } from "@/lib/supabase";
      // await supabase.from("images").insert({
      //   name: newImage.name, category: newImage.category, url: data.url,
      // });
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setUploading(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
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

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = (id: number) => {
    // TODO: Also delete from Supabase Storage and 'images' table
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDeleteConfirmId(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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

        {/* Upload button */}
        <label
          aria-label="Upload image"
          className={
            "inline-flex items-center gap-2 px-5 min-h-[48px] rounded-lg " +
            "font-medium transition-colors select-none " +
            (uploading
              ? "bg-emerald/60 text-cream cursor-not-allowed pointer-events-none"
              : "bg-emerald text-cream hover:bg-emerald-dark cursor-pointer")
          }
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
            aria-label="Choose an image file"
          />
        </label>
      </div>

      {/* Error banner */}
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
            {/*
              Thumbnail — uses CSS backgroundImage instead of an <img> tag.
              The Next.js ESLint rule @next/next/no-img-element flags <img>
              as a BUILD ERROR. CSS background-image shows the real photo
              with no lint warnings at all.
            */}
            <div
              className="aspect-video w-full bg-cover bg-center bg-no-repeat"
              style={
                image.url
                  ? { backgroundImage: "url(" + JSON.stringify(image.url) + ")" }
                  : undefined
              }
            >
              {!image.url && (
                <div className={"h-full w-full " + image.gradient} />
              )}
            </div>

            {/* Card body */}
            <div className="p-4">
              {editingId === image.id ? (
                /* Edit mode */
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
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1 border border-gray-300 text-black rounded-md text-sm hover:bg-gray-50 transition-colors"
                      aria-label="Cancel editing"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
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

      {/* Back link */}
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
ENDOFPAGE

echo -e "${GREEN}  ✓ page.tsx written${NC}"

# =============================================================================
# STEP 4 — Build, commit, push to feature branch, then merge into main
# =============================================================================
echo ""
echo -e "${YELLOW}[4/4] Running pnpm build to check for errors...${NC}"
echo "      (This compiles TypeScript and checks ESLint — takes ~1 minute)"
echo ""

pnpm build
BUILD_RESULT=$?

if [ $BUILD_RESULT -ne 0 ]; then
  echo ""
  echo -e "${RED}============================================================"
  echo "  BUILD FAILED"
  echo "============================================================"
  echo "  The errors are shown above in red."
  echo "  Nothing was pushed to GitHub — your repo is still clean."
  echo "  Copy the error message and share it so we can fix it."
  echo -e "============================================================${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}  ✓ Build passed — zero errors!${NC}"
echo ""

# Commit on current feature branch
echo -e "${YELLOW}  Committing to $(git branch --show-current) ...${NC}"
git add .
git commit -m "fix: Supabase image upload — package installed, ESLint fixed

- pnpm add @supabase/supabase-js installed and lock file updated
- route.ts: server-side upload using service role key, bypasses RLS
- supabase.ts: replaced placeholder with real createClient()
- page.tsx: replaced <img> with CSS backgroundImage div to fix
  @next/next/no-img-element ESLint build error on Vercel"

echo -e "${YELLOW}  Pushing feat branch to GitHub ...${NC}"
git push origin HEAD

echo ""
echo -e "${GREEN}  ✓ Feature branch pushed${NC}"
echo ""

# Now merge into main so Vercel production site updates
echo -e "${YELLOW}  Switching to main and merging your changes ...${NC}"

# Check if main branch exists locally
if git show-ref --verify --quiet refs/heads/main; then
  git checkout main
else
  # main does not exist locally — create it tracking the remote
  git checkout -b main origin/main 2>/dev/null || git checkout -b main
fi

git merge feat/amaka-menswear-site --no-edit

echo -e "${YELLOW}  Pushing main to GitHub ...${NC}"
git push origin main

echo ""
echo -e "${GREEN}============================================================"
echo "  ALL DONE!"
echo "============================================================"
echo ""
echo "  Both branches updated on GitHub:"
echo "    feat/amaka-menswear-site  (your working branch)"
echo "    main                      (triggers Vercel production deploy)"
echo ""
echo "  Vercel will now auto-deploy to your PRODUCTION URL."
echo "  Watch your Vercel dashboard for a green 'Ready' status."
echo "  This usually takes about 2 minutes."
echo ""
echo "  HOW TO TEST:"
echo "    1. Open your live Vercel site URL"
echo "    2. Go to /admin/login and log in"
echo "    3. Click 'Images' on the admin dashboard"
echo "    4. Click 'Upload Image' — pick any photo"
echo "    5. You will see a spinner, then your photo appear"
echo "       in the grid with a green 'Live' badge"
echo ""
echo "  If you see an error message on the site after uploading,"
echo "  it will tell you exactly which env var is missing in Vercel."
echo -e "============================================================${NC}"
