export const metadata = {
  title: "Privacy Policy",
  description: "How Royal Rollers collects, uses, and protects the information you share when requesting a quote or booking transport.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label">Legal</p>
      <h1 className="mt-2 text-3xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-ink/60">Last updated August 3, 2026</p>

      <div className="mt-10 space-y-10 text-ink/75">
        <section>
          <p>
            Royal Rollers LLC (&quot;Royal Rollers,&quot; &quot;we,&quot;
            &quot;us&quot;) arranges nationwide vehicle transport by carrier
            or personal driver. This policy explains what information we
            collect through royal-rollers.com, why we collect it, and who we
            share it with.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Information we collect</h2>
          <p className="mt-3">When you request a quote or book transport, we collect:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Contact details: your name, phone number, and email address.</li>
            <li>
              Vehicle details: VIN (or manually entered year, make, and
              model), vehicle type, and running condition.
            </li>
            <li>
              Move details: pickup and dropoff ZIP codes, preferred pickup
              date, date flexibility, transport type, and whether the move
              is round trip.
            </li>
            <li>
              Payment information at booking, collected and stored directly
              by our payment processor, Stripe. We never see or store your
              full card number.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">How we use it</h2>
          <p className="mt-3">We use this information to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Price and email you a quote.</li>
            <li>
              Post your load, using your vehicle and route details, to the
              industry load board carriers use, if you book Carrier
              Transport.
            </li>
            <li>Coordinate pickup and delivery, and contact you about your booking.</li>
            <li>
              Charge your deposit at booking and your remaining balance,
              automatically, once your vehicle is delivered.
            </li>
          </ul>
          <p className="mt-3">We do not sell your information, and we do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Who we share it with</h2>
          <p className="mt-3">We share information only as needed to complete your move:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>The carrier or driver assigned to your vehicle.</li>
            <li>Stripe, to process your deposit and balance payment.</li>
            <li>Resend, to send you quote and booking emails.</li>
            <li>Supabase, our database provider, to store your quote and booking records.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Data retention</h2>
          <p className="mt-3">
            We keep quote and booking records for as long as needed to
            complete your move, satisfy our USDOT/MC recordkeeping
            obligations, and resolve any disputes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Your choices</h2>
          <p className="mt-3">
            To access, correct, or request deletion of your information,
            contact us using the details below.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Children&apos;s privacy</h2>
          <p className="mt-3">
            Our services are intended for adults arranging vehicle transport
            and are not directed at children under 13.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Changes to this policy</h2>
          <p className="mt-3">
            If we change this policy, we&apos;ll update the date above.
            Continued use of our services after a change means you accept
            the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Contact us</h2>
          <p className="mt-3">
            Questions about this policy? Email{" "}
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
