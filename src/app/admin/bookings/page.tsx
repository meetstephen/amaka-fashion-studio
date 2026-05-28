"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import {
  getBookings,
  saveBookings,
  type Booking,
  type BookingStatus,
  type BookingType,
} from "@/lib/orders-store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const TYPE_LABEL: Record<BookingType, string> = {
  consultation: "Consultation",
  first_fitting: "First fitting",
  adjustment: "Adjustment",
  final_fitting: "Final fitting",
  delivery: "Delivery",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  scheduled: "bg-gold/15 text-gold-accessible border-gold/40",
  confirmed: "bg-emerald text-cream border-emerald",
  completed: "bg-emerald/10 text-emerald border-emerald/30",
  cancelled: "bg-black/5 text-black/50 border-black/15",
};

function dbToBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    customerName: (row.customer_name as string) || "",
    customerContact: (row.customer_contact as string) || "",
    type: (row.type as BookingType) || "consultation",
    date: (row.date as string) || "",
    time: (row.time as string) || "",
    notes: (row.notes as string) || "",
    status: (row.status as BookingStatus) || "scheduled",
    createdAt: row.created_at ? new Date(row.created_at as string).getTime() : Date.now(),
  };
}

function bookingToDb(b: Booking) {
  return {
    id: b.id,
    customer_name: b.customerName,
    customer_contact: b.customerContact,
    type: b.type,
    date: b.date,
    time: b.time,
    notes: b.notes,
    status: b.status,
    created_at: new Date(b.createdAt).toISOString(),
  };
}

export default function AdminBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    customerName: "",
    customerContact: "",
    type: "consultation" as BookingType,
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
    notes: "",
  });

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          const mapped = data.map(dbToBooking);
          setItems(
            [...mapped].sort((a, b) =>
              `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
            )
          );
          return;
        }
      }
      setItems(
        [...getBookings()].sort((a, b) =>
          `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
        )
      );
    }
    loadData();
  }, []);

  const update = (next: Booking[]) => {
    const sorted = [...next].sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
    );
    setItems(sorted);
    saveBookings(sorted);
  };

  const handleAdd = async () => {
    if (!draft.customerName.trim() || !draft.date || !draft.time) return;
    const b: Booking = {
      id: crypto.randomUUID(),
      ...draft,
      status: "scheduled",
      createdAt: Date.now(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .insert(bookingToDb(b))
        .select()
        .single();
      if (!error && data) {
        const newBooking = dbToBooking(data);
        setItems((prev) =>
          [...prev, newBooking].sort((a, bb) =>
            `${a.date}T${a.time}`.localeCompare(`${bb.date}T${bb.time}`)
          )
        );
        setDraft({
          customerName: "",
          customerContact: "",
          type: "consultation",
          date: new Date().toISOString().slice(0, 10),
          time: "10:00",
          notes: "",
        });
        setAdding(false);
        return;
      }
    }
    update([b, ...items]);
    setDraft({
      customerName: "",
      customerContact: "",
      type: "consultation",
      date: new Date().toISOString().slice(0, 10),
      time: "10:00",
      notes: "",
    });
    setAdding(false);
  };

  const handleStatus = async (id: string, status: BookingStatus) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (!error) {
        setItems((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        return;
      }
    }
    update(items.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (!error) {
        setItems((prev) => prev.filter((b) => b.id !== id));
        return;
      }
    }
    update(items.filter((b) => b.id !== id));
  };

  const upcoming = items.filter(
    (b) => `${b.date}T${b.time}` >= new Date().toISOString().slice(0, 16)
  );
  const past = items.filter(
    (b) => `${b.date}T${b.time}` < new Date().toISOString().slice(0, 16)
  );

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-black flex items-center gap-2">
            <CalendarDays className="text-emerald" size={22} />
            Bookings
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Schedule fittings, consultations, and deliveries.
          </p>
        </div>
        <button
          onClick={() => setAdding((a) => !a)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px]"
        >
          <Plus size={14} />
          New booking
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl border border-emerald/15 bg-white p-5 shadow-sm mb-6">
          <h3 className="font-heading text-lg font-semibold text-black mb-4">
            New booking
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Customer name"
              value={draft.customerName}
              onChange={(e) =>
                setDraft({ ...draft, customerName: e.target.value })
              }
              className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
              autoComplete="name"
            />
            <input
              type="tel"
              placeholder="Phone / WhatsApp"
              value={draft.customerContact}
              onChange={(e) =>
                setDraft({ ...draft, customerContact: e.target.value })
              }
              className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
              autoComplete="tel"
              inputMode="tel"
            />
            <select
              value={draft.type}
              onChange={(e) =>
                setDraft({ ...draft, type: e.target.value as BookingType })
              }
              className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
              aria-label="Booking type"
            >
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={draft.date}
                onChange={(e) =>
                  setDraft({ ...draft, date: e.target.value })
                }
                className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-3 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                aria-label="Date"
              />
              <input
                type="time"
                value={draft.time}
                onChange={(e) =>
                  setDraft({ ...draft, time: e.target.value })
                }
                className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-3 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                aria-label="Time"
              />
            </div>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={3}
              placeholder="Notes"
              className="sm:col-span-2 rounded-lg border border-black/10 bg-cream px-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
            />
            <div className="sm:col-span-2 flex gap-2">
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-2 text-xs uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px]"
              >
                Save
              </button>
              <button
                onClick={() => setAdding(false)}
                className="rounded-lg border border-black/15 px-5 py-2 text-xs uppercase tracking-[0.2em] text-black/60 hover:bg-black/5 transition-colors min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming */}
      <h3 className="font-heading text-lg font-semibold text-black mb-3">
        Upcoming ({upcoming.length})
      </h3>
      <div className="space-y-3 mb-10">
        {upcoming.length === 0 && (
          <p className="text-sm text-black/55">Nothing on the calendar yet.</p>
        )}
        {upcoming.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            onStatus={handleStatus}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <>
          <h3 className="font-heading text-lg font-semibold text-black/55 mb-3">
            Past ({past.length})
          </h3>
          <div className="space-y-3">
            {past.slice(0, 10).map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onStatus={handleStatus}
                onDelete={handleDelete}
                muted
              />
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-emerald hover:text-emerald-dark text-sm font-medium transition-colors min-h-[44px]"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onStatus,
  onDelete,
  muted,
}: {
  booking: Booking;
  onStatus: (id: string, s: BookingStatus) => void;
  onDelete: (id: string) => void;
  muted?: boolean;
}) {
  const date = new Date(`${booking.date}T${booking.time}`);
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        muted ? "opacity-70 border-black/10" : "border-emerald/10"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-heading text-lg font-semibold text-black">
              {booking.customerName}
            </h4>
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-[0.22em] ${STATUS_STYLE[booking.status]}`}
            >
              {STATUS_LABEL[booking.status]}
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-emerald">
              {TYPE_LABEL[booking.type]}
            </span>
          </div>
          <p className="mt-1 text-sm text-black/70">
            {date.toLocaleDateString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            ·{" "}
            {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="mt-1 text-xs text-black/50 font-mono">
            {booking.customerContact || "No contact"}
          </p>
          {booking.notes && (
            <p className="mt-3 text-sm text-black/65">{booking.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={booking.status}
            onChange={(e) =>
              onStatus(booking.id, e.target.value as BookingStatus)
            }
            className="min-h-[40px] rounded-lg border border-emerald/30 bg-white px-3 text-xs uppercase tracking-[0.18em] text-emerald focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
            aria-label="Booking status"
          >
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button
            onClick={() => onDelete(booking.id)}
            className="grid h-10 w-10 place-items-center rounded-full text-red-600/80 hover:bg-red-50"
            aria-label={`Delete booking for ${booking.customerName}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
