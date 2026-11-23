import Link from "next/link";
import { ContactSection, HowItWorksSection } from "@/components/Sections";

export const metadata = {
  title: "How Car Shipping Works",
  description:
    "How shipping your car state to state works with Royal Rollers: five steps from requesting a quote to your vehicle arriving, including when payment happens.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksSection as="h1" />
      <div className="bg-paper-dim">
        <div className="mx-auto max-w-6xl px-6 pb-20 md:pb-24">
          <Link href="/quote" className="btn-amber px-8 py-3.5 text-lg">
            Start your quote
          </Link>
        </div>
      </div>
      <ContactSection />
    </>
  );
}
