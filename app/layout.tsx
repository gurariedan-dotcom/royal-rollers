import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ADDRESS, CONTACT, MC, SITE_URL, USDOT } from "@/lib/content";

// One grotesk (Archivo) for headings and body; JetBrains Mono only for
// VINs, ZIPs, and dollar amounts in the quote/booking flow.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Royal Rollers | State-to-State Car Shipping & Auto Transport",
    template: "%s | Royal Rollers",
  },
  description:
    "Ship your car state to state from New York, New Jersey and Connecticut to anywhere in the U.S. Insured carrier or personal driver. Get a priced quote by email, book with a deposit, pay the rest on delivery.",
  openGraph: {
    siteName: "Royal Rollers",
    type: "website",
  },
};

// The "business card" Google and AI assistants read. Add profile URLs
// (Google Business, Yelp, BBB, TransportReviews...) to sameAs as they go live.
const BUSINESS = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "@id": `${SITE_URL}/#business`,
  name: "Royal Rollers",
  legalName: "Royal Rollers LLC",
  description:
    "Vehicle transport broker shipping cars state to state by insured carrier or personal driver, based in the New York Tri-State area.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-crest.jpg`,
  image: `${SITE_URL}/hero-truck.jpg`,
  telephone: CONTACT.phoneHref.replace("tel:", ""),
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.state,
    postalCode: ADDRESS.zip,
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "Canada" },
  ],
  identifier: [
    { "@type": "PropertyValue", name: "USDOT", value: USDOT },
    { "@type": "PropertyValue", name: "MC", value: MC },
  ],
  knowsAbout: ["Car shipping", "Auto transport", "State-to-state vehicle transport", "Enclosed car transport"],
  sameAs: [] as string[],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={BUSINESS} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
