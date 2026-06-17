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
