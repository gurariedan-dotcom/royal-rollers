import { Column, Row, Text } from "@react-email/components";
import { colors, monoStack } from "./tokens";

export function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <Row style={{ marginBottom: "4px" }}>
      <Column style={{ width: "40%" }}>
        <Text
          style={{
            margin: 0,
            fontSize: "10px",
            color: colors.slate,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {label}
        </Text>
      </Column>
      <Column>
        <Text style={{ margin: 0, fontSize: "12px", color: colors.ink, fontFamily: monoStack }}>{value}</Text>
      </Column>
    </Row>
  );
}
