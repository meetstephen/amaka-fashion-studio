"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Fires a lightweight POST to /api/track on mount and on every route change.
 * Server-side aggregates visits for the admin analytics dashboard.
 */
export default function VisitorTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Don't double-fire for the same path within a single navigation cycle
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    // Skip admin pages
    if (pathname.startsWith("/admin")) return;

    const referrer = typeof document !== "undefined" ? document.referrer : "";

    // Best-effort beacon - errors are silent
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname, referrer }),
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  }, [pathname]);

  return null;
}
