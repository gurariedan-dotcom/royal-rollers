import Link from "next/link";
import AdminQuotesPage from "@/components/AdminQuotesPage";

export const metadata = {
  title: "Quotes | Royal Rollers Ops",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="manifest-label">Internal</p>
      <h1 className="mt-2 text-3xl">Quotes</h1>
      <p className="mt-4 text-ink/70">
        Set a price on an incoming request to email the customer their quote and booking link.
        Sorted newest first — search by customer name or email to find a request.
      </p>
      <p className="mt-2 text-sm text-ink/50">
        <Link href="/admin/bookings" className="underline hover:text-brass">
          Go to Bookings →
        </Link>
      </p>
      <div className="mt-10">
        <AdminQuotesPage />
      </div>
    </div>
  );
}
