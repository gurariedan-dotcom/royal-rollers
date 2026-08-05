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
      <Body style={{ backgroundColor: colors.paperDim, margin: 0, padding: "32px 16px", fontFamily: fontStack }}>
        <Container style={{ maxWidth: "560px", backgroundColor: colors.paper }}>
          <Section style={{ backgroundColor: colors.ink, padding: "24px 32px" }}>
            <Text
              style={{
                margin: 0,
                color: colors.paper,
                fontSize: "18px",
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

          <Section style={{ padding: "32px" }}>{children}</Section>

          <Hr style={{ borderColor: colors.slateLight, opacity: 0.4, margin: 0 }} />
          <Section style={{ padding: "20px 32px" }}>
            <Text style={{ margin: 0, fontSize: "12px", color: colors.slate }}>Order {orderNumber}</Text>
            <Text style={{ margin: "8px 0 0", fontSize: "12px", color: colors.slate }}>{footerNote}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
