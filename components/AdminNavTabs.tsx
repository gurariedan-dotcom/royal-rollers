"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Tabs,
  TabsHighlight,
  TabsHighlightItem,
  TabsList,
  TabsTab,
} from "@/components/animate-ui/primitives/base/tabs";

const TABS = [
  { value: "quotes", label: "Quotes", href: "/admin/quotes" },
  { value: "bookings", label: "Bookings", href: "/admin/bookings" },
] as const;

export default function AdminNavTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname?.includes("bookings") ? "bookings" : "quotes";

  return (
    <Tabs
      value={current}
      onValueChange={(value) => {
        const tab = TABS.find((t) => t.value === value);
        if (tab && tab.value !== current) router.push(tab.href);
      }}
    >
      <TabsList className="inline-flex rounded-sm border border-ink/15 bg-paper p-1">
        <TabsHighlight
          className="absolute inset-0 rounded-sm bg-ink"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {TABS.map((tab) => (
            <TabsHighlightItem key={tab.value} value={tab.value}>
              <TabsTab
                value={tab.value}
                className="relative rounded-sm px-5 py-2 font-display text-sm uppercase tracking-wideish text-ink/70 outline-none transition-colors duration-150 data-[active=true]:text-paper"
              >
                {tab.label}
              </TabsTab>
            </TabsHighlightItem>
          ))}
        </TabsHighlight>
      </TabsList>
    </Tabs>
  );
}
