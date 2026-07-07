"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Users, Eye, ArrowUpRight, RefreshCw } from "lucide-react";

interface AnalyticsData {
  today: number;
  week: number;
  month: number;
  total: number;
  pageviews: number;
  topPages: Array<{ page: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  recent: Array<{
    id: string;
    page: string;
    referrer: string;
    country: string;
    userAgent: string;
    timestamp: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/analytics", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`Failed: ${r.status}`);
        return r.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load + interval
    load();
    const t = window.setInterval(load, 60_000);
    return () => window.clearInterval(t);
  }, []);

  const stats = [
    {
      label: "Today",
      value: data?.today ?? 0,
      icon: Users,
      gradient: "from-emerald to-emerald-dark",
    },
    {
      label: "This week",
      value: data?.week ?? 0,
      icon: Users,
      gradient: "from-emerald-dark to-black",
    },
    {
      label: "This month",
      value: data?.month ?? 0,
      icon: Users,
      gradient: "from-black to-emerald-dark",
    },
    {
      label: "Total",
      value: data?.total ?? 0,
      icon: Users,
      gradient: "from-emerald to-black",
    },
  ];

  const maxPageCount = Math.max(1, ...(data?.topPages.map((p) => p.count) || [1]));

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-black flex items-center gap-2">
            <BarChart3 className="text-emerald" size={24} />
            Analytics
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Live, in-process visitor pulse. Resets on deploy. Vercel Analytics
            is also collecting the durable copy.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald hover:bg-emerald/5 transition-colors min-h-[44px]"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-emerald/10 bg-white p-5 shadow-sm"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.gradient}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-black/55">
                    {s.label}
                  </p>
                  <p className="mt-2 font-heading text-3xl md:text-4xl font-semibold text-black">
                    {s.value}
                  </p>
                </div>
                <Icon size={20} className="text-emerald/50" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pageviews badge */}
      {data && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald/5 px-4 py-2 text-xs text-emerald">
          <Eye size={14} />
          {data.pageviews} total pageviews recorded in memory
        </div>
      )}

      {/* Top pages */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald/10 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-lg font-semibold text-black">Top pages</h3>
          {!data || data.topPages.length === 0 ? (
            <p className="mt-4 text-sm text-black/55">No data yet.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {data.topPages.map((p) => (
                <li key={p.page}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-mono text-xs text-black/70 truncate">
                      {p.page}
                    </span>
                    <span className="text-emerald font-medium">{p.count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-emerald/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald to-gold"
                      style={{ width: `${(p.count / maxPageCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top referrers */}
        <div className="rounded-2xl border border-emerald/10 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-lg font-semibold text-black">Top referrers</h3>
          {!data || data.topReferrers.length === 0 ? (
            <p className="mt-4 text-sm text-black/55">No data yet.</p>
          ) : (
            <ul className="mt-5 space-y-2.5">
              {data.topReferrers.map((r) => (
                <li
                  key={r.referrer}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm hover:bg-emerald/5"
                >
                  <span className="text-black/70 truncate flex items-center gap-1.5">
                    <ArrowUpRight size={12} className="text-emerald" />
                    {r.referrer || "(direct)"}
                  </span>
                  <span className="text-emerald font-medium">{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent visitors */}
      <div className="mt-6 rounded-2xl border border-emerald/10 bg-white p-6 shadow-sm">
        <h3 className="font-heading text-lg font-semibold text-black">Recent visitors</h3>
        {!data || data.recent.length === 0 ? (
          <p className="mt-4 text-sm text-black/55">No visits recorded yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-black/50 border-b border-black/10">
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Page</th>
                  <th className="py-2 pr-4">Country</th>
                  <th className="py-2 pr-4 hidden md:table-cell">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((v) => (
                  <tr key={v.id} className="border-b border-black/5 last:border-0">
                    <td className="py-3 pr-4 text-black/55 whitespace-nowrap">
                      {new Date(v.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-black/80">
                      {v.page}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-block rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald">
                        {v.country}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-black/55 truncate max-w-[200px] hidden md:table-cell">
                      {v.referrer || "(direct)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
