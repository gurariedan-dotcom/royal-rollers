export const metadata = {
  title: "About | Royal Rollers",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label">About</p>
      <h1 className="mt-2 text-3xl">Built on the Tri-State run &mdash; now going anywhere</h1>
      <div className="mt-6 space-y-4 text-ink/75">
        <p>
          Royal Rollers grew out of referrals, not ad spend &mdash; and out of
          real time spent on the road. Before arranging carrier transport, the
          run between the Tri-State area and Florida was driven personally,
          which is exactly why Personal Driver is offered today as a real
          option, not an afterthought.
        </p>
        <p>
          That corridor still sees some of the heaviest seasonal
          vehicle-transport demand in the country, as snowbirds move cars
          between northern and Florida homes each year, and it&apos;s where
          Royal Rollers built its reputation. But that&apos;s the origin
          story, not the limit: if your car needs to leave the Tri-State
          area, we&apos;ll quote it, wherever it&apos;s headed.
        </p>
        <p>
          Every quote is priced by a person who knows Tri-State-outbound
          routes, not a generic algorithm.
        </p>
      </div>
    </div>
  );
}
