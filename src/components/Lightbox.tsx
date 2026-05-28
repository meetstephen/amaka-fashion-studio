"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface LightboxItem {
  id: number;
  title: string;
  caption: string;
  gradient: string;
}

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const item = items[currentIndex];
  const [scale, setScale] = useState(1);
  const pinchRef = useRef<{ initialDist: number; initialScale: number } | null>(
    null
  );

  // Reset zoom when navigating between items
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on navigation
    setScale(1);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "+":
        case "=":
          setScale((s) => Math.min(3, s + 0.25));
          break;
        case "-":
        case "_":
          setScale((s) => Math.max(1, s - 0.25));
          break;
        case "0":
          setScale(1);
          break;
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    // Don't paginate while zoomed - drag is interpreted as pan
    if (scale > 1) return;
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      onPrev();
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      onNext();
    }
  };

  // ----- Pinch-to-zoom -----
  const distance = (
    t1: { clientX: number; clientY: number },
    t2: { clientX: number; clientY: number }
  ) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchRef.current = {
        initialDist: distance(e.touches[0], e.touches[1]),
        initialScale: scale,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const d = distance(e.touches[0], e.touches[1]);
      const ratio = d / pinchRef.current.initialDist;
      const next = Math.max(1, Math.min(3, pinchRef.current.initialScale * ratio));
      setScale(next);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchRef.current = null;
    }
  };

  // Double-tap to toggle zoom
  const lastTap = useRef(0);
  const handleClickToggleZoom = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setScale((s) => (s > 1 ? 1 : 2));
    }
    lastTap.current = now;
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Lightbox: ${item.title}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-[110] grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <X size={24} />
          </button>

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 z-[110] flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.min(3, s + 0.25));
              }}
              aria-label="Zoom in"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-cream hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.max(1, s - 0.25));
              }}
              aria-label="Zoom out"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-cream hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
            >
              <ZoomOut size={20} />
            </button>
            {scale !== 1 && (
              <span className="grid place-items-center px-3 rounded-full bg-white/10 text-cream text-xs">
                {Math.round(scale * 100)}%
              </span>
            )}
          </div>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronRight size={24} />
          </button>

          {/* Content */}
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            drag={scale === 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onClick={(e) => {
              e.stopPropagation();
              handleClickToggleZoom();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-[90vw] max-w-3xl aspect-[3/4] md:aspect-[4/3] rounded-2xl overflow-hidden touch-none"
            style={{
              cursor: scale > 1 ? "zoom-out" : "zoom-in",
            }}
          >
            <motion.div
              animate={{ scale }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className={`absolute inset-0 ${item.gradient}`}
            />

            {/* Text overlay - hides while zoomed for clarity */}
            {scale === 1 && (
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-6 md:p-8 pointer-events-none">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-cream">
                  {item.title}
                </h2>
                <p className="mt-2 text-cream/80 text-sm md:text-base">
                  {item.caption}
                </p>
                <p className="mt-3 text-cream/50 text-xs">
                  {currentIndex + 1} / {items.length} · double-tap or pinch to
                  zoom
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
