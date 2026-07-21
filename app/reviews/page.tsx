import Link from "next/link";

export const metadata = {
  title: "Reviews | Royal Rollers",
};

// Placeholder testimonials -- swap these for real customer quotes whenever
// you have them. No database or submission form behind this page; it's a
// hand-edited page, same as app/about/page.tsx.
const REVIEWS: { quote: string; name: string; route: string }[] = [
  {
    quote: "Placeholder review -- replace with a real customer quote.",
    name: "Customer name",
    route: "Route, e.g. NJ → FL",
  },
  {
    quote: "Placeholder review -- replace with a real customer quote.",
    name: "Customer name",
    route: "Route, e.g. NY → TX",
  },
  {
    quote: "Placeholder review -- replace with a real customer quote.",
    name: "Customer name",
    route: "Route, e.g. CT → FL",
  },
];

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="manifest-label">Reviews</p>
      <h1 className="mt-2 text-3xl">What customers say</h1>
      <p className="mt-4 max-w-2xl text-ink/70">
        Real feedback from people who&apos;ve shipped a car with us.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {REVIEWS.map((review, i) => (
          <div key={i} className="rounded-sm border border-ink/10 p-6">
            <p className="text-ink/80">&ldquo;{review.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-medium text-ink">{review.name}</p>
            <p className="manifest-label mt-1">{review.route}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/quote"
          className="rounded-sm bg-brass px-8 py-3 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark"
        >
          Get a Quote
        </Link>
      </div>
    </div>
  );
}
