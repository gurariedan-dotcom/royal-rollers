import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { DataRow } from "./components/DataRow";
import { CtaButton } from "./components/CtaButton";
import { colors } from "./components/tokens";

export type OwnerBalanceChargeFailedAlertProps = {
  contactName: string;
  contactEmail: string;
  dollars: string;
  reasonText: string;
  orderNumber: string;
  adminUrl: string;
};

export default function OwnerBalanceChargeFailedAlert({
  contactName,
  contactEmail,
  dollars,
  reasonText,
  orderNumber,
  adminUrl,
}: OwnerBalanceChargeFailedAlertProps) {
  return (
    <Layout
      previewText={`Balance charge failed: ${contactName}`}
      orderNumber={orderNumber}
      footerNote="Internal alert. The customer has been emailed asking them to follow up."
    >
      <Text style={{ margin: "0 0 20px", fontSize: "16px", color: colors.ink, fontWeight: 700 }}>
        Balance charge failed for {contactName}
      </Text>
      <DataRow label="Amount" value={dollars} />
      <DataRow label="Reason" value={reasonText} />
      <DataRow label="Customer" value={`${contactName} — ${contactEmail}`} />
      <div style={{ marginTop: "24px" }}>
        <CtaButton href={adminUrl}>View in admin</CtaButton>
      </div>
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
} satisfies OwnerBalanceChargeFailedAlertProps;
