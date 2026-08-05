import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { DataRow } from "./components/DataRow";
import { colors } from "./components/tokens";

export type BookingConfirmedProps = {
  contactName: string;
  vehicle: string;
  route: string;
  depositDollars: string;
  balanceDollars: string;
  orderNumber: string;
};

export default function BookingConfirmed({
  contactName,
  vehicle,
  route,
  depositDollars,
  balanceDollars,
  orderNumber,
}: BookingConfirmedProps) {
  return (
    <Layout
      previewText="You're booked — Royal Rollers"
      orderNumber={orderNumber}
      footerNote="Questions? Just reply to this email."
    >
      <Text style={{ margin: "0 0 16px", fontSize: "16px", color: colors.ink }}>Hi {contactName},</Text>
      <Text style={{ margin: "0 0 20px", fontSize: "16px", color: colors.ink, lineHeight: "24px" }}>
        You&apos;re booked. Your deposit of <strong>{depositDollars}</strong> has been charged. Here&apos;s
        what we have on file:
      </Text>
      <DataRow label="Vehicle" value={vehicle} />
      <DataRow label="Route" value={route} />
      <DataRow label="Deposit paid" value={depositDollars} />
      <DataRow label="Balance due at delivery" value={balanceDollars} />
      <Text style={{ margin: "20px 0 0", fontSize: "14px", color: colors.slate, lineHeight: "22px" }}>
        The remaining balance is charged automatically to the card on file once your vehicle is delivered —
        no action needed from you.
      </Text>
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
} satisfies BookingConfirmedProps;
