"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
      className="fixed top-24 left-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-emerald text-cream shadow-lg transition-all duration-300 hover:bg-emerald-dark hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:left-6"
    >
      <ArrowLeft size={20} />
    </Link>
  );
}
