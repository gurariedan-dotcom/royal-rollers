import { ContactSection, FaqSection } from "@/components/Sections";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about carrier transport, personal driver service, VINs, payment, and enclosed transport.",
};

export default function FaqPage() {
  return (
    <>
      <FaqSection as="h1" />
      <ContactSection />
    </>
  );
}
