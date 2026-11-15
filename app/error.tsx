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
    <div className="mx-auto max-w-lg px-6 py-24 text-center md:py-32">
      <WarningCircle size={40} weight="duotone" className="mx-auto text-danger" />
      <h1 className="mt-5 text-4xl">
        Something went off route
      </h1>
      <p className="mt-4 text-lg text-slate">
        That page hit a snag on our end. Try again, or reach out directly if
        it keeps happening.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="btn-amber"
        >
          Try again
        </button>
        <Link
          href="/contact"
          className="btn-outline"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
