import { ContactSection } from "@/components/Sections";

export const metadata = {
  title: "Contact",
  description: "Reach Royal Rollers directly by phone or email before requesting a quote.",
};

// No contact-form backend: tel/mailto links only (see lib/content.ts).
export default function ContactPage() {
  return <ContactSection as="h1" fill />;
}
