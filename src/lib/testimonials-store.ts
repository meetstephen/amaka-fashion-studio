/**
 * Testimonials store - localStorage-backed for the admin to manage and
 * for the homepage Testimonials carousel to read.
 *
 * TODO: persist to Supabase `testimonials` table for cross-device.
 */

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number; // 1-5
}

const STORAGE_KEY = "amaka-testimonials";
const CHANGE_EVENT = "amaka-testimonials-change";

// Starts empty so the homepage testimonials section stays hidden until the
// owner adds real client words from the admin panel.
export const DEFAULT_TESTIMONIALS: Testimonial[] = [];

function isBrowser() {
  return typeof window !== "undefined";
}

export function getTestimonials(): Testimonial[] {
  if (!isBrowser()) return DEFAULT_TESTIMONIALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TESTIMONIALS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_TESTIMONIALS;
    return parsed.length ? parsed : DEFAULT_TESTIMONIALS;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

export function saveTestimonials(items: Testimonial[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(
    new CustomEvent<Testimonial[]>(CHANGE_EVENT, { detail: items })
  );
}

export function subscribeTestimonials(
  cb: (items: Testimonial[]) => void
): () => void {
  if (!isBrowser()) return () => {};
  const handler = (e: Event) =>
    cb((e as CustomEvent<Testimonial[]>).detail);
  window.addEventListener(CHANGE_EVENT, handler as EventListener);
  return () => window.removeEventListener(CHANGE_EVENT, handler as EventListener);
}
