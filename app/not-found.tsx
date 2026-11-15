import Link from "next/link";
import { MapPinLine } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center md:py-32">
      <MapPinLine size={40} weight="duotone" className="mx-auto text-amber-ink" />
      <h1 className="mt-5 text-4xl">
        This route doesn&apos;t exist
      </h1>
      <p className="mt-4 text-lg text-slate">
        The page you&apos;re looking for isn&apos;t here. It may have moved,
        or the link may be off.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="btn-amber"
        >
          Back home
        </Link>
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
