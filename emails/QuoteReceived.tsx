import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { ShipmentDetails } from "./components/ShipmentDetails";
import { colors } from "./components/tokens";

export type QuoteReceivedProps = {
  contactName: string;
  serviceLabel: string;
  pickupZip: string;
  dropoffZip: string;
  orderNumber: string;
  detailRows: { label: string; value: string }[];
};

export default function QuoteReceived({
  contactName,
  serviceLabel,
  pickupZip,
  dropoffZip,
  orderNumber,
  detailRows,
}: QuoteReceivedProps) {
  return (
    <Layout
      previewText="We've got your quote request"
      orderNumber={orderNumber}
      footerNote="Questions or changes? Just reply to this email."
    >
      <Text style={{ margin: "0 0 8px", fontSize: "15px", color: colors.ink }}>Hi {contactName},</Text>
      <Text style={{ margin: "0 0 8px", fontSize: "15px", color: colors.ink, lineHeight: "20px" }}>
        Thanks for requesting a quote for {serviceLabel.toLowerCase()} from {pickupZip} to {dropoffZip}.
      </Text>
      <Text style={{ margin: 0, fontSize: "15px", color: colors.ink }}>We&apos;ll follow up by email with a priced quote.</Text>
      <ShipmentDetails rows={detailRows} />
    </Layout>
  );
}

QuoteReceived.PreviewProps = {
  contactName: "Jordan Lee",
  serviceLabel: "Carrier Transport",
  pickupZip: "90210",
  dropoffZip: "10001",
  orderNumber: "RR-1007",
  detailRows: [
    { label: "VIN", value: "1HGCM82633A004352" },
    { label: "Vehicle", value: "2021 Toyota Camry (Sedan)" },
    { label: "Running", value: "Yes" },
    { label: "Enclosed", value: "No (open)" },
    { label: "Route", value: "90210 → 10001" },
    { label: "Preferred date", value: "2026-08-20 (± 3 days)" },
  ],
} satisfies QuoteReceivedProps;
