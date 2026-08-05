import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { DataRow } from "./components/DataRow";
import { CtaButton } from "./components/CtaButton";
import { colors } from "./components/tokens";

export type OwnerNewQuoteAlertProps = {
  serviceLabel: string;
  vin: string;
  vehicle: string;
  running: string;
  enclosed: string | null;
  route: string;
  preferredDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  orderNumber: string;
  adminUrl: string;
};

export default function OwnerNewQuoteAlert({
  serviceLabel,
  vin,
  vehicle,
  running,
  enclosed,
  route,
  preferredDate,
  contactName,
  contactPhone,
  contactEmail,
  orderNumber,
  adminUrl,
}: OwnerNewQuoteAlertProps) {
  return (
    <Layout previewText={`New quote request: ${contactName}`} orderNumber={orderNumber} footerNote="Internal alert.">
      <Text style={{ margin: "0 0 20px", fontSize: "16px", color: colors.ink, fontWeight: 700 }}>
        New quote request from {contactName}
      </Text>
      <DataRow label="Service" value={serviceLabel} />
      <DataRow label="VIN" value={vin} />
      <DataRow label="Vehicle" value={vehicle} />
      <DataRow label="Running" value={running} />
      {enclosed && <DataRow label="Enclosed" value={enclosed} />}
      <DataRow label="Route" value={route} />
      <DataRow label="Preferred date" value={preferredDate} />
      <DataRow label="Contact" value={`${contactName} — ${contactPhone}`} />
      <DataRow label="Email" value={contactEmail} />
      <div style={{ marginTop: "24px" }}>
        <CtaButton href={adminUrl}>View in admin</CtaButton>
      </div>
    </Layout>
  );
}

OwnerNewQuoteAlert.PreviewProps = {
  serviceLabel: "Carrier Transport",
  vin: "1HGCM82633A004352",
  vehicle: "2021 Toyota Camry (Sedan)",
  running: "Yes",
  enclosed: "No (open)",
  route: "90210 → 10001",
  preferredDate: "2026-08-20 (± 3 days)",
  contactName: "Jordan Lee",
  contactPhone: "(646) 555-0134",
  contactEmail: "jordan@example.com",
  orderNumber: "RR-1007",
  adminUrl: "https://royalrollers.example/admin/quotes",
} satisfies OwnerNewQuoteAlertProps;
