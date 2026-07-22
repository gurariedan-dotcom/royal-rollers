import type { Metadata } from "next";
import { Oswald, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Display face: condensed, all-caps-friendly -- reads like interstate
// signage. Body face: Public Sans, the U.S. web design system's face,
// chosen deliberately for a business built on forms, VINs, and paperwork.
// Mono face: for VINs, zips, and dollar amounts, so data reads like data.
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.royalrollers.example"),
  title: {
    default: "Royal Rollers | Vehicle Transport, Tri-State to Anywhere",
    template: "%s | Royal Rollers",
  },
  description:
    "Carrier or personal-driver vehicle transport from the Tri-State area to anywhere in the country. Get a priced quote by email, book with a deposit, and pay the balance automatically on delivery.",
  openGraph: {
    siteName: "Royal Rollers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <div className="paper-grain" aria-hidden="true" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
