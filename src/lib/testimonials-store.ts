/**
 * Testimonials store - backed by the Supabase `testimonials` table so
 * changes made from any device appear for every site visitor.
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number; // 1-5
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, location, quote, rating")
    .order("sort_order");
  if (error || !data) return [];
  return data as Testimonial[];
}

export async function addTestimonial(
  t: Omit<Testimonial, "id">
): Promise<Testimonial | null> {
  if (!supabase) return null;
  const { data: existing } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const maxOrder = existing && existing[0] ? existing[0].sort_order : 0;
  const { data, error } = await supabase
    .from("testimonials")
    .insert({ ...t, sort_order: maxOrder + 1 })
    .select("id, name, location, quote, rating")
    .single();
  if (error || !data) return null;
  return data as Testimonial;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Omit<Testimonial, "id">>
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("testimonials").update(patch).eq("id", id);
  return !error;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  return !error;
}
