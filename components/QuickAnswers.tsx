"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

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
    a: "Yes, for Carrier Transport. Your vehicle rides on an insured, licensed carrier's policy. Personal Driver has no hauler-side policy, since there's no hauler involved.",
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label text-center">Questions</p>
      <h2 className="mt-2 text-center text-3xl">Quick answers</h2>

      <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {QUICK_ANSWERS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium text-ink">{item.q}</span>
                <Plus
                  size={18}
                  weight="bold"
                  aria-hidden="true"
                  className={[
                    "shrink-0 text-brass transition-transform duration-300",
                    isOpen ? "rotate-45" : "",
                  ].join(" ")}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? {} : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm text-ink/70">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
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
