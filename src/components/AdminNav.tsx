"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  BookOpen,
  Star,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  Megaphone,
  MessageSquareText,
  Quote,
  ClipboardList,
  CalendarDays,
  Users,
} from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: ClipboardList },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/images", label: "Images", icon: ImageIcon },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/lookbook", label: "Lookbook", icon: BookOpen },
  { href: "/admin/featured", label: "Featured", icon: Star },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/templates", label: "Templates", icon: MessageSquareText },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <>
    <nav className="bg-black text-cream border-b border-emerald/20 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base md:text-lg font-heading font-semibold text-gold tracking-wide truncate">
              Amaka · Admin
            </h1>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-md text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? "bg-emerald text-cream"
                      : "text-cream/70 hover:text-cream hover:bg-emerald/20"
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1 px-3 py-2 text-xs uppercase tracking-[0.18em] text-cream/70 hover:text-cream transition-colors"
              aria-label="Back to site"
            >
              <Home size={14} />
              <span>Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-1 px-3 py-2 text-xs uppercase tracking-[0.18em] text-cream/70 hover:text-red-400 transition-colors min-h-[44px]"
              aria-label="Logout"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden grid h-11 w-11 place-items-center rounded-md text-cream/70 hover:text-cream"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald/20 bg-black/95">
          <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
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

    {/* Fixed bottom bar for mobile - easy "Back to Site" */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-emerald min-h-[56px] flex items-center justify-center shadow-[0_-2px_12px_rgba(0,0,0,0.15)]">
      <Link
        href="/"
        className="flex items-center gap-2 text-cream font-medium text-sm uppercase tracking-[0.14em] min-h-[56px] px-6"
      >
        <Home size={18} />
        Return to Site
      </Link>
    </div>
    </>
  );
}
