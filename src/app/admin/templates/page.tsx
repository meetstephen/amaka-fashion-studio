"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquareText, Plus, Trash2, Copy, Check, Send } from "lucide-react";

interface Template {
  id: string;
  name: string;
  body: string;
}

const STORAGE_KEY = "amaka-whatsapp-templates";

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "welcome",
    name: "Welcome",
    body:
      "Hello! Welcome to Amaka Fashion Atelier. I'm thrilled to assist with your bespoke piece. May I begin by asking the occasion you're dressing for?",
  },
  {
    id: "booking-confirm",
    name: "Booking confirmation",
    body:
      "Your fitting is confirmed for {{date}} at {{time}}. Please bring two reference outfits if possible. We're at our atelier in Abakaliki - directions to follow.",
  },
  {
    id: "fabric-arrived",
    name: "Fabric arrived",
    body:
      "Your selected fabric has arrived at the atelier. Beautiful drape - I think you'll be very pleased. We'll begin cutting on {{date}}; first fitting in approximately {{days}} days.",
  },
  {
    id: "wedding-followup",
    name: "Wedding follow-up",
    body:
      "Congratulations on the upcoming wedding. I'd love to put together a quote for the groom and groomsmen. Could you share the date and number of attendants?",
  },
  {
    id: "ready-pickup",
    name: "Ready for pickup",
    body:
      "Your piece is finished and pressed. It's ready for collection at the atelier any time during business hours, or we can deliver - just let us know.",
  },
];

function read(): Template[] {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TEMPLATES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_TEMPLATES;
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

function write(items: Template[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function AdminTemplatesPage() {
  const [items, setItems] = useState<Template[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage
    setItems(read());
  }, []);

  const update = (next: Template[]) => {
    setItems(next);
    write(next);
  };

  const handleAdd = () => {
    const t: Template = {
      id: crypto.randomUUID(),
      name: "Untitled template",
      body: "",
    };
    update([t, ...items]);
  };

  const handleDelete = (id: string) => {
    update(items.filter((t) => t.id !== id));
  };

  const handleEdit = (id: string, patch: Partial<Template>) => {
    update(items.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const handleCopy = async (t: Template) => {
    try {
      await navigator.clipboard.writeText(t.body);
      setCopiedId(t.id);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      // ignore
    }
  };

  const sendOnWhatsApp = (body: string) => {
    window.open(
      `https://wa.me/2349131272407?text=${encodeURIComponent(body)}`,
      "_blank"
    );
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-black flex items-center gap-2">
            <MessageSquareText className="text-emerald" size={22} />
            WhatsApp templates
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Reusable messages for client communication. Tap copy or send to use.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors min-h-[44px]"
        >
          <Plus size={14} />
          New template
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-sm flex flex-col gap-3"
          >
            <input
              type="text"
              value={t.name}
              onChange={(e) => handleEdit(t.id, { name: e.target.value })}
              className="font-heading text-lg font-semibold text-black bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald rounded-md px-2 py-1 -mx-2 -my-1"
              autoComplete="off"
            />
            <textarea
              value={t.body}
              onChange={(e) => handleEdit(t.id, { body: e.target.value })}
              rows={4}
              className="rounded-lg border border-black/10 bg-cream px-3 py-2 text-sm focus:border-emerald focus:ring-1 focus:ring-emerald outline-none resize-y"
              placeholder="Message body. Use {{date}}, {{time}}, etc. as placeholders."
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy(t)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald/30 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-emerald hover:bg-emerald/5 transition-colors min-h-[40px]"
              >
                {copiedId === t.id ? (
                  <>
                    <Check size={12} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy
                  </>
                )}
              </button>
              <button
                onClick={() => sendOnWhatsApp(t.body)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors min-h-[40px]"
              >
                <Send size={12} /> Open in WhatsApp
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="ml-auto grid h-9 w-9 place-items-center rounded-full text-red-600/80 hover:bg-red-50"
                aria-label={`Delete ${t.name}`}
              >
                <Trash2 size={16} />
              </button>
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
