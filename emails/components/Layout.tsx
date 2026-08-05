import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { colors, fontStack } from "./tokens";

// Same contact info used site-wide (app/contact/page.tsx, lib/email.ts).
const CONTACT_EMAIL = "quotes@royal-rollers.com";
const CONTACT_PHONE_HREF = "tel:+16465892334";
const CONTACT_PHONE_DISPLAY = "(646) 589-2334";

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
            <Text style={{ margin: "8px 0 0", fontSize: "11px", color: colors.slate }}>
              Or contact us at:{" "}
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                style={{ color: colors.brass, textDecoration: "underline" }}
              >
                {CONTACT_EMAIL}
              </Link>
              {" · "}
              <Link href={CONTACT_PHONE_HREF} style={{ color: colors.brass, textDecoration: "underline" }}>
                {CONTACT_PHONE_DISPLAY}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
