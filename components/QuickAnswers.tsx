import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";

// A short, homepage-scoped subset of app/faq/page.tsx's full list --
// enough to answer the questions most likely to stall a visitor before
// they click through, without duplicating the whole FAQ page here.
const QUICK_ANSWERS = [
  {
    q: "Do I have to pay anything upfront?",
    a: "No. You submit your route and vehicle details, and we email you a real, priced quote first. Payment only happens if and when you decide to book.",
  },
  {
    q: "Is my vehicle insured during transport?",
    a: "Yes. Carrier Transport is covered by our carrier's cargo insurance the whole way. Personal Driver relies on your own full coverage insurance (comprehensive and collision) being active during the drive -- standard protection most vehicles already have.",
  },
  {
    q: "How much will it cost?",
    a: "Your instant estimated price appears as you fill in your details. Once reviewed, a member of our team will contact you with your finalized, official quote, free of charge.",
  },
  {
    q: "Can you ship a non-running vehicle?",
    a: "Yes. Just mark it as not running when you request your quote, so the right equipment and carrier get assigned.",
  },
];

export default function QuickAnswers() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label text-center">Questions</p>
      <h2 className="mt-2 text-center text-3xl">Quick answers</h2>

      <div className="mt-10">
        <FaqAccordion items={QUICK_ANSWERS} defaultOpenIndex={null} />
      </div>

      <p className="mt-8 text-center text-sm text-ink/60">
        <Link href="/faq" className="underline hover:text-brass">
          See all frequently asked questions
        </Link>
      </p>
    </section>
  );
}
