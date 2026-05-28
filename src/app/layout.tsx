import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B3D2E",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://amaka-fashion-atelier.vercel.app/#atelier",
  name: "Amaka Fashion Atelier",
  description:
    "An atelier in Abakaliki crafting bespoke senator wear, suits, traditional and corporate menswear. Italian wool, Egyptian cotton, hand-finished. Where heritage meets distinction.",
  url: "https://amaka-fashion-atelier.vercel.app",
  telephone: "+234 913 127 2407",
  priceRange: "$$$",
  image: "https://amaka-fashion-atelier.vercel.app/favicon.svg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abakaliki",
    addressRegion: "Ebonyi State",
    addressCountry: "NG",
  },
  areaServed: {
    "@type": "Country",
    name: "Nigeria",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  // TODO: populate once social channels are live
  sameAs: [],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
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
        <VisitorTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
