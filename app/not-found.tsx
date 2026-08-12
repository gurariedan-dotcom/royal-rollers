import Link from "next/link";
import { MapPinLine } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <MapPinLine size={40} weight="duotone" className="mx-auto text-brass-dark" />
      <h1 className="mt-4 font-display text-2xl uppercase tracking-signage text-ink">
        This route doesn&apos;t exist
      </h1>
      <p className="mt-3 text-ink/70">
        The page you&apos;re looking for isn&apos;t here. It may have moved,
        or the link may be off.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-sm bg-brass px-6 py-3 font-display text-sm uppercase tracking-wideish text-paper transition-all hover:bg-brass-dark hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        >
          Back Home
        </Link>
        <Link
          href="/contact"
          className="rounded-sm border border-ink/20 px-6 py-3 font-display text-sm uppercase tracking-wideish text-ink transition-all hover:border-ink/50 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
