import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-signage">
              Royal Rollers
            </p>
            <p className="mt-3 max-w-xs text-sm text-paper/70">
              Vehicle transport from the Tri-State area to anywhere in the
              country &mdash; by carrier or by a personal driver, your call.
            </p>
          </div>

          <div>
            <p className="manifest-label text-paper/60">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/reviews" className="hover:text-brass-light">Reviews</Link></li>
              <li><Link href="/services" className="hover:text-brass-light">Services</Link></li>
              <li><Link href="/how-it-works" className="hover:text-brass-light">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-brass-light">About</Link></li>
              <li><Link href="/faq" className="hover:text-brass-light">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="manifest-label text-paper/60">Get Started</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/quote" className="hover:text-brass-light">Request a Quote</Link></li>
              <li><Link href="/contact" className="hover:text-brass-light">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="route-rule mt-10 opacity-40" />

        <p className="mt-6 text-xs text-paper/50">
          &copy; {new Date().getFullYear()} Royal Rollers. Quotes are estimates until confirmed in writing.
        </p>
      </div>
    </footer>
  );
}
