import JsonLd from "@/components/JsonLd";
import { ContactSection, FaqSection } from "@/components/Sections";
import { FAQS } from "@/lib/content";

export const metadata = {
  title: "Car Shipping FAQ",
  description:
    "Answers to common car shipping questions: carrier transport vs. personal driver, cost, insurance, VINs, payment, and enclosed auto transport.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <FaqSection as="h1" />
      <ContactSection />
    </>
  );
}
