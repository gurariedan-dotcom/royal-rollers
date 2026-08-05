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
        fontSize: "14px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        padding: "14px 28px",
        borderRadius: "14px",
      }}
    >
      {children}
    </Button>
  );
}
