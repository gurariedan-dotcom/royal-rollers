import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { colors } from "./components/tokens";

export type QuoteReceivedProps = {
  contactName: string;
  serviceLabel: string;
  pickupZip: string;
  dropoffZip: string;
  orderNumber: string;
};

export default function QuoteReceived({
  contactName,
  serviceLabel,
  pickupZip,
  dropoffZip,
  orderNumber,
}: QuoteReceivedProps) {
  return (
    <Layout
      previewText="We've got your quote request"
      orderNumber={orderNumber}
      footerNote="Questions? Just reply to this email."
    >
      <Text style={{ margin: "0 0 16px", fontSize: "16px", color: colors.ink }}>Hi {contactName},</Text>
      <Text style={{ margin: "0 0 16px", fontSize: "16px", color: colors.ink, lineHeight: "24px" }}>
        Thanks for requesting a quote for {serviceLabel.toLowerCase()} from {pickupZip} to {dropoffZip}.
      </Text>
      <Text style={{ margin: 0, fontSize: "16px", color: colors.ink }}>We&apos;ll follow up by email with a priced quote.</Text>
    </Layout>
  );
}

QuoteReceived.PreviewProps = {
  contactName: "Jordan Lee",
  serviceLabel: "Carrier Transport",
  pickupZip: "90210",
  dropoffZip: "10001",
  orderNumber: "RR-1007",
} satisfies QuoteReceivedProps;
