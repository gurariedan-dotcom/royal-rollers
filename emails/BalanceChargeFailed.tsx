import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { CtaButton } from "./components/CtaButton";
import { colors } from "./components/tokens";

export type BalanceChargeFailedProps = {
  contactName: string;
  dollars: string;
  reasonText: string;
  orderNumber: string;
  phoneHref: string;
  phoneDisplay: string;
};

export default function BalanceChargeFailed({
  contactName,
  dollars,
  reasonText,
  orderNumber,
  phoneHref,
  phoneDisplay,
}: BalanceChargeFailedProps) {
  return (
    <Layout
      previewText="We couldn't charge your card"
      orderNumber={orderNumber}
      footerNote="Or reply to this email — either works."
    >
      <Text style={{ margin: "0 0 16px", fontSize: "16px", color: colors.ink }}>Hi {contactName},</Text>
      <Text style={{ margin: "0 0 16px", fontSize: "16px", color: colors.ink, lineHeight: "24px" }}>
        Your vehicle has been delivered, but we weren&apos;t able to charge the remaining balance of{" "}
        <strong>{dollars}</strong> — {reasonText}.
      </Text>
      <Text style={{ margin: "0 0 24px", fontSize: "16px", color: colors.ink, lineHeight: "24px" }}>
        Give us a call so we can update your payment method and complete the charge.
      </Text>
      <CtaButton href={phoneHref}>Call us — {phoneDisplay}</CtaButton>
    </Layout>
  );
}

BalanceChargeFailed.PreviewProps = {
  contactName: "Jordan Lee",
  dollars: "$1,160.00",
  reasonText: "the card on file was declined",
  orderNumber: "RR-1007",
  phoneHref: "tel:+16465892334",
  phoneDisplay: "(646) 589-2334",
} satisfies BalanceChargeFailedProps;
