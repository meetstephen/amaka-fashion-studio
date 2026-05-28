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

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Chuka O.",
    location: "Lagos",
    quote:
      "The cut on my senator was uncanny - tailored as though they had measured me twice in my dreams. Hands down the best fitting in Nigeria.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Emeka N.",
    location: "Abuja",
    quote:
      "I commissioned three suits for the campaign trail. Every event, someone asks who tailored them. Quiet authority - that's the Amaka difference.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Ifeanyi A.",
    location: "Enugu",
    quote:
      "My wedding agbada was poetry. Hand-thread gold work, balanced cut, shoulders that sit right. Worth every kobo and every fitting.",
    rating: 5,
  },
  {
    id: "t4",
    name: "Obinna E.",
    location: "Port Harcourt",
    quote:
      "From WhatsApp consultation to final delivery - the entire experience felt like it had been designed by someone who actually cares about the gentleman.",
    rating: 5,
  },
];

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
