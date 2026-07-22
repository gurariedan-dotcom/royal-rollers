import Link from "next/link";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Contact",
  description: "Reach Royal Rollers directly by email or phone before requesting a quote.",
};

// Note: no contact-form backend was scoped in planning (only the quote,
// booking, and charge-balance API routes were). This page uses a plain
// mailto/tel link rather than inventing a new API route -- add a real
// contact form + route later if the business wants one.
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="manifest-label">Contact</p>
      <h1 className="mt-2 text-3xl">Talk to a person</h1>
      <p className="mt-4 text-ink/70">
        Have a question before requesting a quote, or need to talk through a
        tricky pickup? Reach out directly.
      </p>

      <div className="mt-8 space-y-4">
        <a
          href="mailto:quotes@royalrollers.example"
          className="flex items-center gap-4 rounded-sm border border-ink/10 p-5 transition-all hover:border-brass hover:shadow-panel"
        >
          <EnvelopeSimple size={22} className="shrink-0 text-brass" />
          <span>
            <span className="manifest-label block">Email</span>
            <span className="mt-1 block text-lg text-ink">quotes@royalrollers.example</span>
          </span>
        </a>
        <a
          href="tel:+15555555555"
          className="flex items-center gap-4 rounded-sm border border-ink/10 p-5 transition-all hover:border-brass hover:shadow-panel"
        >
          <Phone size={22} className="shrink-0 text-brass" />
          <span>
            <span className="manifest-label block">Phone</span>
            <span className="mt-1 block text-lg text-ink">(555) 555-5555</span>
          </span>
        </a>
      </div>

      <p className="mt-10 text-sm text-ink/60">
        Ready to move forward already?{" "}
        <Link href="/quote" className="underline hover:text-brass">
          Request a quote
        </Link>{" "}
        instead.
      </p>
    </div>
  );
}
