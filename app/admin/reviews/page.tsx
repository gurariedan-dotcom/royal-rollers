import AdminNavTabs from "@/components/AdminNavTabs";
import AdminReviewsPage from "@/components/AdminReviewsPage";

export const metadata = {
  title: "Reviews | Royal Rollers Ops",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="manifest-label">Internal</p>
      <h1 className="mt-2 text-3xl">Reviews</h1>
      <p className="mt-4 text-ink/70">
        Add feedback from past customers. Reviews show on the Reviews page right away, and the
        newest three show on the homepage.
      </p>
      <div className="mt-6">
        <AdminNavTabs />
      </div>
      <div className="mt-10">
        <AdminReviewsPage />
      </div>
    </div>
  );
}
