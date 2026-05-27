"use client";

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-gradient-to-r from-black/5 via-black/10 to-black/5 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 rounded bg-black/10 animate-pulse" />
        <div className="h-4 w-full rounded bg-black/5 animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-black/5 animate-pulse" />
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-black/10 animate-pulse"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-32 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="h-3 w-24 mx-auto rounded bg-black/10 animate-pulse" />
          <div className="h-10 w-64 mx-auto rounded bg-black/10 animate-pulse" />
          <div className="h-px w-16 mx-auto bg-black/10" />
        </div>

        {/* Grid skeleton */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
