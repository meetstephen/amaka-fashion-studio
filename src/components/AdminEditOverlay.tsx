"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Settings, ChevronUp, ChevronDown } from "lucide-react";

const EDIT_MODE_KEY = "admin-edit-mode-active";

interface PageMapping {
  match: (path: string) => boolean;
  name: string;
  links: Array<{ label: string; href: string }>;
}

const PAGE_MAP: PageMapping[] = [
  {
    match: (p) => p === "/",
    name: "Homepage",
    links: [
      { label: "Featured image", href: "/admin/featured" },
      { label: "Hero content", href: "/admin/content" },
      { label: "Announcements", href: "/admin/announcements" },
    ],
  },
  {
    match: (p) => p.startsWith("/collections"),
    name: "Collections",
    links: [
      { label: "Edit images", href: "/admin/images" },
      { label: "Edit copy", href: "/admin/content" },
    ],
  },
  {
    match: (p) => p.startsWith("/lookbook"),
    name: "Lookbook",
    links: [{ label: "Manage gallery", href: "/admin/lookbook" }],
  },
  {
    match: (p) => p.startsWith("/about"),
    name: "About",
    links: [{ label: "Edit story", href: "/admin/content" }],
  },
  {
    match: (p) => p.startsWith("/contact"),
    name: "Contact",
    links: [{ label: "Edit contact info", href: "/admin/content" }],
  },
];

/**
 * Floating admin "edit mode" widget.
 * Renders only for authenticated admins; checks /api/admin/me on mount.
 * Toggling sets a localStorage flag that other components (EditPencil) can
 * read to render quick-edit affordances.
 */
export default function AdminEditOverlay() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Don't render the overlay on /admin pages themselves
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((d) => {
        if (!cancelled) setAuthed(Boolean(d?.authenticated));
      })
      .catch(() => {
        if (!cancelled) setAuthed(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setEditMode(localStorage.getItem(EDIT_MODE_KEY) === "1");
  }, []);

  const toggle = () => {
    const next = !editMode;
    setEditMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(EDIT_MODE_KEY, next ? "1" : "0");
      window.dispatchEvent(new CustomEvent("admin-edit-mode-change", { detail: next }));
    }
  };

  if (!authed || isAdminRoute) return null;

  const mapping = PAGE_MAP.find((m) => m.match(pathname || "/")) || {
    name: "Site",
    links: [{ label: "Open admin", href: "/admin" }],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="fixed bottom-6 left-6 z-[55] max-w-[280px]"
    >
      <div className="rounded-2xl border border-gold/40 bg-black/85 backdrop-blur-md text-cream shadow-2xl">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gold/15">
          <Settings size={14} className="text-gold" />
          <span className="text-[10px] uppercase tracking-[0.32em] text-gold/80 flex-1">
            Admin · {mapping.name}
          </span>
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand admin overlay" : "Collapse admin overlay"}
            className="grid h-6 w-6 place-items-center rounded-full text-cream/60 hover:text-gold"
          >
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-3 py-3 space-y-3">
                {/* Edit mode toggle */}
                <button
                  type="button"
                  onClick={toggle}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors ${
                    editMode
                      ? "border-gold bg-gold text-black"
                      : "border-gold/30 hover:border-gold/60"
                  }`}
                >
                  <span className="uppercase tracking-[0.2em] font-medium">Edit mode</span>
                  <span
                    className={`inline-block h-3 w-7 rounded-full relative transition-colors ${
                      editMode ? "bg-black/30" : "bg-cream/15"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-2 w-2 rounded-full bg-gold transition-all ${
                        editMode ? "left-4" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>

                {/* Quick links */}
                <div className="space-y-1">
                  {mapping.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block rounded-md px-2 py-1.5 text-[11px] text-cream/80 hover:bg-emerald/40 hover:text-gold transition-colors"
                    >
                      &rarr; {l.label}
                    </Link>
                  ))}
                  <Link
                    href="/admin"
                    className="block rounded-md px-2 py-1.5 text-[11px] text-gold/70 hover:text-gold border-t border-gold/10 mt-2 pt-2"
                  >
                    Open full admin panel
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * Subtle gold pencil that appears next to editable areas when admin
 * edit mode is active. Renders nothing when off.
 */
export function EditPencil({
  href,
  label = "Edit",
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setActive(localStorage.getItem(EDIT_MODE_KEY) === "1");
    const handler = (e: Event) =>
      setActive(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener("admin-edit-mode-change", handler as EventListener);
    return () =>
      window.removeEventListener(
        "admin-edit-mode-change",
        handler as EventListener
      );
  }, []);

  if (!active) return null;
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur hover:bg-gold hover:text-black transition-colors ${className}`}
      aria-label={label}
    >
      <Pencil size={10} />
      {label}
    </Link>
  );
}
