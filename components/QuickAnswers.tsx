"use client";

import Link from "next/link";
import { useState } from "react";

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
    a: "Yes, for Carrier Transport — your vehicle rides on an insured, licensed carrier's policy. Personal Driver has no hauler-side policy, since there's no hauler involved.",
  },
  {
    q: "How much will it cost?",
    a: "Your instant estimated price appears as you fill in your details. Once reviewed, a member of our team will contact you with your finalized, official quote — free of charge.",
  },
  {
    q: "Can you ship a non-running vehicle?",
    a: "Yes — just mark it as not running when you request your quote, so the right equipment and carrier get assigned.",
  },
];

export default function QuickAnswers() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label text-center">Questions</p>
      <h2 className="mt-2 text-center text-3xl">Quick answers</h2>

      <div className="mt-10 space-y-4">
        {QUICK_ANSWERS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q} className="rounded-sm border border-ink/10 bg-paper-dim/40">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-medium text-ink">{item.q}</span>
                <span
                  className={[
                    "shrink-0 text-xl leading-none text-brass transition-transform",
                    isOpen ? "rotate-45" : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              {isOpen && <p className="px-5 pb-5 text-sm text-ink/70">{item.a}</p>}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-ink/60">
        <Link href="/faq" className="underline hover:text-brass">
          See all frequently asked questions
        </Link>
      </p>
    </section>
  );
}
