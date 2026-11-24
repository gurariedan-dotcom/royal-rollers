import Link from "next/link";
import { notFound } from "next/navigation";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import { ContactSection } from "@/components/Sections";
import { ROUTES, SITE_URL, type FaqItem } from "@/lib/content";
import { DEPOSIT_DISPLAY } from "@/lib/deposit";
import { roadMiles } from "@/lib/distance";
import { computeEstimate } from "@/lib/pricing";

// One landing page per real lane in ROUTES (lib/content.ts), so searches
// like "new york to florida car shipping" have a page that answers them.
export const dynamicParams = false;

export function generateStaticParams() {
  return ROUTES.map((r) => ({ slug: r.slug }));
}

const dollars = (cents: number) => `$${(cents / 100).toLocaleString("en-US")}`;

function getRoute(slug: string) {
  const route = ROUTES.find((r) => r.slug === slug);
  if (!route) notFound();
  // Same distance + pricing path as the homepage calculator for these ZIPs.
  const miles = roadMiles(route.fromCity, route.toCity);
  const carrier = computeEstimate({ miles, serviceType: "carrier", isRunning: "running", vehicleType: "sedan" });
  const driver = computeEstimate({ miles, serviceType: "personal_driver", isRunning: "running", vehicleType: "sedan" });
  return { route, miles: Math.round(miles), carrier, driver };
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { route, miles, carrier } = getRoute(params.slug);
  return {
    title: `${route.from} to ${route.to} Car Shipping`,
    description: `Ship your car from ${route.from} to ${route.to} (about ${miles.toLocaleString("en-US")} miles). Insured carrier or personal driver, instant estimates from ${dollars(carrier.lowCents)}. Get a priced quote by email.`,
    alternates: { canonical: `/routes/${route.slug}` },
  };
}

export default function RoutePage({ params }: { params: { slug: string } }) {
  const { route, miles: rawMiles, carrier, driver } = getRoute(params.slug);
  const lane = `${route.from} to ${route.to}`;
  const miles = rawMiles.toLocaleString("en-US");

  const faqs: FaqItem[] = [
    {
      q: `How much does it cost to ship a car from ${lane}?`,
      a: `For a running sedan on open carrier transport, our instant estimate for ${route.fromCity.name} to ${route.toCity.name} (about ${miles} miles) is ${dollars(carrier.lowCents)} to ${dollars(carrier.highCents)}. A personal driver is about ${dollars(driver.lowCents)} to ${dollars(driver.highCents)}. Your exact ZIPs, vehicle, and dates set the final price, which we email you before you pay anything.`,
    },
    {
      q: `Should I use a carrier or a personal driver from ${lane}?`,
      a: "A carrier adds no miles to your car and suits long trips, high-value cars, and enclosed transport. A personal driver takes your car directly, point to point, with more precise pickup and dropoff timing, but adds mileage.",
    },
    {
      q: "Do I pay anything before I get a quote?",
      a: `No. The quote is free. If you book, you pay a ${DEPOSIT_DISPLAY} deposit and the balance is charged to your saved card when the car is delivered.`,
    },
    {
      q: "Can you do a round trip?",
      a: "Yes. If the car needs to come back later, pick round trip on the quote form and we price both legs together.",
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: `${lane} car shipping`,
              serviceType: "Vehicle transport",
              provider: { "@id": `${SITE_URL}/#business` },
              areaServed: [route.from, route.to],
              url: `${SITE_URL}/routes/${route.slug}`,
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <p className="kicker">Route</p>
          <h1 className="mt-4 text-4xl md:text-5xl">{lane} car shipping</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate">
            Royal Rollers ships cars from {route.from} to {route.to} by insured carrier or by a personal driver.
            Send your vehicle and route once and get a real, priced quote back by email.
          </p>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-card p-5">
              <dt className="text-sm text-slate">Distance ({route.fromCity.name} to {route.toCity.name})</dt>
              <dd className="mt-1 font-mono text-2xl">~{miles} mi</dd>
            </div>
            <div className="rounded-2xl border border-line bg-card p-5">
              <dt className="text-sm text-slate">Carrier estimate</dt>
              <dd className="mt-1 font-mono text-2xl">
                {dollars(carrier.lowCents)}–{dollars(carrier.highCents)}
              </dd>
            </div>
            <div className="rounded-2xl border border-line bg-card p-5">
              <dt className="text-sm text-slate">Personal driver estimate</dt>
              <dd className="mt-1 font-mono text-2xl">
                {dollars(driver.lowCents)}–{dollars(driver.highCents)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-slate">
            Non-binding estimate for a running sedan, open transport. Your emailed quote is the real price.
          </p>

          <Link href="/quote" className="btn-amber mt-8 px-8 py-3.5 text-lg">
            Get your {lane} quote
          </Link>

          <h2 className="mt-16 text-3xl md:text-4xl">{lane}: common questions</h2>
          <div className="mt-8">
            <FaqAccordion items={faqs} defaultOpenIndex={0} />
          </div>

          <p className="mt-10 text-slate">
            Other routes:{" "}
            {ROUTES.filter((r) => r.slug !== route.slug).map((r, i) => (
              <span key={r.slug}>
                {i > 0 && " · "}
                <Link href={`/routes/${r.slug}`} className="underline underline-offset-4 hover:text-amber-ink">
                  {r.from} to {r.to}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
