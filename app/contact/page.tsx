import Link from "next/link";

export const metadata = {
  title: "Contact | Royal Rollers",
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
          className="block rounded-sm border border-ink/10 p-5 hover:border-brass"
        >
          <p className="manifest-label">Email</p>
          <p className="mt-1 text-lg text-ink">quotes@royalrollers.example</p>
        </a>
        <a
          href="tel:+15555555555"
          className="block rounded-sm border border-ink/10 p-5 hover:border-brass"
        >
          <p className="manifest-label">Phone</p>
          <p className="mt-1 text-lg text-ink">(555) 555-5555</p>
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
