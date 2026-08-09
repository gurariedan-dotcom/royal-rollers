import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "FAQ",
  description: "Answers to common questions about carrier transport, personal driver service, VINs, payment, and enclosed transport.",
};

const FAQS = [
  {
    q: "What's the difference between Carrier Transport and Personal Driver?",
    a: "Carrier Transport means your vehicle rides on an insured, licensed carrier's hauler, no mileage added, typically 1-4 days. Personal Driver means a driver takes your car directly, point to point, typically 24-30 hours, more precise timing, but mileage is added to the vehicle.",
  },
  {
    q: "Why do you need my VIN?",
    a: "It's not just for the quote -- the VIN is required information to actually ship your car, since it's what identifies your exact vehicle to the carrier on the industry load board. We collect it upfront so it's already on file, and nothing has to be re-collected later by phone.",
  },
  {
    q: "How will I get my quote?",
    a: "We'll email you a priced quote directly. No phone tag, no callback promise.",
  },
  {
    q: "How does payment work?",
    a: "You pay a deposit and securely save a card on file when you book. The remaining balance is charged automatically to that card once your vehicle is delivered, you won't need to do anything at drop-off. You'll explicitly confirm you understand and agree to this at booking.",
  },
  {
    q: "Is enclosed transport available?",
    a: "Yes, for Carrier Transport. Let us know when requesting your quote and we'll price it accordingly. Enclosed transport isn't applicable to Personal Driver, since there's no hauler involved.",
  },
  {
    q: "Does Personal Driver really add mileage to my car?",
    a: "Yes, since a person is driving your car to its destination rather than hauling it, mileage is added in transit. We'd rather you know that going in than be surprised by it.",
  },
  {
    q: "Do you service my area, or is there a service area limit?",
    a: "No. Royal Rollers arranges transport anywhere in the country, so wherever your car is coming from and wherever it's headed, we can quote the route.",
  },
  {
    q: "Can I ship a car I just bought at auction or from a dealer?",
    a: "Yes. Just have your auction or dealer paperwork on hand (bill of sale, release authorization) and let us know the pickup location when you request your quote, so we can coordinate directly with the seller.",
  },
  {
    q: "What happens if my car is damaged during transport?",
    a: "For Carrier Transport, your vehicle is covered by the carrier's cargo insurance the entire trip. For Personal Driver, coverage relies on your own active insurance (comprehensive and collision) being in place -- standard protection most vehicles already have. Either way, we'll walk you through next steps if anything ever comes up.",
  },
  {
    q: "Do I need to be present at pickup and delivery?",
    a: "You, or someone you designate, needs to be there for both pickup and delivery to hand off keys and do a quick inspection with the driver.",
  },
  {
    q: "Can I ship personal items inside the vehicle?",
    a: "A small amount of personal items in the trunk is generally fine, but they aren't covered by transport insurance and travel at your own risk -- so keep it light and skip anything valuable or fragile.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking 1-2 weeks ahead of your preferred pickup window to help guarantee availability.",
  },
  {
    q: "What if my vehicle isn't ready on the scheduled pickup day?",
    a: "Just let us know as soon as possible and we'll get you rescheduled. A small rescheduling fee applies to cover the adjustment.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Cancellations are fully refundable, with the exception of your $350 deposit, which is non-refundable.",
  },
  {
    q: "Do you ship internationally or only within the U.S.?",
    a: "We service both the United States and Canada.",
  },
  {
    q: "How do I track my vehicle during transport?",
    a: "Once your vehicle is booked, you'll receive a live tracking link by email so you can follow its progress from pickup to delivery.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label">FAQ</p>
      <h1 className="mt-2 text-3xl">Common questions</h1>

      <div className="mt-10">
        <FaqAccordion items={FAQS} />
      </div>
    </div>
  );
}
