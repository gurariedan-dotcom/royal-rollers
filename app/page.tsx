import Link from "next/link";
import TruckIllustration from "@/components/TruckIllustration";
import {
  ContactSection,
  FaqSection,
  QuoteCtaSection,
  HowItWorksSection,
  ReviewsSection,
  ServicesSection,
} from "@/components/Sections";

// "Live tracking" is deliberately absent -- no tracking feature exists.
const TRUST_POINTS = ["Insured carriers", "No hidden fees", "Quote by email, no phone tag"];

export default function HomePage() {
  return (
    <>
      <section className="on-navy hero-bg text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="kicker leading-relaxed">
              Vehicle transport broker
              <span aria-hidden="true"> · </span>
              <span className="whitespace-nowrap">USDOT 6895738</span>
              <span aria-hidden="true"> · </span>
              <span className="whitespace-nowrap">MC 73292138</span>
            </p>
            <h1 className="mt-5 text-[clamp(3rem,7.5vw,6rem)] leading-[1.02]">
              Your car, moved anywhere.{" "}
              <span className="text-amber">Your call how.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-navy-muted md:text-xl">
              Royal Rollers arranges car shipping across the United States, on an insured multi-car
              hauler or with a personal driver who takes your car directly.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/quote" className="btn-amber px-8 py-3.5 text-lg">
                Get a quote
              </Link>
              <Link href="/#services" className="btn-outline px-8 py-3.5 text-lg">
                Compare options
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-3">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="rounded-full border border-navy-line px-5 py-2 text-navy-muted"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <TruckIllustration />
        </div>
      </section>

      <ServicesSection />
      <HowItWorksSection />
      <ReviewsSection />
      <FaqSection limit={5} />
      <QuoteCtaSection />
      <ContactSection />
    </>
  );
}
