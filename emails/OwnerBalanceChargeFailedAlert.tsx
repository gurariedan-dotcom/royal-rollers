import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { DataRow } from "./components/DataRow";
import { CtaButton } from "./components/CtaButton";
import { ShipmentDetails } from "./components/ShipmentDetails";
import { colors } from "./components/tokens";

export type OwnerBalanceChargeFailedAlertProps = {
  contactName: string;
  contactEmail: string;
  dollars: string;
  reasonText: string;
  orderNumber: string;
  adminUrl: string;
  detailRows: { label: string; value: string }[];
};

export default function OwnerBalanceChargeFailedAlert({
  contactName,
  contactEmail,
  dollars,
  reasonText,
  orderNumber,
  adminUrl,
  detailRows,
}: OwnerBalanceChargeFailedAlertProps) {
  return (
    <Layout
      previewText={`Balance charge failed: ${contactName}`}
      orderNumber={orderNumber}
      footerNote="Internal alert. The customer has been emailed asking them to follow up."
    >
      <Text style={{ margin: "0 0 10px", fontSize: "15px", color: colors.ink, fontWeight: 700 }}>
        Balance charge failed for {contactName}
      </Text>
      <DataRow label="Amount" value={dollars} />
      <DataRow label="Reason" value={reasonText} />
      <DataRow label="Customer" value={`${contactName} — ${contactEmail}`} />
      <div style={{ marginTop: "12px" }}>
        <CtaButton href={adminUrl}>View in admin</CtaButton>
      </div>
      <ShipmentDetails rows={detailRows} />
    </Layout>
  );
}

OwnerBalanceChargeFailedAlert.PreviewProps = {
  contactName: "Jordan Lee",
  contactEmail: "jordan@example.com",
  dollars: "$1,160.00",
  reasonText: "the card on file was declined",
  orderNumber: "RR-1007",
  adminUrl: "https://royalrollers.example/admin/bookings",
  detailRows: [
    { label: "VIN", value: "1HGCM82633A004352" },
    { label: "Vehicle", value: "2021 Toyota Camry (Sedan)" },
    { label: "Running", value: "Yes" },
    { label: "Enclosed", value: "No (open)" },
    { label: "Route", value: "90210 → 10001" },
    { label: "Preferred date", value: "2026-08-20 (± 3 days)" },
  ],
} satisfies OwnerBalanceChargeFailedAlertProps;
