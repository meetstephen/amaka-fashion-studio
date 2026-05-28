/**
 * Orders / Inquiries / Bookings / Customers stores.
 *
 * All four entities are localStorage-backed for now so the admin can use
 * them without requiring a database. Each has a clear TODO marker for the
 * Supabase migration:
 *
 *   inquiries  -> supabase.from('inquiries').*
 *   bookings   -> supabase.from('bookings').*
 *   customers  -> supabase.from('customers').*
 */

// ---------- Types ----------
export type InquiryStatus = "new" | "in_progress" | "quoted" | "won" | "lost";

export interface Inquiry {
  id: string;
  customerName: string;
  customerContact: string;
  itemNames: string[];
  notes: string;
  status: InquiryStatus;
  source: "whatsapp" | "form" | "chatbot" | "in-person" | "other";
  createdAt: number;
}

export type BookingStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled";

export type BookingType =
  | "consultation"
  | "first_fitting"
  | "adjustment"
  | "final_fitting"
  | "delivery";

export interface Booking {
  id: string;
  customerName: string;
  customerContact: string;
  type: BookingType;
  date: string; // ISO date
  time: string; // HH:mm
  notes: string;
  status: BookingStatus;
  createdAt: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  notes: string;
  /** Free-text rough measurements (chest 42", sleeve 25"...) */
  measurements: string;
  totalOrders: number;
  createdAt: number;
}

// ---------- Generic local store ----------
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function load<T>(key: string, fallback: T[]): T[] {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, items: T[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(`${key}-change`, { detail: items }));
}

// ---------- Inquiries ----------
const INQUIRY_KEY = "amaka-inquiries";

const SAMPLE_INQUIRIES: Inquiry[] = [
  {
    id: "inq-001",
    customerName: "Chuka O.",
    customerContact: "+234 803 *** 4421",
    itemNames: ["The Statesman (Senator Wear)", "The Pinnacle (Suits)"],
    notes:
      "For an APC summit in October. Wants ivory senator with subtle gold; navy three-piece for the gala dinner.",
    status: "in_progress",
    source: "whatsapp",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "inq-002",
    customerName: "Emeka N.",
    customerContact: "+234 813 *** 9302",
    itemNames: ["The Chairman (Suits)", "Oxford Classic (Shirts) x3"],
    notes: "Boardroom rotation. Charcoal preferred; double-cuffs.",
    status: "quoted",
    source: "form",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "inq-003",
    customerName: "Ifeanyi A.",
    customerContact: "+234 906 *** 1147",
    itemNames: ["The Chieftain (Traditional)", "Igbo Heritage"],
    notes:
      "Wedding ceremony, December. Wants royal agbada with bullion thread; matching cap.",
    status: "new",
    source: "chatbot",
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
  },
];

export function getInquiries(): Inquiry[] {
  // TODO: replace with `supabase.from('inquiries').select(...)`
  return load<Inquiry>(INQUIRY_KEY, []).length
    ? load<Inquiry>(INQUIRY_KEY, [])
    : SAMPLE_INQUIRIES;
}

export function saveInquiries(items: Inquiry[]): void {
  save(INQUIRY_KEY, items);
}

export function addInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status"> & { status?: InquiryStatus }): Inquiry {
  const items = getInquiries();
  const inquiry: Inquiry = {
    ...input,
    status: input.status ?? "new",
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  saveInquiries([inquiry, ...items]);
  return inquiry;
}

// ---------- Bookings ----------
const BOOKING_KEY = "amaka-bookings";

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "bk-001",
    customerName: "Obinna E.",
    customerContact: "+234 803 *** 8810",
    type: "consultation",
    date: new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10),
    time: "11:00",
    notes: "First-time client. Wedding consultation.",
    status: "confirmed",
    createdAt: Date.now() - 86_400_000,
  },
  {
    id: "bk-002",
    customerName: "Tunde A.",
    customerContact: "+234 706 *** 2202",
    type: "first_fitting",
    date: new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10),
    time: "14:30",
    notes: "Charcoal Italian wool suit. Bring belt and shoes.",
    status: "scheduled",
    createdAt: Date.now() - 3 * 86_400_000,
  },
];

export function getBookings(): Booking[] {
  // TODO: `supabase.from('bookings').select(...)`
  return load<Booking>(BOOKING_KEY, []).length
    ? load<Booking>(BOOKING_KEY, [])
    : SAMPLE_BOOKINGS;
}

export function saveBookings(items: Booking[]): void {
  save(BOOKING_KEY, items);
}

// ---------- Customers ----------
const CUSTOMER_KEY = "amaka-customers";

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    name: "Chuka O.",
    phone: "+234 803 *** 4421",
    email: "chuka@example.com",
    city: "Lagos",
    notes: "Prefers ivory and navy. Allergic to pure synthetic linings.",
    measurements: "Chest 44, Waist 38, Sleeve 25.5, Inseam 31",
    totalOrders: 5,
    createdAt: Date.now() - 240 * 86_400_000,
  },
  {
    id: "cust-002",
    name: "Emeka N.",
    phone: "+234 813 *** 9302",
    email: "emeka@example.com",
    city: "Abuja",
    notes: "Senator collector. Likes peak lapels.",
    measurements: "Chest 42, Waist 36, Sleeve 25, Inseam 31",
    totalOrders: 3,
    createdAt: Date.now() - 120 * 86_400_000,
  },
  {
    id: "cust-003",
    name: "Ifeanyi A.",
    phone: "+234 906 *** 1147",
    email: "",
    city: "Enugu",
    notes: "Wedding client - traditional commission ongoing.",
    measurements: "Chest 40, Waist 34, Sleeve 24.5, Inseam 30",
    totalOrders: 1,
    createdAt: Date.now() - 30 * 86_400_000,
  },
];

export function getCustomers(): Customer[] {
  // TODO: `supabase.from('customers').select(...)`
  return load<Customer>(CUSTOMER_KEY, []).length
    ? load<Customer>(CUSTOMER_KEY, [])
    : SAMPLE_CUSTOMERS;
}

export function saveCustomers(items: Customer[]): void {
  save(CUSTOMER_KEY, items);
}
