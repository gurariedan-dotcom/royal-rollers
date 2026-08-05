import { Text } from "@react-email/components";
import { Layout } from "./components/Layout";
import { DataRow } from "./components/DataRow";
import { CtaButton } from "./components/CtaButton";
import { colors } from "./components/tokens";

export type QuoteReadyProps = {
  contactName: string;
  route: string;
  dollars: string;
  bookingUrl: string;
  orderNumber: string;
};

export default function QuoteReady({ contactName, route, dollars, bookingUrl, orderNumber }: QuoteReadyProps) {
  return (
    <Layout
      previewText="Your Royal Rollers quote is ready"
      orderNumber={orderNumber}
      footerNote="Questions? Just reply to this email."
    >
      <Text style={{ margin: "0 0 16px", fontSize: "16px", color: colors.ink }}>Hi {contactName},</Text>
      <Text style={{ margin: "0 0 20px", fontSize: "16px", color: colors.ink }}>Your quote is ready:</Text>
      <DataRow label="Route" value={route} />
      <DataRow label="Price" value={dollars} />
      <Text style={{ margin: "20px 0 24px", fontSize: "14px", color: colors.slate, lineHeight: "22px" }}>
        Booking takes a deposit and a card on file for the remaining balance, which is charged automatically
        when your vehicle is delivered.
      </Text>
      <CtaButton href={bookingUrl}>Book now</CtaButton>
    </Layout>
  );
}

QuoteReady.PreviewProps = {
  contactName: "Jordan Lee",
  route: "90210 → 10001",
  dollars: "$1,450.00",
  bookingUrl: "https://royalrollers.example/book/quote-id",
  orderNumber: "RR-1007",
} satisfies QuoteReadyProps;
