import Link from "next/link";
import { ChatCircleText } from "@phosphor-icons/react/dist/ssr";

export default function ContactButton() {
  return (
    <Link
      href="/contact"
      aria-label="Contact us"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brass px-5 py-3 font-display text-sm font-semibold uppercase tracking-wideish text-paper shadow-panel transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:bg-brass-dark active:translate-y-0 active:scale-[0.98]"
    >
      <ChatCircleText size={18} weight="bold" aria-hidden="true" />
      Contact
    </Link>
  );
}
