import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections | Amaka Fashion Atelier",
  description:
    "Browse our curated collection of luxury menswear - Senator Wear, Suits, Shirts, Traditional, Casual, and Corporate attire crafted for the modern Nigerian gentleman.",
  openGraph: {
    title: "Collections | Amaka Fashion Atelier",
    description:
      "Browse our curated collection of luxury menswear crafted for the modern Nigerian gentleman.",
    type: "website",
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
