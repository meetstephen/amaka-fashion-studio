import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lookbook | Amaka Fashion Atelier",
  description:
    "Explore our curated lookbook of luxury menswear. Each piece tells a story of Nigerian heritage, craftsmanship, and modern elegance.",
  openGraph: {
    title: "Lookbook | Amaka Fashion Atelier",
    description:
      "Explore our curated lookbook of luxury menswear. Each piece tells a story of Nigerian heritage, craftsmanship, and modern elegance.",
    type: "website",
  },
};

export default function LookbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
