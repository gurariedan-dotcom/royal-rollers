import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { DataRow } from "./components/DataRow";
import { ShipmentDetails } from "./components/ShipmentDetails";
import { colors } from "./components/tokens";

export type BookingConfirmedProps = {
  contactName: string;
  vehicle: string;
  route: string;
  depositDollars: string;
  balanceDollars: string;
  orderNumber: string;
  detailRows: { label: string; value: string }[];
};

export default function BookingConfirmed({
  contactName,
  vehicle,
  route,
  depositDollars,
  balanceDollars,
  orderNumber,
  detailRows,
}: BookingConfirmedProps) {
  return (
    <Layout
      previewText="You're booked — Royal Rollers"
      orderNumber={orderNumber}
      footerNote="Questions or changes? Just reply to this email."
    >
      <Text style={{ margin: "0 0 8px", fontSize: "15px", color: colors.ink }}>Hi {contactName},</Text>
      <Text style={{ margin: "0 0 10px", fontSize: "15px", color: colors.ink, lineHeight: "20px" }}>
        You&apos;re booked. Your deposit of <strong>{depositDollars}</strong> has been charged. Here&apos;s
        what we have on file:
      </Text>
      <DataRow label="Vehicle" value={vehicle} />
      <DataRow label="Route" value={route} />
      <DataRow label="Deposit paid" value={depositDollars} />
      <DataRow label="Balance due at delivery" value={balanceDollars} />
      <Text style={{ margin: "10px 0 0", fontSize: "13px", color: colors.slate, lineHeight: "18px" }}>
        The remaining balance is charged automatically to the card on file once your vehicle is delivered —
        no action needed from you.
      </Text>
      <ShipmentDetails rows={detailRows} />
    </Layout>
  );
}

BookingConfirmed.PreviewProps = {
  contactName: "Jordan Lee",
  vehicle: "2021 Toyota Camry (Sedan)",
  route: "90210 → 10001",
  depositDollars: "$290.00",
  balanceDollars: "$1,160.00",
  orderNumber: "RR-1007",
  detailRows: [
    { label: "VIN", value: "1HGCM82633A004352" },
    { label: "Running", value: "Yes" },
    { label: "Enclosed", value: "No (open)" },
    { label: "Preferred date", value: "2026-08-20 (± 3 days)" },
  ],
} satisfies BookingConfirmedProps;
