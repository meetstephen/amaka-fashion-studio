"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      onPrev();
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      onNext();
    }
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90vw] max-w-3xl aspect-[3/4] md:aspect-[4/3] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* Gradient placeholder */}
            <div className={`absolute inset-0 ${item.gradient}`} />

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-6 md:p-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-cream">
                {item.title}
              </h2>
              <p className="mt-2 text-cream/80 text-sm md:text-base">
                {item.caption}
              </p>
              <p className="mt-3 text-cream/50 text-xs">
                {currentIndex + 1} / {items.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
