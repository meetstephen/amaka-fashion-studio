/**
 * In-memory visitor tracking store.
 *
 * NOTE: This data lives only in the running server process and resets on
 * deploy / cold start. It's good enough for a quick admin pulse on traffic
 * but not durable analytics.
 *
 * TODO: Replace with Supabase `visitor_events` table:
 *   - id uuid pk default gen_random_uuid()
 *   - page text not null
 *   - referrer text
 *   - ip_hash text          (hashed for privacy)
 *   - user_agent text
 *   - country text
 *   - created_at timestamptz default now()
 */

export interface VisitorEvent {
  id: string;
  page: string;
  referrer: string;
  ipHash: string;
  userAgent: string;
  country: string;
  timestamp: number;
}

const MAX_ENTRIES = 1000;

interface GlobalStore {
  __amakaVisitorEvents?: VisitorEvent[];
}

function bucket(): VisitorEvent[] {
  const g = globalThis as unknown as GlobalStore;
  if (!g.__amakaVisitorEvents) g.__amakaVisitorEvents = [];
  return g.__amakaVisitorEvents;
}

export function recordVisit(event: Omit<VisitorEvent, "id" | "timestamp">): VisitorEvent {
  const list = bucket();
  const v: VisitorEvent = {
    ...event,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  list.push(v);
  // cap memory
  if (list.length > MAX_ENTRIES) {
    list.splice(0, list.length - MAX_ENTRIES);
  }
  return v;
}

export function getEvents(): VisitorEvent[] {
  return [...bucket()];
}

export function getStats() {
  const events = bucket();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const week = 7 * day;
  const month = 30 * day;

  // Treat each unique ipHash within window as a "visitor"
  const uniqueWithin = (windowMs: number) => {
    const cutoff = now - windowMs;
    const seen = new Set<string>();
    for (const e of events) {
      if (e.timestamp >= cutoff) seen.add(e.ipHash || e.id);
    }
    return seen.size;
  };

  // Top pages
  const pageCounts = new Map<string, number>();
  for (const e of events) {
    pageCounts.set(e.page, (pageCounts.get(e.page) || 0) + 1);
  }
  const topPages = [...pageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([page, count]) => ({ page, count }));

  // Top referrers
  const refCounts = new Map<string, number>();
  for (const e of events) {
    const r = e.referrer || "(direct)";
    refCounts.set(r, (refCounts.get(r) || 0) + 1);
  }
  const topReferrers = [...refCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([referrer, count]) => ({ referrer, count }));

  return {
    today: uniqueWithin(day),
    week: uniqueWithin(week),
    month: uniqueWithin(month),
    total: new Set(events.map((e) => e.ipHash || e.id)).size,
    pageviews: events.length,
    topPages,
    topReferrers,
    recent: events.slice(-20).reverse(),
  };
}

/** Simple FNV-1a hash for privacy-preserving IP fingerprinting. */
export function hashIp(ip: string, salt = "amaka"): string {
  const data = `${ip}:${salt}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
