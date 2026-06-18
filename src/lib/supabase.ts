import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[Supabase] Missing env vars. Expected VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ImageRow { id: string; url: string; name: string; category: string; created_at: string; }
export interface LookbookRow { id: string; image_url: string; title: string; caption: string; order: number; created_at: string; }
export interface ContentRow { id: string; key: string; value: string; updated_at: string; }
export interface FeaturedRow { id: string; image_url: string; title: string; subtitle: string; updated_at: string; }
