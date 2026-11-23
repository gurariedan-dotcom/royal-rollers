import { ContactSection, ServicesSection } from "@/components/Sections";

export const metadata = {
  title: "Car Transport Services: Carrier vs. Personal Driver",
  description:
    "Compare state-to-state car transport options side by side: insured carrier shipping vs. a personal driver. Insurance, mileage, fees, and typical turnaround.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesSection as="h1" detailed />
      <ContactSection />
    </>
  );
}
