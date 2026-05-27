"use client";

import Link from "next/link";
import { Image, FileText, BookOpen, Star } from "lucide-react";

const sections = [
  {
    href: "/admin/images",
    title: "Images",
    description: "Upload and manage site images, collections, and galleries",
    icon: Image,
    gradient: "from-emerald to-emerald-dark",
  },
  {
    href: "/admin/content",
    title: "Content",
    description: "Edit homepage tagline, collection descriptions, and about text",
    icon: FileText,
    gradient: "from-emerald-dark to-black",
  },
  {
    href: "/admin/lookbook",
    title: "Lookbook",
    description: "Manage lookbook gallery photos, titles, and captions",
    icon: BookOpen,
    gradient: "from-black to-emerald-dark",
  },
  {
    href: "/admin/featured",
    title: "Featured Image",
    description: "Update the homepage hero featured image and overlay text",
    icon: Star,
    gradient: "from-emerald via-emerald-dark to-black",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-black">
          Dashboard
        </h2>
        <p className="text-black/60 mt-2">
          Manage your site content and media
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group block rounded-xl border border-emerald/10 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 min-h-[120px]"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${section.gradient} text-cream`}
                >
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-heading font-semibold text-black group-hover:text-emerald transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-black/60 mt-1">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
