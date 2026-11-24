import Link from "next/link";
import { COMPANY_LINE, ROUTES, TAGLINE } from "@/lib/content";

const LINKS = [
  { href: "/quote", label: "Get a quote" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];

export default function Footer() {
  return (
    <footer className="on-navy border-t border-navy-line/60 bg-navy-deep text-navy-muted">
      <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm">
        <p className="text-base text-ink">{TAGLINE}</p>
        <p className="mt-3">{COMPANY_LINE}</p>
        <nav aria-label="Footer" className="mt-4">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline-offset-4 hover:text-ink hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Popular routes" className="mt-4">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {ROUTES.map((r) => (
              <li key={r.slug}>
                <Link href={`/routes/${r.slug}`} className="underline-offset-4 hover:text-ink hover:underline">
                  {r.from} to {r.to}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 text-xs">
          &copy; {new Date().getFullYear()} Royal Rollers LLC. Quotes are estimates until confirmed in
          writing.
        </p>
      </div>
    </footer>
  );
}
