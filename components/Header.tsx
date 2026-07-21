import Link from "next/link";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold uppercase tracking-signage text-ink">
            Royal Rollers
          </span>
          <span className="manifest-label hidden sm:inline">Tri-State &rarr; FL</span>
        </Link>

        <nav aria-label="Main" className="hidden gap-7 md:flex">
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

        <Link
          href="/quote"
          className="rounded-sm bg-brass px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wideish text-paper transition-colors hover:bg-brass-dark"
        >
          Get a Quote
        </Link>
      </div>
    </header>
  );
}
