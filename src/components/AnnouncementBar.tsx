"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

/**
 * Top announcement bar.
 * Reads configuration from localStorage (`amaka-announcement`) which is
 * managed by /admin/announcements. Falls back to a default if absent.
 *
 * TODO: Swap to Supabase `announcements` table for cross-device sync.
 */
const STORAGE_KEY = "amaka-announcement";
const DISMISS_KEY = "amaka-announcement-dismissed";

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  href?: string;
  linkLabel?: string;
}

const DEFAULT_CONFIG: AnnouncementConfig = {
  enabled: true,
  text: "Festive season fittings now booking - reserve your atelier slot",
  href: "https://wa.me/2349131272407?text=Hello%20Amaka%20Fashion%20Atelier%2C%20I%27d%20like%20to%20book%20a%20festive%20fitting",
  linkLabel: "Book now",
};

export function getAnnouncementConfig(): AnnouncementConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as AnnouncementConfig;
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveAnnouncementConfig(cfg: AnnouncementConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  window.dispatchEvent(new CustomEvent("amaka-announcement-change"));
}

export default function AnnouncementBar() {
  const [config, setConfig] = useState<AnnouncementConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage
    setConfig(getAnnouncementConfig());
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    const onChange = () => setConfig(getAnnouncementConfig());
    window.addEventListener("amaka-announcement-change", onChange);
    return () => window.removeEventListener("amaka-announcement-change", onChange);
  }, []);

  if (!config || !config.enabled || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const Inner = (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.28em] text-cream">
      <span className="hidden sm:inline-block h-px w-6 bg-gold/60" />
      <span>{config.text}</span>
      {config.href && config.linkLabel && (
        <span className="font-semibold text-gold-light underline-offset-4 hover:underline">
          {config.linkLabel} &rarr;
        </span>
      )}
      <span className="hidden sm:inline-block h-px w-6 bg-gold/60" />
    </span>
  );

  return (
    <div className="relative z-[55] bg-emerald-dark border-b border-gold/20">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center">
        {config.href ? (
          <Link
            href={config.href}
            target={config.href.startsWith("http") ? "_blank" : undefined}
            rel={config.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="block w-full"
          >
            {Inner}
          </Link>
        ) : (
          Inner
        )}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="ml-2 grid h-6 w-6 place-items-center rounded-full text-cream/60 hover:text-gold transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
