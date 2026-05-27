import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amaka Fashion Atelier | Crafting the Modern Nigerian Gentleman",
  description:
    "Amaka Fashion Atelier is a luxury menswear brand based in Abakaliki, Nigeria. We specialize in Senator Wear, Suits, Shirts, and bespoke fashion that blends Nigerian heritage with modern elegance.",
  keywords: [
    "luxury menswear",
    "Nigerian fashion",
    "Senator Wear",
    "Abakaliki",
    "bespoke suits",
    "Amaka Fashion",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatBot />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
