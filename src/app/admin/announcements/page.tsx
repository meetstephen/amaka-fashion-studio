"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, Save, Check } from "lucide-react";
import {
  AnnouncementConfig,
  getAnnouncementConfig,
  saveAnnouncementConfig,
} from "@/components/AnnouncementBar";

export default function AdminAnnouncementsPage() {
  const [config, setConfig] = useState<AnnouncementConfig>({
    enabled: false,
    text: "",
    href: "",
    linkLabel: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage
    setConfig(getAnnouncementConfig());
  }, []);

  const handleSave = () => {
    // TODO: persist to Supabase `site_settings` table
    saveAnnouncementConfig(config);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-semibold text-black flex items-center gap-2">
          <Megaphone className="text-emerald" size={22} />
          Announcement Bar
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Manage the slim banner shown above the navigation. Visitors can
          dismiss it for the session.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-emerald/10 bg-white p-6 shadow-sm space-y-5">
          {/* Toggle */}
          <label className="flex items-center justify-between gap-3 rounded-lg border border-emerald/15 bg-emerald/5 px-4 py-3 cursor-pointer">
            <div>
              <p className="font-medium text-black text-sm">Show announcement bar</p>
              <p className="text-xs text-black/55 mt-0.5">
                Toggle off to hide the bar across the entire site.
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="h-5 w-5 accent-emerald"
              aria-label="Enable announcement bar"
            />
          </label>

          <div>
            <label
              htmlFor="ann-text"
              className="block text-[10px] uppercase tracking-[0.22em] text-black/55 font-medium mb-2"
            >
              Announcement text
            </label>
            <input
              id="ann-text"
              type="text"
              maxLength={120}
              value={config.text}
              onChange={(e) => setConfig({ ...config, text: e.target.value })}
              placeholder="e.g. Festive season fittings now booking"
              className="w-full min-h-[48px] rounded-lg border border-black/10 bg-cream px-4 py-3 text-sm text-black focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="ann-href"
                className="block text-[10px] uppercase tracking-[0.22em] text-black/55 font-medium mb-2"
              >
                Link URL (optional)
              </label>
              <input
                id="ann-href"
                type="url"
                value={config.href || ""}
                onChange={(e) => setConfig({ ...config, href: e.target.value })}
                placeholder="https://wa.me/..."
                className="w-full min-h-[48px] rounded-lg border border-black/10 bg-cream px-4 py-3 text-sm text-black focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                autoComplete="off"
                inputMode="url"
              />
            </div>
            <div>
              <label
                htmlFor="ann-label"
                className="block text-[10px] uppercase tracking-[0.22em] text-black/55 font-medium mb-2"
              >
                Link label
              </label>
              <input
                id="ann-label"
                type="text"
                maxLength={40}
                value={config.linkLabel || ""}
                onChange={(e) => setConfig({ ...config, linkLabel: e.target.value })}
                placeholder="Book now"
                className="w-full min-h-[48px] rounded-lg border border-black/10 bg-cream px-4 py-3 text-sm text-black focus:border-emerald focus:ring-1 focus:ring-emerald outline-none"
                autoComplete="off"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-lg bg-emerald px-4 text-sm font-medium uppercase tracking-[0.2em] text-cream hover:bg-emerald-dark transition-colors"
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved
              </>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
        </div>

        {/* Live preview */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-black">Live preview</h3>
          <div className="rounded-2xl overflow-hidden border border-emerald/10 shadow-sm">
            <div className="bg-emerald-dark border-b border-gold/20">
              <div className="flex items-center justify-center gap-3 px-4 py-2.5 text-center">
                <span className="hidden sm:inline-block h-px w-6 bg-gold/60" />
                <span className="text-[11px] uppercase tracking-[0.28em] text-cream">
                  {config.text || "Your announcement preview"}
                </span>
                {config.linkLabel && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-light">
                    {config.linkLabel} &rarr;
                  </span>
                )}
                <span className="hidden sm:inline-block h-px w-6 bg-gold/60" />
              </div>
            </div>
            <div className="bg-cream p-6 text-center text-xs text-black/40">
              ↑ Bar will sit above the site navigation
            </div>
          </div>
        </div>
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
