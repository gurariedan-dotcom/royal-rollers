export const metadata = {
  title: "Terms of Service",
  description: "The terms that govern requesting a quote, booking, and using royal-rollers.com.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label">Legal</p>
      <h1 className="mt-2 text-3xl">Terms of Service</h1>
      <p className="mt-4 text-sm text-ink/60">Last updated August 10, 2026</p>

      <div className="mt-10 space-y-10 text-ink/75">
        <section>
          <p>
            These terms govern your use of royal-rollers.com and any quote,
            booking, or transport arranged through it. By requesting a quote
            or booking, you agree to them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Who we are</h2>
          <p className="mt-3">
            Royal Rollers LLC (&quot;Royal Rollers,&quot; &quot;we,&quot;
            &quot;us&quot;) is a licensed vehicle transport broker. We
            arrange transport of your vehicle by a third-party carrier
            (Carrier Transport) or a personal driver (Personal Driver) &mdash;
            we do not own the trucks or drive the vehicles ourselves.
            USDOT# 6895738 &middot; MC# 73292138.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Quotes</h2>
          <p className="mt-3">
            Instant estimates shown on the site are non-binding. Your actual
            price is the number we email you after review, and it stays
            valid for a limited time before route or scheduling conditions
            may require a new one. A quote is not a booking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Booking, deposit, and balance</h2>
          <p className="mt-3">
            Booking requires a deposit, charged at the time you book, and a
            card saved on file. The remaining balance is charged
            automatically to that card once your vehicle is delivered. You
            must explicitly acknowledge and agree to this automatic charge
            before a booking is created &mdash; we record that acknowledgment,
            along with the time and IP address it was given.
          </p>
          <p className="mt-3">
            Cancellations are refundable except for the deposit, which is
            non-refundable. See our{" "}
            <a href="/faq" className="underline hover:text-brass">FAQ</a>{" "}
            for current cancellation and rescheduling details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Your responsibilities</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Provide accurate vehicle, route, and contact information &mdash; pricing and carrier assignment depend on it.</li>
            <li>Have the vehicle accessible and ready at the agreed pickup window, with valid registration and, if applicable, auction/dealer release paperwork.</li>
            <li>Be present, or have a designated person present, at both pickup and delivery for a condition inspection and handoff.</li>
            <li>For Personal Driver service, keep your own comprehensive and collision insurance active for the duration of transport.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Insurance and liability</h2>
          <p className="mt-3">
            Carrier Transport is covered by the assigned carrier&apos;s cargo
            insurance for the duration of the move. Personal Driver relies on
            your own vehicle insurance remaining active and in force.
            Personal items left in the vehicle are not covered by transport
            insurance and travel at your own risk. Royal Rollers, as broker,
            is not itself the insurer of your vehicle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Site use</h2>
          <p className="mt-3">
            Don&apos;t use the site to submit false information, interfere
            with its operation, or attempt to access accounts, quotes, or
            bookings that aren&apos;t yours.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Disclaimers and limitation of liability</h2>
          <p className="mt-3">
            The site and its instant estimates are provided &quot;as
            is,&quot; without warranty of any kind. To the extent permitted
            by law, Royal Rollers&apos; liability for any claim arising from
            your use of the site or a booked move is limited to the amount
            you paid us for that move. We are not liable for indirect,
            incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Changes to these terms</h2>
          <p className="mt-3">
            We may update these terms from time to time. If we do,
            we&apos;ll update the date above. Continued use of the site or
            our services after a change means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Governing law</h2>
          <p className="mt-3">
            These terms are governed by the laws of the State of New York,
            without regard to conflict-of-law principles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Contact us</h2>
          <p className="mt-3">
            Questions about these terms? Email{" "}
            <a href="mailto:support@royal-rollers.com" className="underline hover:text-brass">
              support@royal-rollers.com
            </a>{" "}
            or call{" "}
            <a href="tel:+16465892334" className="underline hover:text-brass">
              (646) 589-2334
            </a>
            .
          </p>
          <p className="mt-3 text-sm text-ink/60">
            Royal Rollers LLC &middot; 393 Beach 12th Street, Far Rockaway, NY
            11691 &middot; USDOT# 6895738 &middot; MC# 73292138
          </p>
        </section>
      </div>
    </div>
  );
}
