import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface PlacementRow {
  slot_key: string;
  slot_label: string;
  page_group: string;
  image_id: string | null;
  images: { url: string | null } | null;
}

/**
 * Fetch a map of slot_key -> image url for the given slot keys.
 * Slots with no image assigned yet are simply absent from the map,
 * so callers fall back to their existing placeholder for that slot.
 */
export async function getPlacementMap(
  slotKeys: string[]
): Promise<Record<string, string>> {
  if (!isSupabaseConfigured() || !supabase) return {};
  const { data, error } = await supabase
    .from("placements")
    .select("slot_key, images(url)")
    .in("slot_key", slotKeys);

  if (error || !data) return {};

  const map: Record<string, string> = {};
  for (const row of data as unknown as PlacementRow[]) {
    const url = row.images?.url;
    if (url) map[row.slot_key] = url;
  }
  return map;
}
