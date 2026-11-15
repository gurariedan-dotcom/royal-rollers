import { ContactSection, ServicesSection } from "@/components/Sections";

export const metadata = {
  title: "Services",
  description:
    "Compare Carrier Transport and Personal Driver vehicle shipping side by side: insurance, mileage, fees, and typical turnaround.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesSection as="h1" detailed />
      <ContactSection />
    </>
  );
}
