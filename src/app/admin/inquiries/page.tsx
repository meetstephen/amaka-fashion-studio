"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Trash2,
  Plus,
  Send,
  Filter,
} from "lucide-react";
import {
  getInquiries,
  saveInquiries,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/orders-store";

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  in_progress: "In progress",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

const STATUS_STYLE: Record<InquiryStatus, string> = {
  new: "bg-gold/15 text-gold-accessible border-gold/40",
  in_progress: "bg-emerald/10 text-emerald border-emerald/30",
  quoted: "bg-blue-50 text-blue-700 border-blue-200",
  won: "bg-emerald text-cream border-emerald",
  lost: "bg-black/5 text-black/55 border-black/10",
};

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    customerName: "",
    customerContact: "",
    items: "",
    notes: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage
    setItems(getInquiries());
  }, []);

  const update = (next: Inquiry[]) => {
    setItems(next);
    saveInquiries(next);
  };

  const handleAdd = () => {
    if (!draft.customerName.trim()) return;
    const inquiry: Inquiry = {
      id: crypto.randomUUID(),
      customerName: draft.customerName.trim(),
      customerContact: draft.customerContact.trim(),
      itemNames: draft.items
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      notes: draft.notes.trim(),
      status: "new",
      source: "in-person",
      createdAt: Date.now(),
    };
    update([inquiry, ...items]);
    setDraft({ customerName: "", customerContact: "", items: "", notes: "" });
    setAdding(false);
  };

  const handleDelete = (id: string) => update(items.filter((i) => i.id !== id));
  const handleStatus = (id: string, status: InquiryStatus) =>
    update(items.map((i) => (i.id === id ? { ...i, status } : i)));

  const visible = filter === "all" ? items : items.filter((i) => i.status === filter);

  const sendOnWhatsApp = (i: Inquiry) => {
    const msg = `Hello ${i.customerName}! Following up on your inquiry about ${i.itemNames.join(
      ", "
    ) || "your bespoke commission"}. We're ready when you are.`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-black flex items-center gap-2">
            <ClipboardList className="text-emerald" size={22} />
            Orders / Inquiries
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Track every conversation from first hello to final delivery.
            (Sample data shown - clears on first save.)
          </p>
        </div>
        <button
          onClick={() => setAdding((a) => !a)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px]"
        >
          <Plus size={14} />
          New inquiry
        </button>
      </div>

      {/* Filter chips */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-emerald" />
        {(["all", "new", "in_progress", "quoted", "won", "lost"] as const).map(
          (k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`min-h-[36px] rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] transition-colors ${
                filter === k
                  ? "border-emerald bg-emerald text-cream"
                  : "border-black/15 text-black/60 hover:border-emerald hover:text-emerald"
              }`}
            >
              {k === "all" ? "All" : STATUS_LABEL[k]}
            </button>
          )
        )}
      </div>

      {adding && (
        <div className="rounded-2xl border border-emerald/15 bg-white p-5 shadow-sm mb-6">
          <h3 className="font-heading text-lg font-semibold text-black mb-4">
            New inquiry
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={draft.customerName}
              onChange={(e) =>
                setDraft({ ...draft, customerName: e.target.value })
              }
              placeholder="Customer name"
              className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
              autoComplete="name"
            />
            <input
              type="tel"
              value={draft.customerContact}
              onChange={(e) =>
                setDraft({ ...draft, customerContact: e.target.value })
              }
              placeholder="Phone or WhatsApp"
              className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
              autoComplete="tel"
              inputMode="tel"
            />
            <input
              type="text"
              value={draft.items}
              onChange={(e) => setDraft({ ...draft, items: e.target.value })}
              placeholder="Items (comma-separated, e.g. The Statesman, Oxford Classic)"
              className="sm:col-span-2 min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
            />
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

      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="text-sm text-black/55">No inquiries match this filter.</p>
        )}
        {visible.map((i) => (
          <div
            key={i.id}
            className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold text-black">
                    {i.customerName}
                  </h3>
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-[0.22em] ${STATUS_STYLE[i.status]}`}
                  >
                    {STATUS_LABEL[i.status]}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-black/45">
                    {i.source}
                  </span>
                </div>
                <p className="mt-1 text-xs text-black/55 font-mono">
                  {i.customerContact || "No contact"}
                </p>
                {i.itemNames.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {i.itemNames.map((n) => (
                      <li
                        key={n}
                        className="rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                )}
                {i.notes && (
                  <p className="mt-3 text-sm text-black/65 leading-relaxed">
                    {i.notes}
                  </p>
                )}
                <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-black/40">
                  {new Date(i.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={i.status}
                  onChange={(e) =>
                    handleStatus(i.id, e.target.value as InquiryStatus)
                  }
                  className="min-h-[40px] rounded-lg border border-emerald/30 bg-white px-3 text-xs uppercase tracking-[0.18em] text-emerald focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                  aria-label="Inquiry status"
                >
                  {Object.entries(STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => sendOnWhatsApp(i)}
                  aria-label={`WhatsApp ${i.customerName}`}
                  className="grid h-10 w-10 place-items-center rounded-full text-emerald hover:bg-emerald/10"
                >
                  <Send size={16} />
                </button>
                <button
                  onClick={() => handleDelete(i.id)}
                  aria-label={`Delete inquiry from ${i.customerName}`}
                  className="grid h-10 w-10 place-items-center rounded-full text-red-600/80 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
