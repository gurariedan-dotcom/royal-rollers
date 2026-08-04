import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import { ShieldCheck, Gauge } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Services",
  description: "Compare Carrier Transport and Personal Driver vehicle shipping side by side: insurance, mileage, fees, and typical turnaround.",
};

export default function ServicesPage() {
  return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="manifest-label">Services</p>
        <h1 className="mt-2 text-3xl">Carrier Transport vs. Personal Driver</h1>
        <p className="mt-4 max-w-2xl text-ink/70">
          Both options get your car wherever it&apos;s headed, anywhere in the country.
          The difference is how it gets there, and that difference matters
          for cost, timing, and what happens to your odometer along the way.
        </p>

        <div className="mt-10">
          <ComparisonTable />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-sm bg-highway/5 p-6">
            <ShieldCheck size={24} weight="duotone" className="text-highway" />
            <h2 className="mt-3 text-xl text-highway">A note on insurance</h2>
            <p className="mt-2 text-sm text-ink/70">
              <strong className="text-ink">Carrier Transport:</strong> Your
              vehicle is covered by our carrier&apos;s cargo insurance for the
              full duration of transport &mdash; protecting against collision
              and damage from pickup to delivery.
            </p>
            <p className="mt-3 text-sm text-ink/70">
              <strong className="text-ink">Personal Driver:</strong> We want
              your car protected every mile of the way. That&apos;s why we ask
              that your vehicle carry full coverage insurance (comprehensive
              and collision) during the drive &mdash; the standard protection
              most vehicles already have. Don&apos;t worry, this is common and
              easy to confirm with your insurance provider if you&apos;re not
              sure.
            </p>
          </div>
          <div className="rounded-sm bg-rust/5 p-6">
            <Gauge size={24} weight="duotone" className="text-rust" />
            <h2 className="mt-3 text-xl text-rust">A note on mileage</h2>
            <p className="mt-2 text-sm text-ink/70">
              Only Personal Driver adds mileage &mdash; a person is physically
              driving your car to its destination, so it accumulates miles in
              transit. Carrier Transport avoids this entirely since your car
              rides on a hauler.
            </p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/quote"
            className="rounded-sm border border-brass px-8 py-3 font-display text-sm uppercase tracking-wideish text-brass transition-all hover:bg-brass hover:text-paper hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
          >
            Get a Quote for Either Option
          </Link>
        </div>
      </div>
  );
}
