export const metadata = {
  title: "Accessibility Statement",
  description: "Our commitment to making royal-rollers.com usable for everyone, and how to reach us about accessibility issues.",
};

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="manifest-label">Legal</p>
      <h1 className="mt-2 text-3xl">Accessibility Statement</h1>
      <p className="mt-4 text-sm text-ink/60">Last updated August 10, 2026</p>

      <div className="mt-10 space-y-10 text-ink/75">
        <section>
          <p>
            Royal Rollers is committed to making royal-rollers.com usable by
            everyone, including people who use assistive technology such as
            screen readers, screen magnifiers, or keyboard-only navigation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">What we do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Semantic HTML and labeled form fields throughout the site, including the quote and booking flows.</li>
            <li>Sufficient color contrast between text and background across the site&apos;s ink-on-paper color system.</li>
            <li>Keyboard-operable navigation, forms, and interactive controls.</li>
            <li>Text that scales and reflows on mobile devices and with browser zoom.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Ongoing work</h2>
          <p className="mt-3">
            Accessibility is an ongoing effort, not a one-time fix. We review
            and improve the site as issues are identified, including through
            reports from visitors.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Let us know</h2>
          <p className="mt-3">
            If you encounter an accessibility barrier anywhere on
            royal-rollers.com, or need information in an alternate format,
            contact us and we&apos;ll work with you directly:
          </p>
          <p className="mt-3">
            Email{" "}
            <a href="mailto:support@royal-rollers.com" className="underline hover:text-brass">
              support@royal-rollers.com
            </a>{" "}
            or call{" "}
            <a href="tel:+16465892334" className="underline hover:text-brass">
              (646) 589-2334
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
