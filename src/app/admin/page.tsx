"use client";

import Link from "next/link";
import {
  Image as ImageIcon,
  FileText,
  BookOpen,
  Star,
  BarChart3,
  Megaphone,
  MessageSquareText,
  Quote,
  ClipboardList,
  CalendarDays,
  Users,
} from "lucide-react";

interface Section {
  href: string;
  title: string;
  description: string;
  icon: typeof ImageIcon;
  gradient: string;
  group: "Operations" | "Content" | "Insights";
}

const sections: Section[] = [
  // Operations
  {
    href: "/admin/inquiries",
    title: "Orders / Inquiries",
    description: "Track every conversation from first message to final delivery",
    icon: ClipboardList,
    gradient: "from-emerald to-emerald-dark",
    group: "Operations",
  },
  {
    href: "/admin/bookings",
    title: "Bookings",
    description: "Schedule fittings, consultations, and deliveries",
    icon: CalendarDays,
    gradient: "from-emerald-dark to-black",
    group: "Operations",
  },
  {
    href: "/admin/customers",
    title: "Customer Accounts",
    description: "Profiles, measurements, and personal preferences",
    icon: Users,
    gradient: "from-black to-emerald-dark",
    group: "Operations",
  },
  {
    href: "/admin/templates",
    title: "WhatsApp Templates",
    description: "Reusable message snippets for client communication",
    icon: MessageSquareText,
    gradient: "from-emerald to-black",
    group: "Operations",
  },
  // Content
  {
    href: "/admin/images",
    title: "Images",
    description: "Upload and manage site images, collections, and galleries",
    icon: ImageIcon,
    gradient: "from-emerald to-emerald-dark",
    group: "Content",
  },
  {
    href: "/admin/content",
    title: "Site Copy",
    description: "Edit homepage tagline, collection text, and about story",
    icon: FileText,
    gradient: "from-emerald-dark to-black",
    group: "Content",
  },
  {
    href: "/admin/lookbook",
    title: "Lookbook",
    description: "Manage lookbook gallery photos, titles, and captions",
    icon: BookOpen,
    gradient: "from-black to-emerald-dark",
    group: "Content",
  },
  {
    href: "/admin/featured",
    title: "Featured",
    description: "Update the homepage hero featured image and overlay text",
    icon: Star,
    gradient: "from-emerald via-emerald-dark to-black",
    group: "Content",
  },
  {
    href: "/admin/announcements",
    title: "Announcements",
    description: "Manage the top announcement bar (toggle, text, link)",
    icon: Megaphone,
    gradient: "from-emerald-light to-emerald",
    group: "Content",
  },
  {
    href: "/admin/testimonials",
    title: "Testimonials",
    description: "Add, edit, and curate customer testimonials",
    icon: Quote,
    gradient: "from-emerald to-emerald-light",
    group: "Content",
  },
  // Insights
  {
    href: "/admin/analytics",
    title: "Analytics",
    description: "Visitor pulse, top pages, referrers, and traffic by day",
    icon: BarChart3,
    gradient: "from-emerald-dark to-emerald",
    group: "Insights",
  },
];

const GROUPS = ["Operations", "Content", "Insights"] as const;

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.42em] text-emerald font-medium">
          Welcome back
        </p>
        <h2 className="mt-2 font-heading text-3xl font-semibold text-black">
          Atelier Dashboard
        </h2>
        <p className="text-black/60 mt-2 max-w-xl">
          Manage every conversation, every commission, every page from one
          place.
        </p>
      </div>

      {GROUPS.map((group) => {
        const items = sections.filter((s) => s.group === group);
        return (
          <section key={group} className="mb-10">
            <h3 className="text-[10px] uppercase tracking-[0.42em] text-black/55 font-medium mb-4">
              {group}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((section) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="group block rounded-2xl border border-emerald/10 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 min-h-[120px]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br ${section.gradient} text-cream`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-lg font-semibold text-black group-hover:text-emerald transition-colors">
                          {section.title}
                        </h4>
                        <p className="text-xs text-black/55 mt-1 leading-relaxed">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
