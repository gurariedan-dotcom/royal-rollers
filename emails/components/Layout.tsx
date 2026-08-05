import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { colors, fontStack } from "./tokens";

export function Layout({
  previewText,
  orderNumber,
  footerNote,
  children,
}: {
  previewText: string;
  orderNumber: string;
  footerNote: ReactNode;
  children: ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: colors.paperDim, margin: 0, padding: "16px 10px", fontFamily: fontStack }}>
        <Container style={{ maxWidth: "560px", backgroundColor: colors.paper }}>
          <Section style={{ backgroundColor: colors.ink, padding: "14px 24px" }}>
            <Text
              style={{
                margin: 0,
                color: colors.paper,
                fontSize: "15px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Royal Rollers
            </Text>
          </Section>
          <Section style={{ height: "3px", backgroundColor: colors.brass, lineHeight: "3px", fontSize: "1px" }}>
            &nbsp;
          </Section>

          <Section style={{ padding: "20px 24px" }}>{children}</Section>

          <Hr style={{ borderColor: colors.slateLight, opacity: 0.4, margin: 0 }} />
          <Section style={{ padding: "12px 24px" }}>
            <Text style={{ margin: 0, fontSize: "11px", color: colors.slate }}>Order {orderNumber}</Text>
            <Text style={{ margin: "4px 0 0", fontSize: "11px", color: colors.slate }}>{footerNote}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
