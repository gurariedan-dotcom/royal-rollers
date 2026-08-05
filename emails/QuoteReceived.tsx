import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { ShipmentDetails } from "./components/ShipmentDetails";
import { colors } from "./components/tokens";

export type QuoteReceivedProps = {
  contactName: string;
  orderNumber: string;
  detailRows: { label: string; value: string }[];
};

export default function QuoteReceived({ contactName, orderNumber, detailRows }: QuoteReceivedProps) {
  return (
    <Layout
      previewText="We've got your quote request"
      orderNumber={orderNumber}
      footerNote="Questions or changes? Just reply to this email."
    >
      <Text style={{ margin: "0 0 8px", fontSize: "15px", color: colors.ink }}>Hi {contactName},</Text>
      <Text style={{ margin: 0, fontSize: "15px", color: colors.ink, lineHeight: "20px" }}>
        We&apos;ve received your request for a vehicle transport quote. Thank you for choosing Royal
        Rollers — a representative will get back to you with your final quote as soon as possible.
      </Text>
      <div style={{ marginTop: "10px" }}>
        <ShipmentDetails rows={detailRows} />
      </div>
    </Layout>
  );
}

QuoteReceived.PreviewProps = {
  contactName: "Jordan Lee",
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
