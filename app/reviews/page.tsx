import { ContactSection, ReviewsSection } from "@/components/Sections";

export const metadata = {
  title: "Reviews",
  description: "Customer reviews for Royal Rollers vehicle transport are coming soon.",
};

// No fabricated testimonials: an honest empty state until real customer
// reviews exist. Swap ReviewsSection's body for real quotes when they do.
export default function ReviewsPage() {
  return (
    <>
      <ReviewsSection as="h1" />
      <ContactSection />
    </>
  );
}
