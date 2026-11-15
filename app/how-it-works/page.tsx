import Link from "next/link";
import { ContactSection, HowItWorksSection } from "@/components/Sections";

export const metadata = {
  title: "How It Works",
  description:
    "The five steps from requesting a quote to your vehicle arriving, including how and when payment happens.",
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
