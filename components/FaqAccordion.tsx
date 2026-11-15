"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import type { FaqItem } from "@/lib/content";

export default function FaqAccordion({
  items,
  defaultOpenIndex = 0,
}: {
  items: FaqItem[];
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `${baseId}-${i}`;
        const Icon = isOpen ? Minus : Plus;
        return (
          <div key={item.q} className="card">
            <h3 className="text-base font-bold tracking-normal">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-6 py-5 text-left"
              >
                <span>{item.q}</span>
                <Icon size={18} weight="bold" aria-hidden="true" className="shrink-0 text-amber-ink" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? {} : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[70ch] px-6 pb-6 text-slate">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
