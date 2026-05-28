"use client";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  variant?: "compact" | "full";
  showSubtitle?: boolean;
  /** Tailwind text color for wordmark (allows contrast control by parent) */
  wordmarkClass?: string;
}

/**
 * Amaka Fashion Atelier monogram.
 * Stylized "A" with crossbar (thread), encircled by a hairline orbit (the
 * "atelier ring"), and a tiny needle motif descending from the apex.
 * Antique-gold linear gradient for the metalwork; deep emerald inset.
 */
export default function Logo({
  className = "",
  showWordmark = false,
  variant = "compact",
  showSubtitle = false,
  wordmarkClass = "text-gold",
}: LogoProps) {
  const renderWord = showWordmark || variant === "full";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Amaka Fashion Atelier"
        role="img"
        className="h-10 w-10 shrink-0 transition-transform duration-500 hover:[animation:shimmer-gold_1.6s_ease-in-out]"
      >
        <defs>
          <linearGradient id="afa-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0C384" />
            <stop offset="55%" stopColor="#C9A961" />
            <stop offset="100%" stopColor="#9F8345" />
          </linearGradient>
          <linearGradient id="afa-gold-soft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0C384" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9F8345" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer atelier ring */}
        <circle cx="32" cy="32" r="29" stroke="url(#afa-gold-soft)" strokeWidth="0.7" />
        {/* Inner hairline */}
        <circle cx="32" cy="32" r="25.5" stroke="url(#afa-gold-soft)" strokeWidth="0.3" opacity="0.45" />

        {/* Decorative laurel sprigs - left */}
        <path
          d="M9 32 q-2 -3 -1 -6 M9 32 q-2 3 -1 6 M11 28 q-2 -2 -1 -4 M11 36 q-2 2 -1 4"
          stroke="url(#afa-gold-soft)"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Decorative laurel sprigs - right */}
        <path
          d="M55 32 q2 -3 1 -6 M55 32 q2 3 1 6 M53 28 q2 -2 1 -4 M53 36 q2 2 1 4"
          stroke="url(#afa-gold-soft)"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Stylized A - body */}
        <path
          d="M32 14 L46 48 H41.2 L38.4 41 H25.6 L22.8 48 H18 Z"
          fill="url(#afa-gold)"
        />
        {/* A interior cut-out */}
        <path d="M27.4 36.5 H36.6 L32 24.5 Z" fill="#0B3D2E" />
        {/* Crossbar / thread */}
        <rect x="26.5" y="33.6" width="11" height="1.5" fill="#0B3D2E" rx="0.5" />
        {/* Crossbar gold inlay */}
        <rect x="26.5" y="34.1" width="11" height="0.4" fill="url(#afa-gold)" opacity="0.85" />

        {/* Needle motif - vertical descent from apex */}
        <line x1="32" y1="6" x2="32" y2="13" stroke="url(#afa-gold)" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="32" cy="5.6" r="1.1" fill="url(#afa-gold)" />
        {/* Thread tail */}
        <path d="M32 6 q3 1 3 3" stroke="url(#afa-gold-soft)" strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.7" />

        {/* Bottom serif foot */}
        <line x1="22" y1="50.5" x2="42" y2="50.5" stroke="url(#afa-gold-soft)" strokeWidth="0.5" opacity="0.6" />
        <line x1="24" y1="51.7" x2="40" y2="51.7" stroke="url(#afa-gold-soft)" strokeWidth="0.3" opacity="0.4" />
      </svg>

      {renderWord && (
        <span className="leading-tight">
          <span
            className={`block font-heading text-[0.7rem] sm:text-base font-semibold tracking-[0.2em] sm:tracking-[0.32em] uppercase ${wordmarkClass}`}
          >
            Amaka <span className="font-light italic tracking-wider">Fashion</span> Atelier
          </span>
          {showSubtitle && (
            <span className="mt-1 block text-[9px] tracking-[0.42em] uppercase text-gold/70">
              Atelier · Abakaliki · Est. 2024
            </span>
          )}
        </span>
      )}
    </span>
  );
}
