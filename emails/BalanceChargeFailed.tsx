import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { CtaButton } from "./components/CtaButton";
import { ShipmentDetails } from "./components/ShipmentDetails";
import { colors } from "./components/tokens";

export type BalanceChargeFailedProps = {
  contactName: string;
  dollars: string;
  reasonText: string;
  orderNumber: string;
  phoneHref: string;
  phoneDisplay: string;
  detailRows: { label: string; value: string }[];
};

export default function BalanceChargeFailed({
  contactName,
  dollars,
  reasonText,
  orderNumber,
  phoneHref,
  phoneDisplay,
  detailRows,
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
      <ShipmentDetails rows={detailRows} />
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
  detailRows: [
    { label: "VIN", value: "1HGCM82633A004352" },
    { label: "Vehicle", value: "2021 Toyota Camry (Sedan)" },
    { label: "Running", value: "Yes" },
    { label: "Enclosed", value: "No (open)" },
    { label: "Route", value: "90210 → 10001" },
    { label: "Preferred date", value: "2026-08-20 (± 3 days)" },
  ],
} satisfies BalanceChargeFailedProps;
