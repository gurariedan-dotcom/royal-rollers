import Link from "next/link";
import { ChatCircleDots } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Reviews",
  description: "Customer reviews for Royal Rollers vehicle transport are coming soon.",
};

// No reviews backend exists yet (see app/about, same hand-edited pattern).
// Rather than shipping fabricated testimonials, this is an honest, designed
// empty state -- swap it for real customer quotes as soon as there are any.
export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="manifest-label">Reviews</p>
      <h1 className="mt-2 text-3xl">What customers say</h1>

      <div className="mt-10 rounded-sm border border-ink/10 bg-paper-dim/40 px-8 py-12">
        <ChatCircleDots size={36} weight="duotone" className="mx-auto text-brass" />
        <p className="mt-4 font-display text-lg uppercase tracking-wideish text-ink">
          Reviews are on their way
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
          We&apos;re collecting feedback from recent moves and will start posting
          real customer reviews here. In the meantime, feel free to ask us
          directly for references from a past route like yours.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/contact"
          className="rounded-sm border border-ink/20 px-8 py-3 font-display text-sm uppercase tracking-wideish text-ink transition-all hover:border-ink/50 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        >
          Ask for References
        </Link>
        <Link
          href="/quote"
          className="rounded-sm border border-brass px-8 py-3 font-display text-sm uppercase tracking-wideish text-brass transition-all hover:bg-brass hover:text-paper hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        >
          Get a Quote
        </Link>
      </div>
    </div>
  );
}
