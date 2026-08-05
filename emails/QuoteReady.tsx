import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { DataRow } from "./components/DataRow";
import { CtaButton } from "./components/CtaButton";
import { ShipmentDetails } from "./components/ShipmentDetails";
import { colors } from "./components/tokens";

export type QuoteReadyProps = {
  contactName: string;
  route: string;
  dollars: string;
  bookingUrl: string;
  orderNumber: string;
  detailRows: { label: string; value: string }[];
};

export default function QuoteReady({
  contactName,
  route,
  dollars,
  bookingUrl,
  orderNumber,
  detailRows,
}: QuoteReadyProps) {
  return (
    <Layout
      previewText="Your Royal Rollers quote is ready"
      orderNumber={orderNumber}
      footerNote="Questions or changes? Just reply to this email."
    >
      <Text style={{ margin: "0 0 8px", fontSize: "15px", color: colors.ink }}>Hi {contactName},</Text>
      <Text style={{ margin: "0 0 10px", fontSize: "15px", color: colors.ink }}>Your quote is ready:</Text>
      <DataRow label="Route" value={route} />
      <DataRow label="Price" value={dollars} />
      <Text style={{ margin: "10px 0 12px", fontSize: "13px", color: colors.slate, lineHeight: "18px" }}>
        Booking takes a deposit and a card on file for the remaining balance, which is charged automatically
        when your vehicle is delivered.
      </Text>
      <CtaButton href={bookingUrl}>Book now</CtaButton>
      <ShipmentDetails rows={detailRows} />
    </Layout>
  );
}

QuoteReady.PreviewProps = {
  contactName: "Jordan Lee",
  route: "90210 → 10001",
  dollars: "$1,450.00",
  bookingUrl: "https://royalrollers.example/book/quote-id",
  orderNumber: "RR-1007",
  detailRows: [
    { label: "VIN", value: "1HGCM82633A004352" },
    { label: "Vehicle", value: "2021 Toyota Camry (Sedan)" },
    { label: "Running", value: "Yes" },
    { label: "Enclosed", value: "No (open)" },
    { label: "Preferred date", value: "2026-08-20 (± 3 days)" },
  ],
} satisfies QuoteReadyProps;
