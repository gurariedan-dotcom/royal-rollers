"use client";

import Link from "next/link";
import { useEffect } from "react";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <WarningCircle size={40} weight="duotone" className="mx-auto text-brass-dark" />
      <h1 className="mt-4 font-display text-2xl uppercase tracking-signage text-ink">
        Something went off route
      </h1>
      <p className="mt-3 text-ink/70">
        That page hit a snag on our end. Try again, or reach out directly if
        it keeps happening.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm bg-brass px-6 py-3 font-display text-sm uppercase tracking-wideish text-paper transition-all hover:bg-brass-dark hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        >
          Try Again
        </button>
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
