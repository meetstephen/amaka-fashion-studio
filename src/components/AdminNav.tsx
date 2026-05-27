"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  FileText,
  BookOpen,
  Star,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/images", label: "Images", icon: Image },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/lookbook", label: "Lookbook", icon: BookOpen },
  { href: "/admin/featured", label: "Featured", icon: Star },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show nav on login page
  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <nav className="bg-black text-cream border-b border-emerald/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-heading font-bold text-gold">
              Admin Panel
            </h1>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald text-cream"
                      : "text-cream/70 hover:text-cream hover:bg-emerald/20"
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden md:flex items-center gap-1 px-3 py-2 text-sm text-cream/70 hover:text-cream transition-colors"
              aria-label="Back to site"
            >
              <Home size={16} />
              <span>Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 px-3 py-2 text-sm text-cream/70 hover:text-red-400 transition-colors min-h-[44px]"
              aria-label="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden grid h-11 w-11 place-items-center rounded-md text-cream/70 hover:text-cream"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald/20 bg-black/95">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium min-h-[44px] transition-colors ${
                    isActive
                      ? "bg-emerald text-cream"
                      : "text-cream/70 hover:text-cream hover:bg-emerald/20"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-emerald/20 pt-2 mt-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-cream/70 hover:text-cream min-h-[44px]"
              >
                <Home size={18} />
                Back to Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm text-cream/70 hover:text-red-400 min-h-[44px]"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
