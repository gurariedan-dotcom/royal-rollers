import { DataRow } from "./DataRow";
import { colors, fontStack } from "./tokens";

// Native <details>/<summary> disclosure -- no JS, degrades safely in clients
// that don't support the toggle (content just renders open instead of broken).
export function ShipmentDetails({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <details style={{ marginTop: "20px", borderTop: `1px solid ${colors.slateLight}` }}>
      <summary
        style={{
          cursor: "pointer",
          padding: "12px 0",
          fontFamily: fontStack,
          fontSize: "13px",
          fontWeight: 700,
          color: colors.ink,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        Full shipment details
      </summary>
      <div style={{ paddingTop: "4px" }}>
        {rows.map((row) => (
          <DataRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </details>
  );
}
