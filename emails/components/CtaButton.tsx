import { Button } from "@react-email/components";
import type { ReactNode } from "react";
import { colors, fontStack } from "./tokens";

export function CtaButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: colors.brass,
        color: colors.paper,
        fontFamily: fontStack,
        fontSize: "13px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        padding: "10px 22px",
        borderRadius: "14px",
      }}
    >
      {children}
    </Button>
  );
}
