export const metadata = {
  title: "About",
  description: "How Royal Rollers arranges nationwide vehicle transport and why Personal Driver is offered as a real option, not an afterthought.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-24">
      <div className="relative order-2 flex min-h-[320px] flex-col justify-between overflow-hidden rounded-sm bg-ink p-8 shadow-panel-lg md:order-1 md:min-h-[460px] md:p-10">
        <p className="manifest-label text-paper/50">How we work</p>
        <p className="font-display text-2xl leading-snug text-paper md:text-3xl">
          Royal Rollers grew out of referrals, not ad spend, and out of real
          time spent on the road.
        </p>
        <p className="manifest-label text-brass-light">Coast to coast</p>
      </div>

      <div className="order-1 md:order-2">
        <p className="manifest-label">About</p>
        <h1 className="mt-2 text-3xl">Built to move cars anywhere in the country</h1>

        <div className="mt-8 space-y-4 text-ink/75">
          <p>
            Before arranging carrier transport, plenty of runs were driven
            personally, which is exactly why Personal Driver is offered
            today as a real option, not an afterthought.
          </p>
          <p>
            Wherever your car needs to go, we&apos;ll quote it directly,
            with a real number, not a callback promise.
          </p>
          <p>
            Every quote is priced by a person who knows the routes, not a
            generic algorithm.
          </p>
        </div>
      </div>
    </div>
  );
}
