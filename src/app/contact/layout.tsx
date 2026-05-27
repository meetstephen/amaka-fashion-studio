import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Amaka Fashion Atelier",
  description:
    "Get in touch with Amaka Fashion Atelier. Book a fitting, discuss your bespoke order, or visit our atelier in Abakaliki, Ebonyi State, Nigeria.",
  openGraph: {
    title: "Contact Us | Amaka Fashion Atelier",
    description:
      "Get in touch with Amaka Fashion Atelier. Book a fitting or discuss your bespoke order.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
