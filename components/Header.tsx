"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react/dist/ssr";

const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold uppercase tracking-signage text-ink">
            Royal Rollers
          </span>
          <span className="manifest-label hidden sm:inline">Nationwide Transport</span>
        </Link>

        <nav aria-label="Main" className="hidden gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-medium text-ink/80 transition-colors hover:text-brass"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            className="hidden rounded-lg bg-brass px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wideish text-paper transition-[transform,background-color] duration-150 ease-out hover:bg-brass-dark hover:-translate-y-px active:translate-y-0 active:scale-[0.98] sm:inline-block"
          >
            Get a Quote
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/15 text-ink lg:hidden"
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            aria-label="Main mobile"
            className="overflow-hidden border-t border-ink/10 bg-paper lg:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="space-y-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 font-body text-sm font-medium text-ink/80 hover:text-brass"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 sm:hidden">
                <Link
                  href="/quote"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-brass px-5 py-2.5 text-center font-display text-sm font-semibold uppercase tracking-wideish text-paper transition-colors hover:bg-brass-dark"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
