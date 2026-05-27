import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Amaka Fashion Atelier",
  description:
    "Discover the story behind Amaka Fashion Atelier - luxury menswear crafted in Abakaliki, Nigeria. Our heritage, values, and commitment to the modern Nigerian gentleman.",
  openGraph: {
    title: "About Us | Amaka Fashion Atelier",
    description:
      "Discover the story behind Amaka Fashion Atelier - luxury menswear crafted in Abakaliki, Nigeria.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
