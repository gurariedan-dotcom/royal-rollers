import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { DataRow } from "./components/DataRow";
import { CtaButton } from "./components/CtaButton";
import { ShipmentDetails } from "./components/ShipmentDetails";
import { colors } from "./components/tokens";

export type OwnerNewBookingAlertProps = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  vehicle: string;
  route: string;
  depositDollars: string;
  balanceDollars: string;
  orderNumber: string;
  adminUrl: string;
  detailRows: { label: string; value: string }[];
};

export default function OwnerNewBookingAlert({
  contactName,
  contactEmail,
  contactPhone,
  vehicle,
  route,
  depositDollars,
  balanceDollars,
  orderNumber,
  adminUrl,
  detailRows,
}: OwnerNewBookingAlertProps) {
  return (
    <Layout previewText={`New booking: ${contactName}`} orderNumber={orderNumber} footerNote="Internal alert.">
      <Text style={{ margin: "0 0 20px", fontSize: "16px", color: colors.ink, fontWeight: 700 }}>
        {contactName} just booked
      </Text>
      <DataRow label="Vehicle" value={vehicle} />
      <DataRow label="Route" value={route} />
      <DataRow label="Deposit paid" value={depositDollars} />
      <DataRow label="Balance due" value={balanceDollars} />
      <DataRow label="Contact" value={`${contactName} — ${contactPhone}`} />
      <DataRow label="Email" value={contactEmail} />
      <div style={{ marginTop: "24px" }}>
        <CtaButton href={adminUrl}>View in admin</CtaButton>
      </div>
      <ShipmentDetails rows={detailRows} />
    </Layout>
  );
}

OwnerNewBookingAlert.PreviewProps = {
  contactName: "Jordan Lee",
  contactEmail: "jordan@example.com",
  contactPhone: "(646) 555-0134",
  vehicle: "2021 Toyota Camry (Sedan)",
  route: "90210 → 10001",
  depositDollars: "$290.00",
  balanceDollars: "$1,160.00",
  orderNumber: "RR-1007",
  adminUrl: "https://royalrollers.example/admin/bookings",
  detailRows: [
    { label: "VIN", value: "1HGCM82633A004352" },
    { label: "Running", value: "Yes" },
    { label: "Enclosed", value: "No (open)" },
    { label: "Preferred date", value: "2026-08-20 (± 3 days)" },
  ],
} satisfies OwnerNewBookingAlertProps;
