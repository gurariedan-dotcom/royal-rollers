import { ContactSection, ReviewsSection } from "@/components/Sections";

export const metadata = {
  title: "Reviews",
  description: "Reviews from Royal Rollers vehicle transport customers.",
};

// Reviews are added by the owner from /admin/reviews; the admin API
// revalidates this page on every change, the hourly revalidate is a backstop.
export const revalidate = 3600;

export default function ReviewsPage() {
  return (
    <>
      <ReviewsSection as="h1" />
      <ContactSection />
    </>
  );
}
