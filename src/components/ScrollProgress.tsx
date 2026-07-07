"use client";

import { useEffect, useState } from "react";

/**
 * Thin gold scroll progress bar fixed to the top of the viewport.
 * Sits above the navbar (z-[60]) so it's always visible.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrollTop / max) * 100 : 0;
      setProgress(pct);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-gold-dark via-gold-light to-gold transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
