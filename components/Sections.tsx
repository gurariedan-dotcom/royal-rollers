// Homepage sections, each also used as the body of its standalone page
// (/services, /how-it-works, /reviews, /faq, /contact). Copy lives in
// lib/content.ts.
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { COMPARISON, CONTACT, FAQS, STEPS } from "@/lib/content";
import { DEPOSIT_DISPLAY } from "@/lib/deposit";
import { countReviews, getReviews } from "@/lib/reviews";

type HeadingLevel = "h1" | "h2";

function SectionHeading({ kicker, title, as: H = "h2" }: { kicker: string; title: string; as?: HeadingLevel }) {
  return (
    <>
      <p className="kicker">{kicker}</p>
      <H className="mt-4 text-4xl md:text-5xl">{title}</H>
    </>
  );
}

// `detailed` adds the original /services page copy (intro, insurance and
// mileage notes, CTA); the homepage shows the compact version.
export function ServicesSection({ as, detailed = false }: { as?: HeadingLevel; detailed?: boolean }) {
  return (
    <section id="services" className="scroll-mt-24 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <SectionHeading kicker="Pick what fits your timeline" title="Carrier or personal driver" as={as} />
        {detailed && (
          <p className="mt-6 max-w-2xl text-lg text-slate">
            Both options get your car wherever it&apos;s headed, anywhere in the country. The
            difference is how it gets there, and that difference matters for cost, timing, and what
            happens to your odometer along the way.
          </p>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="on-navy rounded-2xl bg-navy-2 p-8 text-ink md:p-10">
            <h3 className="text-2xl md:text-3xl">Carrier Transport</h3>
            <p className="mt-4 max-w-md text-lg text-navy-muted">
              Your vehicle rides on an insured, licensed carrier&apos;s hauler. No mileage added. No
              hidden fees.
            </p>
            <p className="mt-5 text-lg font-bold text-amber">Typically 1-4 days</p>
            <Link href="/quote?service=carrier" className="btn-amber mt-6">
              Quote me
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
              Quote me
            </Link>
          </div>
        </div>

        {/* Side-by-side chart. md+: label | carrier | driver columns.
            Below md the label column is hidden and each label becomes a
            full-width row above its two values, so it fits a phone. */}
        <div className="card mt-10 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">Carrier Transport compared with Personal Driver</caption>
            <thead>
              <tr className="bg-paper-dim/60">
                <td className="hidden md:table-cell md:w-[24%]" />
                <th scope="col" className="px-4 py-4 text-sm font-bold text-ink sm:px-6 sm:text-base">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-navy align-middle" aria-hidden="true" />
                  Carrier Transport
                </th>
                <th scope="col" className="border-l border-line px-4 py-4 text-sm font-bold text-ink sm:px-6 sm:text-base">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-amber align-middle" aria-hidden="true" />
                  Personal Driver
                </th>
              </tr>
            </thead>
            {COMPARISON.map((row) => (
              <tbody key={row.label} className="border-t border-line">
                <tr className="md:hidden">
                  <th scope="colgroup" colSpan={2} className="manifest-label px-4 pb-1 pt-4 sm:px-6">
                    {row.label}
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="manifest-label hidden px-6 py-5 align-top md:table-cell">
                    {row.label}
                  </th>
                  <td className="px-4 pb-4 align-top text-sm text-ink sm:px-6 sm:text-base md:py-5">
                    {row.carrier}
                  </td>
                  <td className="border-l border-line px-4 pb-4 align-top text-sm text-ink sm:px-6 sm:text-base md:py-5">
                    {row.driver}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>

        <p className="mt-6 max-w-[75ch] text-slate">
          Personal Driver asks that your car carry full coverage (comprehensive and collision) during
          the drive. Enclosed transport is available on Carrier Transport.
        </p>

        {detailed && (
          <>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="card p-7 md:p-8">
                <h3 className="text-2xl">A note on insurance</h3>
                <p className="mt-4 text-slate">
                  <strong className="text-ink">Carrier Transport:</strong> Your vehicle is covered by
                  our carrier&apos;s cargo insurance for the full duration of transport &mdash;
                  protecting against collision and damage from pickup to delivery.
                </p>
                <p className="mt-3 text-slate">
                  <strong className="text-ink">Personal Driver:</strong> We want your car protected
                  every mile of the way. That&apos;s why we ask that your vehicle carry full coverage
                  insurance (comprehensive and collision) during the drive &mdash; the standard
                  protection most vehicles already have. Don&apos;t worry, this is common and easy to
                  confirm with your insurance provider if you&apos;re not sure.
                </p>
              </div>
              <div className="card p-7 md:p-8">
                <h3 className="text-2xl">A note on mileage</h3>
                <p className="mt-4 text-slate">
                  Only Personal Driver adds mileage &mdash; a person is physically driving your car to
                  its destination, so it accumulates miles in transit. Carrier Transport avoids this
                  entirely since your car rides on a hauler.
                </p>
              </div>
            </div>

            <Link href="/quote" className="btn-amber mt-10 px-8 py-3.5 text-lg">
              Get a quote for either option
            </Link>
          </>
        )}
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

        <p className="mt-6 max-w-[75ch] text-slate">
          The automatic balance charge is only made after you&apos;ve explicitly agreed to it at
          booking. We&apos;ll never charge a saved card without that acknowledgment on file.
        </p>
      </div>
    </section>
  );
}

// Owner-entered past-customer reviews (/admin/reviews). `limit` is the
// homepage's newest-three teaser; /reviews shows them all. Falls back to the
// "on the way" note while there are none.
export async function ReviewsSection({ as, limit }: { as?: HeadingLevel; limit?: number }) {
  const [reviews, total] = await Promise.all([getReviews(limit), limit ? countReviews() : Promise.resolve(0)]);

  if (reviews.length > 0) {
    return (
      <section id="reviews" className="scroll-mt-24 bg-paper-dim">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <SectionHeading kicker="Reviews" title="What our customers say" as={as} />
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <li key={r.id} className="card flex flex-col p-6 md:p-7">
                {r.rating && (
                  <p className="text-xl tracking-widest text-amber-dark" aria-label={`${r.rating} out of 5 stars`}>
                    {"★".repeat(r.rating)}
                    <span className="text-line">{"★".repeat(5 - r.rating)}</span>
                  </p>
                )}
                <blockquote className={`${r.rating ? "mt-3" : ""} flex-1 whitespace-pre-line text-lg text-ink`}>
                  &ldquo;{r.body}&rdquo;
                </blockquote>
                <p className="mt-5 font-bold text-ink">{r.customer_name}</p>
                {r.route && <p className="text-sm text-slate">{r.route}</p>}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            {limit && total > reviews.length && (
              <Link href="/reviews" className="btn-outline">
                See all {total} reviews
              </Link>
            )}
            <Link href="/quote" className="btn-amber">
              Get a quote
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="scroll-mt-24 bg-paper-dim">
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <SectionHeading kicker="Reviews" title="Real reviews are on the way" as={as} />
        <p className="mt-6 max-w-2xl text-lg text-slate">
          We&apos;re collecting feedback from recent moves and will start posting real customer
          reviews here. In the meantime, feel free to ask us directly for references from a past
          route like yours.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/contact" className="btn-outline">
            Ask for references
          </Link>
          <Link href="/quote" className="btn-amber">
            Get a quote
          </Link>
        </div>
      </div>
    </section>
  );
}

// Closing line from the original homepage -- the one PRODUCT.md says a
// visitor should remember.
export function QuoteCtaSection() {
  return (
    <section className="bg-paper-dim">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
        <h2 className="text-4xl md:text-5xl">A priced quote sent straight to your inbox</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate">
          Submit your vehicle and route details once. You&apos;ll get a real number back by email.
        </p>
        <Link href="/quote" className="btn-amber mt-8 px-8 py-3.5 text-lg">
          Get a quote
        </Link>
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

export function ContactSection({ as: H = "h2", fill = false }: { as?: HeadingLevel; fill?: boolean }) {
  return (
    <section
      id="contact"
      className={`on-navy scroll-mt-24 bg-navy ${fill ? "flex min-h-[calc(100vh-14rem)] items-center" : ""}`}
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-20 md:py-24">
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
