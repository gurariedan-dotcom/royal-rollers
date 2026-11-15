"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react/dist/ssr";

// Reviews lives in the footer only, per the redesign mockup.
const NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="on-navy sticky top-0 z-50 border-b border-navy-line/60 bg-navy text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-extrabold uppercase tracking-wideish">
            Royal Rollers
          </span>
          <span className="mt-1 text-xs uppercase tracking-kicker text-navy-muted">
            Nationwide transport
          </span>
        </Link>

        <nav aria-label="Main" className="hidden gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-navy-muted transition-colors hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/quote" className="btn-amber hidden px-6 py-2.5 sm:inline-flex">
            Get a quote
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-btn border border-navy-line text-paper md:hidden"
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Main mobile"
            className="overflow-hidden border-t border-navy-line/60 bg-navy md:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
          >
            <ul className="space-y-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-base text-navy-muted hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3 sm:hidden">
                <Link href="/quote" onClick={() => setOpen(false)} className="btn-amber w-full">
                  Get a quote
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
