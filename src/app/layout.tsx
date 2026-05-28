import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";
import VisitorTracker from "@/components/VisitorTracker";
import AnnouncementBar from "@/components/AnnouncementBar";
import InquiryDrawer from "@/components/InquiryDrawer";
import AdminEditOverlay from "@/components/AdminEditOverlay";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amaka Fashion Atelier | Bespoke Menswear · Abakaliki",
  description:
    "An atelier in Abakaliki crafting bespoke senator wear, suits, traditional and corporate menswear. Italian wool, Egyptian cotton, hand-finished. Where heritage meets distinction.",
  keywords: [
    "Amaka Fashion Atelier",
    "luxury menswear Nigeria",
    "Senator wear Abakaliki",
    "bespoke suits Nigeria",
    "Igbo traditional menswear",
    "Aso-Oke",
    "Nigerian gentleman",
  ],
  metadataBase: new URL("https://amaka-fashion-atelier.vercel.app"),
  openGraph: {
    title: "Amaka Fashion Atelier | Bespoke Menswear · Abakaliki",
    description:
      "Bespoke senator wear, suits, and traditional menswear hand-finished in Abakaliki. Where heritage meets distinction.",
    type: "website",
    locale: "en_US",
    siteName: "Amaka Fashion Atelier",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amaka Fashion Atelier",
    description:
      "Bespoke menswear hand-finished in Abakaliki. Where heritage meets distinction.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-black">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollProgress />
        <ChatBot />
        <WhatsAppButton />
        <ScrollToTop />
        <InquiryDrawer />
        <AdminEditOverlay />
        <VisitorTracker />
        <Analytics />
      </body>
    </html>
  );
}
