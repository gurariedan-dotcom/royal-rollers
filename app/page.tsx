import Image from "next/image";
import { Coins, EnvelopeSimple, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import HeroQuoteCard from "@/components/HeroQuoteCard";
import {
  ContactSection,
  FaqSection,
  QuoteCtaSection,
  HowItWorksSection,
  ReviewsSection,
  ServicesSection,
} from "@/components/Sections";

// "Live tracking" is deliberately absent -- no tracking feature exists.
const TRUST_POINTS = [
  { Icon: ShieldCheck, label: "Insured carriers" },
  { Icon: Coins, label: "No hidden fees" },
  { Icon: EnvelopeSimple, label: "Quote by email" },
];

export const metadata = { alternates: { canonical: "/" } };

// Reviews section reads from the DB; refreshed by /admin/reviews changes.
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      {/* Hero, per the owner's 2026-11 photo mockup: highway photo on the
          right, quote card on the left, trust strip along the bottom. */}
      <section className="on-navy relative overflow-hidden bg-navy text-ink">
        {/* ponytail: photo cropped from the owner's mockup (734px wide); swap in the original high-res shot when available. */}
        {/* Below lg: the photo sits behind the card as a faded background. */}
        <div className="absolute inset-0 lg:hidden">
          <Image src="/hero-truck.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-10 md:pt-14">
          <p className="kicker leading-relaxed">
            Vehicle transport broker
            <span aria-hidden="true"> · </span>
            <span className="whitespace-nowrap">USDOT 6895738</span>
            <span aria-hidden="true"> · </span>
            <span className="whitespace-nowrap">MC 73292138</span>
          </p>

          <div className="mt-6 pb-12 md:pb-16 lg:grid lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-center lg:gap-10">
            <div className="max-w-xl">
              <HeroQuoteCard />
            </div>
            {/* lg+: framed at the photo's own aspect ratio so the whole truck shows, uncropped. */}
            <div className="relative hidden aspect-[734/690] overflow-hidden rounded-3xl border border-navy-line shadow-panel-lg lg:block">
              <Image
                src="/hero-truck.jpg"
                alt="Car carrier truck hauling vehicles on a highway at dusk"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 0px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <ul className="relative mx-auto grid max-w-6xl gap-5 border-t border-navy-line px-6 py-8 sm:grid-cols-3">
          {TRUST_POINTS.map(({ Icon, label }, i) => (
            <li
              key={label}
              className={`flex items-center gap-3 text-lg text-ink ${i > 0 ? "sm:border-l sm:border-navy-line sm:pl-6" : ""}`}
            >
              <Icon size={32} weight="duotone" className="shrink-0 text-amber" />
              {label}
            </li>
          ))}
        </ul>
      </section>

      <ServicesSection />
      <HowItWorksSection />
      <ReviewsSection limit={3} />
      <FaqSection limit={5} />
      <QuoteCtaSection />
      <ContactSection />
    </>
  );
}
