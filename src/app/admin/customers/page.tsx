"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Users, Plus, Trash2, Search, Send } from "lucide-react";
import {
  getCustomers,
  saveCustomers,
  type Customer,
} from "@/lib/orders-store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function dbToCustomer(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    name: (row.name as string) || "",
    phone: (row.phone as string) || "",
    email: (row.email as string) || "",
    city: (row.city as string) || "",
    notes: (row.notes as string) || "",
    measurements: (row.measurements as string) || "",
    totalOrders: (row.total_orders as number) || 0,
    createdAt: row.created_at ? new Date(row.created_at as string).getTime() : Date.now(),
  };
}

function customerToDb(c: Customer) {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    city: c.city,
    notes: c.notes,
    measurements: c.measurements,
    total_orders: c.totalOrders,
    created_at: new Date(c.createdAt).toISOString(),
  };
}

export default function AdminCustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Customer, "id" | "createdAt" | "totalOrders">>({
    name: "",
    phone: "",
    email: "",
    city: "",
    notes: "",
    measurements: "",
  });

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          setItems(data.map(dbToCustomer));
          return;
        }
      }
      setItems(getCustomers());
    }
    loadData();
  }, []);

  const update = (next: Customer[]) => {
    setItems(next);
    saveCustomers(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleAdd = async () => {
    if (!draft.name.trim()) return;
    const c: Customer = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      totalOrders: 0,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("customers")
        .insert(customerToDb(c))
        .select()
        .single();
      if (!error && data) {
        setItems((prev) => [dbToCustomer(data), ...prev]);
        setDraft({ name: "", phone: "", email: "", city: "", notes: "", measurements: "" });
        setAdding(false);
        return;
      }
    }
    update([c, ...items]);
    setDraft({ name: "", phone: "", email: "", city: "", notes: "", measurements: "" });
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (!error) {
        setItems((prev) => prev.filter((c) => c.id !== id));
        return;
      }
    }
    update(items.filter((c) => c.id !== id));
  };

  const handlePatch = async (id: string, patch: Partial<Customer>) => {
    if (isSupabaseConfigured() && supabase) {
      // Convert camelCase patch keys to snake_case for DB
      const dbPatch: Record<string, unknown> = {};
      if (patch.name !== undefined) dbPatch.name = patch.name;
      if (patch.phone !== undefined) dbPatch.phone = patch.phone;
      if (patch.email !== undefined) dbPatch.email = patch.email;
      if (patch.city !== undefined) dbPatch.city = patch.city;
      if (patch.notes !== undefined) dbPatch.notes = patch.notes;
      if (patch.measurements !== undefined) dbPatch.measurements = patch.measurements;
      if (patch.totalOrders !== undefined) dbPatch.total_orders = patch.totalOrders;

      const { error } = await supabase.from("customers").update(dbPatch).eq("id", id);
      if (!error) {
        setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
        return;
      }
    }
    update(items.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-black flex items-center gap-2">
            <Users className="text-emerald" size={22} />
            Customer accounts
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Profiles, measurements, and personal notes - the gentleman&apos;s
            file.
          </p>
        </div>
        <button
          onClick={() => setAdding((a) => !a)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px]"
        >
          <Plus size={14} />
          Add customer
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, city, phone, email"
          className="w-full min-h-[44px] rounded-full border border-black/10 bg-white pl-9 pr-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
          autoComplete="off"
          inputMode="search"
        />
      </div>

      {/* Add form */}
      {adding && (
        <div className="rounded-2xl border border-emerald/15 bg-white p-5 shadow-sm mb-6">
          <h3 className="font-heading text-lg font-semibold text-black mb-4">
            New customer
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ["name", "Full name", "name"],
              ["phone", "Phone / WhatsApp", "tel"],
              ["email", "Email", "email"],
              ["city", "City", "address-level2"],
            ] as const).map(([field, placeholder, ac]) => (
              <input
                key={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                placeholder={placeholder}
                autoComplete={ac}
                inputMode={
                  field === "phone" ? "tel" : field === "email" ? "email" : "text"
                }
                value={draft[field]}
                onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                className="min-h-[44px] rounded-lg border border-black/10 bg-cream px-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
              />
            ))}
            <textarea
              value={draft.measurements}
              onChange={(e) =>
                setDraft({ ...draft, measurements: e.target.value })
              }
              rows={2}
              placeholder='Measurements (e.g. "Chest 42, Waist 36, Sleeve 25")'
              className="sm:col-span-2 rounded-lg border border-black/10 bg-cream px-4 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
            />
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={2}
              placeholder="Notes - preferences, allergies, fabric memory"
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

      {/* List */}
      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.length === 0 && (
          <p className="text-sm text-black/55">No customers found.</p>
        )}
        {filtered.map((c) => {
          const editing = editingId === c.id;
          return (
            <div
              key={c.id}
              className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  {editing ? (
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) =>
                        handlePatch(c.id, { name: e.target.value })
                      }
                      className="font-heading text-lg font-semibold text-black bg-transparent border-b border-emerald/30 focus:border-emerald outline-none"
                    />
                  ) : (
                    <h3 className="font-heading text-lg font-semibold text-black">
                      {c.name}
                    </h3>
                  )}
                  <p className="text-[10px] uppercase tracking-[0.22em] text-emerald mt-1">
                    {c.totalOrders} orders · since{" "}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {c.phone && (
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${c.name}`}
                      className="grid h-10 w-10 place-items-center rounded-full text-emerald hover:bg-emerald/10"
                    >
                      <Send size={16} />
                    </a>
                  )}
                  <button
                    onClick={() =>
                      setEditingId(editing ? null : c.id)
                    }
                    className="rounded-full border border-emerald/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-emerald hover:bg-emerald/5 min-h-[36px]"
                  >
                    {editing ? "Done" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    aria-label={`Delete ${c.name}`}
                    className="grid h-10 w-10 place-items-center rounded-full text-red-600/80 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-black/45">
                    Phone
                  </dt>
                  {editing ? (
                    <input
                      type="tel"
                      value={c.phone}
                      onChange={(e) =>
                        handlePatch(c.id, { phone: e.target.value })
                      }
                      className="mt-1 w-full min-h-[40px] rounded-md border border-black/10 px-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                    />
                  ) : (
                    <dd className="mt-1 font-mono text-black/70">{c.phone || "-"}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-black/45">
                    Email
                  </dt>
                  {editing ? (
                    <input
                      type="email"
                      value={c.email}
                      onChange={(e) =>
                        handlePatch(c.id, { email: e.target.value })
                      }
                      className="mt-1 w-full min-h-[40px] rounded-md border border-black/10 px-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                    />
                  ) : (
                    <dd className="mt-1 text-black/70 truncate">{c.email || "-"}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-black/45">
                    City
                  </dt>
                  {editing ? (
                    <input
                      type="text"
                      value={c.city}
                      onChange={(e) =>
                        handlePatch(c.id, { city: e.target.value })
                      }
                      className="mt-1 w-full min-h-[40px] rounded-md border border-black/10 px-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                    />
                  ) : (
                    <dd className="mt-1 text-black/70">{c.city || "-"}</dd>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-black/45">
                    Measurements
                  </dt>
                  {editing ? (
                    <textarea
                      value={c.measurements}
                      onChange={(e) =>
                        handlePatch(c.id, { measurements: e.target.value })
                      }
                      rows={2}
                      className="mt-1 w-full rounded-md border border-black/10 px-2 py-1 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                    />
                  ) : (
                    <dd className="mt-1 font-mono text-black/70">
                      {c.measurements || "-"}
                    </dd>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-black/45">
                    Notes
                  </dt>
                  {editing ? (
                    <textarea
                      value={c.notes}
                      onChange={(e) =>
                        handlePatch(c.id, { notes: e.target.value })
                      }
                      rows={2}
                      className="mt-1 w-full rounded-md border border-black/10 px-2 py-1 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                    />
                  ) : (
                    <dd className="mt-1 text-black/70">{c.notes || "-"}</dd>
                  )}
                </div>
              </dl>
            </div>
          );
        })}
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
