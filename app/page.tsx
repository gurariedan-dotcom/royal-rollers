import Link from "next/link";
import RouteMap from "@/components/RouteMap";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="manifest-label">Tri-State &rarr; Nationwide</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] md:text-5xl">
            Your car, moved anywhere.
            <br />
            <span className="text-brass">Your call how.</span>
          </h1>
          <p className="mt-6 max-w-md text-ink/75">
            Royal Rollers arranges vehicle transport from the Tri-State area to
            anywhere in the country &mdash; on an insured multi-car hauler, or driven
            directly by a personal driver. Two real options, quoted directly by us.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/quote"
              className="rounded-sm bg-brass px-6 py-3 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark"
            >
              Get a Quote
            </Link>
            <Link
              href="/services"
              className="rounded-sm border border-ink/20 px-6 py-3 font-display text-sm uppercase tracking-wideish text-ink hover:border-ink/50"
            >
              Compare Options
            </Link>
          </div>
        </div>

        <div className="mx-auto h-[420px] w-[340px]">
          <RouteMap />
        </div>
      </section>

      <div className="route-rule mx-auto max-w-6xl opacity-30" />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="manifest-label text-center">Two ways there</p>
        <h2 className="mt-2 text-center text-3xl">Pick what fits your timeline</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border-2 border-highway/30 bg-highway/5 p-8">
            <p className="font-display text-xl uppercase tracking-wideish text-highway">
              Carrier Transport
            </p>
            <p className="mt-3 text-ink/75">
              Your vehicle rides on an insured, licensed carrier&apos;s hauler.
              No mileage added. No hidden fees. Typically 1&ndash;4 days.
            </p>
          </div>
          <div className="rounded-sm border-2 border-rust/30 bg-rust/5 p-8">
            <p className="font-display text-xl uppercase tracking-wideish text-rust">
              Personal Driver
            </p>
            <p className="mt-3 text-ink/75">
              A driver takes your car directly, point to point. Faster and more
              precise timing &mdash; typically 24&ndash;30 hours. Adds mileage to the vehicle.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          <Link href="/services" className="underline hover:text-brass">
            See the full side-by-side comparison
          </Link>
        </p>
      </section>

      <div className="route-rule mx-auto max-w-6xl opacity-30" />

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="manifest-label">The promise</p>
        <h2 className="mt-2 text-3xl">A priced quote sent straight to your inbox</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          Submit your vehicle and route details once. You&apos;ll get a real number
          back by email &mdash; not a callback promise.
        </p>
        <Link
          href="/quote"
          className="mt-8 inline-block rounded-sm bg-brass px-8 py-3 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark"
        >
          Start Your Quote
        </Link>
      </section>
    </>
  );
}
