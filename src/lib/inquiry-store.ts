/**
 * Lightweight inquiry "cart" backed by localStorage.
 *
 * Visitors add pieces they're interested in to a list, then send the whole
 * inquiry to WhatsApp in one click. No checkout, no payments - this is a
 * bespoke atelier; every order goes through human conversation.
 */

export interface InquiryItem {
  id: string;       // unique id (uuid or slug)
  name: string;     // e.g. "The Statesman"
  category: string; // e.g. "Senator Wear"
  description?: string;
}

const STORAGE_KEY = "amaka-inquiry-items";
const CHANGE_EVENT = "amaka-inquiry-change";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read(): InquiryItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is InquiryItem =>
        i && typeof i.id === "string" && typeof i.name === "string"
    );
  } catch {
    return [];
  }
}

function write(items: InquiryItem[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(
    new CustomEvent<InquiryItem[]>(CHANGE_EVENT, { detail: items })
  );
}

export function getItems(): InquiryItem[] {
  return read();
}

export function addItem(item: InquiryItem): InquiryItem[] {
  const items = read();
  // Avoid duplicates by id
  if (items.some((i) => i.id === item.id)) return items;
  const next = [...items, item];
  write(next);
  return next;
}

export function removeItem(id: string): InquiryItem[] {
  const next = read().filter((i) => i.id !== id);
  write(next);
  return next;
}

export function clearAll(): InquiryItem[] {
  write([]);
  return [];
}

export function subscribe(
  cb: (items: InquiryItem[]) => void
): () => void {
  if (!isBrowser()) return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<InquiryItem[]>).detail);
  // Also reflect cross-tab changes
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb(read());
  };
  window.addEventListener(CHANGE_EVENT, handler as EventListener);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler as EventListener);
    window.removeEventListener("storage", storageHandler);
  };
}

/** Build a WhatsApp link prefilled with the inquiry contents. */
export function buildInquiryWhatsappUrl(items: InquiryItem[]): string {
  const lines = [
    "Hello Amaka Fashion Atelier!",
    "I would like to enquire about the following pieces:",
    "",
    ...items.map((it, i) => `${i + 1}. ${it.name} (${it.category})`),
    "",
    "Please advise on availability, fabric options, and a fitting appointment.",
  ];
  return `https://wa.me/2349131272407?text=${encodeURIComponent(lines.join("\n"))}`;
}
