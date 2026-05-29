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

// Starts empty. Real inquiries are created by the admin or captured from the
// site, then persisted to Supabase (or localStorage as a fallback).
const SAMPLE_INQUIRIES: Inquiry[] = [];

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

// Starts empty. Real bookings are scheduled by the admin.
const SAMPLE_BOOKINGS: Booking[] = [];

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

// Starts empty. Real customer profiles are created by the admin, or captured
// automatically when a visitor submits the online measurements form.
const SAMPLE_CUSTOMERS: Customer[] = [];

export function getCustomers(): Customer[] {
  // TODO: `supabase.from('customers').select(...)`
  return load<Customer>(CUSTOMER_KEY, []).length
    ? load<Customer>(CUSTOMER_KEY, [])
    : SAMPLE_CUSTOMERS;
}

export function saveCustomers(items: Customer[]): void {
  save(CUSTOMER_KEY, items);
}
