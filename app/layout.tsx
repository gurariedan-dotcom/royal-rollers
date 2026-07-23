import type { Metadata } from "next";
import { Big_Shoulders_Display, Archivo, Fragment_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Display face: tall, condensed, stamped-plate weight -- reads like a
// stenciled ID plate bolted to a rig, not a printed page. Body face:
// Archivo, a clean workmanlike grotesk that stays out of the way. Mono
// face: Fragment Mono, for VINs, zips, and dollar amounts, so data reads
// like data without the generic code-editor look.
const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-big-shoulders",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fragment-mono",
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
    <html lang="en" className={`${bigShoulders.variable} ${archivo.variable} ${fragmentMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
