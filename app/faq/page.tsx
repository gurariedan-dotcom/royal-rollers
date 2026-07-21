export const metadata = {
  title: "FAQ | Royal Rollers",
};

const FAQS = [
  {
    q: "What's the difference between Carrier Transport and Personal Driver?",
    a: "Carrier Transport means your vehicle rides on an insured, licensed carrier's hauler \u2014 no mileage added, typically 1\u20134 days. Personal Driver means a driver takes your car directly, point to point \u2014 typically 24\u201330 hours, more precise timing, but mileage is added to the vehicle.",
  },
  {
    q: "Why do you need my VIN just for a quote?",
    a: "We price and post loads using the same vehicle details a carrier needs on Central Dispatch, the industry load board. Collecting the VIN upfront means your quote reflects your actual vehicle and nothing has to be re-collected later by phone.",
  },
  {
    q: "How will I get my quote?",
    a: "We'll email you a priced quote directly — no phone tag, no callback promise.",
  },
  {
    q: "How does payment work?",
    a: "You pay a deposit and securely save a card on file when you book. The remaining balance is charged automatically to that card once your vehicle is delivered \u2014 you won't need to do anything at drop-off. You'll explicitly confirm you understand and agree to this at booking.",
  },
  {
    q: "Is enclosed transport available?",
    a: "Yes, for Carrier Transport. Let us know when requesting your quote and we'll price it accordingly. Enclosed transport isn't applicable to Personal Driver, since there's no hauler involved.",
  },
  {
    q: "Does Personal Driver really add mileage to my car?",
    a: "Yes \u2014 since a person is driving your car to its destination rather than hauling it, mileage is added in transit. We'd rather you know that going in than be surprised by it.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label">FAQ</p>
      <h1 className="mt-2 text-3xl">Common questions</h1>

      <dl className="mt-10 space-y-8">
        {FAQS.map((item) => (
          <div key={item.q} className="border-b border-ink/10 pb-8">
            <dt className="text-lg font-semibold text-ink">{item.q}</dt>
            <dd className="mt-2 text-sm text-ink/70">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
