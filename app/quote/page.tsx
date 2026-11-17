import QuoteForm from "@/components/QuoteForm";

export const metadata = {
  title: "Request a Quote",
  description:
    "Get a priced vehicle transport quote by email in five short steps. No obligation to book.",
};

const ZIP = /^\d{5}$/;

// The homepage quote card submits here via GET; only well-formed values pre-fill.
export default function QuotePage({
  searchParams,
}: {
  searchParams: { pickupZip?: string; dropoffZip?: string; enclosed?: string };
}) {
  const { pickupZip, dropoffZip, enclosed } = searchParams;
  const initial = {
    ...(pickupZip && ZIP.test(pickupZip) ? { pickupZip } : {}),
    ...(dropoffZip && ZIP.test(dropoffZip) ? { dropoffZip } : {}),
    ...(enclosed === "open" || enclosed === "enclosed" ? { enclosed: enclosed as "open" | "enclosed" } : {}),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-20">
      <p className="kicker">Request a quote</p>
      <h1 className="mt-4 text-4xl md:text-5xl">Tell us about the move</h1>
      <p className="mt-5 text-lg text-slate">
        Five short steps. We email you a priced quote, no obligation to book.
      </p>

      <div className="card mt-8 rounded-2xl p-5 shadow-panel sm:p-8 md:mt-10 md:p-12">
        <QuoteForm initial={initial} />
      </div>
    </div>
  );
}
