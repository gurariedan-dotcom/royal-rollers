import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Modernist design system: one grotesk (Archivo) for both display and body
// text, JetBrains Mono for VINs, ZIPs, and dollar amounts so data reads as
// data rather than prose.
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.royalrollers.example"),
  title: {
    default: "Royal Rollers | Nationwide Vehicle Transport",
    template: "%s | Royal Rollers",
  },
  description:
    "Carrier or personal-driver vehicle transport anywhere in the country. Get a priced quote by email, book with a deposit, and pay the balance automatically on delivery.",
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
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
