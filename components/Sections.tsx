// Homepage sections, each also used as the body of its standalone page
// (/services, /how-it-works, /reviews, /faq, /contact). Copy lives in
// lib/content.ts.
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { COMPARISON, CONTACT, FAQS, STEPS } from "@/lib/content";
import { DEPOSIT_DISPLAY } from "@/lib/deposit";

type HeadingLevel = "h1" | "h2";

function SectionHeading({ kicker, title, as: H = "h2" }: { kicker: string; title: string; as?: HeadingLevel }) {
  return (
    <>
      <p className="kicker">{kicker}</p>
      <H className="mt-4 text-4xl md:text-5xl">{title}</H>
    </>
  );
}

export function ServicesSection({ as }: { as?: HeadingLevel }) {
  return (
    <section id="services" className="scroll-mt-24 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <SectionHeading kicker="Pick what fits your timeline" title="Carrier or personal driver" as={as} />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="on-navy rounded-2xl bg-navy-2 p-8 text-paper md:p-10">
            <h3 className="text-2xl md:text-3xl">Carrier Transport</h3>
            <p className="mt-4 max-w-md text-lg text-navy-muted">
              Your vehicle rides on an insured, licensed carrier&apos;s hauler. No mileage added. No
              hidden fees.
            </p>
            <p className="mt-5 text-lg font-bold text-amber">Typically 1-4 days</p>
            <Link href="/quote?service=carrier" className="btn-amber mt-6">
              Quote this
            </Link>
          </div>
          <div className="card p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl">Personal Driver</h3>
            <p className="mt-4 max-w-md text-lg text-slate">
              A driver takes your car directly, point to point. More precise timing. Adds mileage to
              the vehicle.
            </p>
            <p className="mt-5 text-lg font-bold text-amber-ink">Typically 24-30 hours</p>
            <Link href="/quote?service=personal_driver" className="btn-outline mt-6">
              Quote this
            </Link>
          </div>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPARISON.map((row) => (
            <div key={row.label} className="card p-6">
              <dt className="manifest-label">{row.label}</dt>
              <dd className="mt-4 space-y-3 text-ink">
                <p>
                  <span className="kicker mr-2 tracking-wideish">Carrier</span>
                  {row.carrier}
                </p>
                <p>
                  <span className="kicker mr-2 tracking-wideish">Driver</span>
                  {row.driver}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 max-w-[75ch] text-slate">
          Personal Driver asks that your car carry full coverage (comprehensive and collision) during
          the drive. Enclosed transport is available on Carrier Transport.
        </p>
      </div>
    </section>
  );
}

export function HowItWorksSection({ as }: { as?: HeadingLevel }) {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-paper-dim">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <SectionHeading kicker="How it works" title="From quote to delivery" as={as} />

        <ol className="mt-10 space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card flex gap-5 p-6 md:p-7">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-amber"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl tracking-normal">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 text-slate">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="on-navy mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-navy p-7">
            <p className="text-3xl font-extrabold text-amber">{DEPOSIT_DISPLAY}</p>
            <p className="mt-3 text-navy-muted">
              non-refundable deposit. Other cancellations are fully refundable.
            </p>
          </div>
          <div className="rounded-2xl bg-navy p-7">
            <p className="text-3xl font-extrabold text-amber">Balance on delivery</p>
            <p className="mt-3 text-navy-muted">
              charged to your card on file only after you agree to it at booking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ as }: { as?: HeadingLevel }) {
  return (
    <section id="reviews" className="scroll-mt-24 bg-paper-dim">
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <SectionHeading kicker="Reviews" title="Real reviews are on the way" as={as} />
        <p className="mt-6 max-w-2xl text-lg text-slate">
          We are collecting feedback from recent moves. Meanwhile,{" "}
          <Link href="/contact" className="font-semibold text-ink underline underline-offset-4 hover:text-amber-ink">
            ask us for references
          </Link>{" "}
          from a past route like yours.
        </p>
      </div>
    </section>
  );
}

export function FaqSection({ as, limit }: { as?: HeadingLevel; limit?: number }) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  return (
    <section id="faq" className="scroll-mt-24 bg-paper">
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <SectionHeading kicker="FAQ" title="Common questions" as={as} />
        <div className="mt-10">
          <FaqAccordion items={items} defaultOpenIndex={0} />
        </div>
        {limit && FAQS.length > limit && (
          <p className="mt-8">
            <Link href="/faq" className="font-semibold text-ink underline underline-offset-4 hover:text-amber-ink">
              See all {FAQS.length} questions
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

export function ContactSection({ as: H = "h2" }: { as?: HeadingLevel }) {
  return (
    <section id="contact" className="on-navy scroll-mt-24 bg-navy">
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <H className="text-4xl md:text-5xl">Talk to a person</H>
        <p className="mt-5 max-w-xl text-lg text-navy-muted">
          Questions before you request a quote, or a tricky pickup to talk through?
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href={CONTACT.phoneHref} className="btn-amber">
            Call {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="btn-outline">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </section>
  );
}
