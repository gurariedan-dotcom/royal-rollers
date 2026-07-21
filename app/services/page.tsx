import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";

export const metadata = {
  title: "Services | Royal Rollers",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="manifest-label">Services</p>
      <h1 className="mt-2 text-3xl">Carrier Transport vs. Personal Driver</h1>
      <p className="mt-4 max-w-2xl text-ink/70">
        Both options get your car from the Tri-State area to Florida (or back).
        The difference is how it gets there &mdash; and that difference matters
        for cost, timing, and what happens to your odometer along the way.
      </p>

      <div className="mt-10">
        <ComparisonTable />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-sm border border-ink/10 p-6">
          <h2 className="text-xl text-highway">A note on insurance</h2>
          <p className="mt-2 text-sm text-ink/70">
            Carrier Transport is fully insured through the carrier hauling your
            vehicle. With Personal Driver, there&apos;s no hauler-side insurance
            policy to speak of &mdash; instead, your vehicle simply accumulates
            the miles a driver puts on it getting from A to B.
          </p>
        </div>
        <div className="rounded-sm border border-ink/10 p-6">
          <h2 className="text-xl text-rust">A note on mileage</h2>
          <p className="mt-2 text-sm text-ink/70">
            We want this upfront, not discovered later: Personal Driver means a
            person is physically driving your car to its destination, so it
            will accumulate mileage in transit. Carrier Transport avoids this
            entirely since your car rides on a hauler.
          </p>
        </div>
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/quote"
          className="rounded-sm bg-brass px-8 py-3 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark"
        >
          Get a Quote for Either Option
        </Link>
      </div>
    </div>
  );
}
