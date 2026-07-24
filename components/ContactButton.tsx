import Link from "next/link";
import { ChatCircleText } from "@phosphor-icons/react/dist/ssr";

export default function ContactButton() {
  return (
    <Link
      href="/contact"
      aria-label="Contact us"
      className={[
        "fixed right-4 z-50 flex items-center gap-2 rounded-full bg-brass px-5 py-3 font-display text-sm font-semibold uppercase tracking-wideish text-paper transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:bg-brass-dark active:translate-y-0 active:scale-[0.98] sm:right-6",
        // <640px: iPhone home-indicator safe area + real shadow.
        // sm+: pixel-identical to the original -- flat bottom-6, no shadow.
        "bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] shadow-button-hover sm:bottom-6 sm:shadow-panel",
      ].join(" ")}
    >
      <ChatCircleText size={18} weight="bold" aria-hidden="true" />
      Contact
    </Link>
  );
}
