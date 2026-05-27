import type { Metadata } from "next";
import AdminNav from "@/components/AdminNav";

export const metadata: Metadata = {
  title: "Admin | Amaka Fashion Atelier",
  description: "Admin panel for managing Amaka Fashion Atelier content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-cream overflow-auto">
      <AdminNav />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
