/**
 * src/lib/supabase.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Exports a configured Supabase client using the public anon key.
 *
 * Use this for READ operations (fetching images, lookbook items, etc.)
 * in server components and API routes.
 *
 * For admin WRITE operations (upload, delete, insert), the
 * /api/admin/upload route creates its own client with the service role key
 * after verifying the admin session — the service role key is never exposed
 * to the browser.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *   VITE_SUPABASE_URL          — your project URL (already set)
 *   VITE_SUPABASE_ANON_KEY     — your public anon key (already set)
 *   SUPABASE_SERVICE_ROLE_KEY  — secret key used server-side only (add this)
 */

import { createClient } from "@supabase/supabase-js";

// Read the URL — supports both VITE_ prefix (current) and NEXT_PUBLIC_ prefix (future)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  "";

// Read the anon key — supports both prefixes
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
 * Public Supabase client — uses the anon key, subject to RLS policies.
 * Safe to use in server components and API routes for reading data.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── TypeScript interfaces matching your Supabase table schema ────────────

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
