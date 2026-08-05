export const metadata = {
  title: "About",
  description: "How Royal Rollers grew from one favor before a family trip into a licensed nationwide vehicle transport brokerage.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-24">
      <div className="relative order-2 flex min-h-[320px] flex-col justify-between overflow-hidden rounded-sm bg-ink p-8 shadow-panel-lg md:order-1 md:min-h-[460px] md:p-10">
        <p className="manifest-label text-paper/50">How we work</p>
        <p className="font-display text-2xl leading-snug text-paper md:text-3xl">
          It started with a phone call before every Passover trip to
          Florida: &quot;Does anyone know someone who can drive our car
          down?&quot;
        </p>
        <p className="manifest-label text-brass-light">Coast to coast</p>
      </div>

      <div className="order-1 md:order-2">
        <p className="manifest-label">Our Story</p>
        <h1 className="mt-2 text-3xl">
          From one favor before Passover to a licensed brokerage, coast to
          coast
        </h1>

        <div className="mt-8 space-y-4 text-ink/75">
          <p>
            Royal Rollers started long before it was a business. Every year,
            ahead of our family&apos;s trip to Florida for Passover, my
            parents scrambled to find someone, usually a friend&apos;s son,
            who could drive our car down before we flew out.
          </p>
          <p>
            At 16, once I had my license, I asked a neighbor if I could
            drive his car down for a couple hundred dollars. The next year
            friends joined in, and by 18 we had a real referral network,
            earning commissions on the connections we made. At 20, I filed
            for proper licensing and opened Royal Rollers as a registered
            brokerage, connecting customers with vetted, insured carriers
            and drivers rather than operating trucks ourselves.
          </p>
          <p>
            That personal-service mindset hasn&apos;t changed. Three years
            in, I still personally manage every customer email and handle
            every issue firsthand, so when you reach out, you&apos;re
            speaking directly with me, not a rotating cast of support reps.
          </p>
          <p>
            Whether it&apos;s getting your car home in time for Pesach,
            Sukkot, Christmas, or just a random week away, making sure you
            have your vehicle when you need it is the whole point.
          </p>
        </div>
      </div>
    </div>
  );
}
