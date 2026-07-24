import QuoteForm from "@/components/QuoteForm";

export const metadata = {
  title: "Request a Quote",
  description:
    "Get a priced vehicle transport quote by email in five short steps. No obligation to book, no phone tag.",
};

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="manifest-label">Request a quote</p>
      <h1 className="mt-2 text-2xl sm:text-3xl">Tell us about the move</h1>
      <p className="mt-4 text-ink/70">
        Five short steps. We&apos;ll email you a priced quote, no obligation to
        book.
      </p>

      <div className="mt-6 rounded-sm border border-ink/10 bg-paper p-4 shadow-panel sm:mt-10 sm:p-6 md:p-10">
        <QuoteForm />
      </div>
    </div>
  );
}
