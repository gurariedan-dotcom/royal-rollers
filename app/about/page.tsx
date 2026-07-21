export const metadata = {
  title: "About | Royal Rollers",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label">About</p>
      <h1 className="mt-2 text-3xl">Built on the Tri-State &rarr; Florida run</h1>
      <div className="mt-6 space-y-4 text-ink/75">
        <p>
          Royal Rollers grew out of referrals, not ad spend &mdash; and out of
          real time spent on the road. Before arranging carrier transport, the
          run between the Tri-State area and Florida was driven personally,
          which is exactly why Personal Driver is offered today as a real
          option, not an afterthought.
        </p>
        <p>
          That corridor sees some of the heaviest seasonal vehicle-transport
          demand in the country, as snowbirds move cars between northern and
          Florida homes each year. Royal Rollers specializes in exactly this
          route, rather than trying to be a nationwide generalist.
        </p>
        <p>
          Every quote is priced by a person who knows this specific run, not a
          generic algorithm covering all fifty states.
        </p>
      </div>
    </div>
  );
}
