import { Section, Text } from "@react-email/components";
import { DataRow } from "./DataRow";
import { colors, fontStack } from "./tokens";

// Static list, not an interactive dropdown -- <details>/<summary> is stripped
// or rendered non-interactively by several mobile mail clients (notably
// Gmail's app), which made it read as unstyled plain text. A plain bordered
// card renders identically everywhere.
export function ShipmentDetails({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <Section
      style={{
        marginTop: "18px",
        border: `1px solid ${colors.slateLight}`,
        padding: "10px 12px",
      }}
    >
      <Text
        style={{
          margin: "0 0 6px",
          fontFamily: fontStack,
          fontSize: "10px",
          fontWeight: 700,
          color: colors.slate,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        Shipment details
      </Text>
      {rows.map((row) => (
        <DataRow key={row.label} label={row.label} value={row.value} />
      ))}
    </Section>
  );
}
