"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";

const NAV_LINKS = [
  { href: "/reviews", label: "Reviews" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold uppercase tracking-signage text-ink">
            Royal Rollers
          </span>
          <span className="manifest-label hidden sm:inline">Tri-State &rarr; Nationwide</span>
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
            className="rounded-sm bg-brass px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wideish text-paper transition-all hover:bg-brass-dark hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
          >
            Get a Quote
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-ink/15 text-ink lg:hidden"
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Main mobile" className="border-t border-ink/10 bg-paper px-6 py-4 lg:hidden">
          <ul className="space-y-1">
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
          </ul>
        </nav>
      )}
    </header>
  );
}
