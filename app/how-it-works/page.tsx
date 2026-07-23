import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "How It Works",
  description: "The five steps from requesting a quote to your vehicle arriving, including how and when payment happens.",
};

const STEPS = [
  {
    title: "Request a quote",
    body: "Tell us your vehicle's VIN, year/make/model, pickup and dropoff ZIPs, and preferred date. Takes a few minutes.",
  },
  {
    title: "Get a priced quote by email",
    body: "We email you a real number, not a callback promise, based on your route and vehicle.",
  },
  {
    title: "Book with a deposit",
    body: "Ready to move forward? Pay a deposit and securely save a card on file. You'll confirm you understand the balance is charged automatically on delivery.",
  },
  {
    title: "We arrange the move",
    body: "Carrier Transport: your load is posted to a licensed, insured carrier via Central Dispatch. Personal Driver: a driver is scheduled to take your car directly.",
  },
  {
    title: "Balance charged on delivery",
    body: "Once your vehicle arrives, the remaining balance is charged automatically to the card on file. No extra step for you.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label">How it works</p>
      <h1 className="mt-2 text-3xl">From quote to delivery</h1>

      <ol className="mt-10">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} as="li" delay={i * 0.06} className="flex gap-5 pb-8 last:pb-0">
            <span className="relative flex shrink-0 flex-col items-center">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-paper font-mono text-sm text-brass">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mt-1 w-px flex-1"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, #2955D1 0, #2955D1 4px, transparent 4px, transparent 9px)",
                  }}
                />
              )}
            </span>
            <div className="pt-1">
              <h2 className="text-lg font-semibold normal-case tracking-normal text-ink">
                {step.title}
              </h2>
              <p className="mt-1 text-sm text-ink/70">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      <div className="route-rule mt-4 opacity-30" />

      <p className="mt-8 text-sm text-ink/60">
        The automatic balance charge is only made after you&apos;ve explicitly
        agreed to it at booking. We&apos;ll never charge a saved card
        without that acknowledgment on file.
      </p>

      <div className="mt-10">
        <Link
          href="/quote"
          className="rounded-sm border border-brass px-8 py-3 font-display text-sm uppercase tracking-wideish text-brass transition-all hover:bg-brass hover:text-paper hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        >
          Start Your Quote
        </Link>
      </div>
    </div>
  );
}
