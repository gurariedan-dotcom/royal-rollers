type Row = {
  label: string;
  carrier: string;
  personalDriver: string;
};

// Turnaround numbers (1-4 days / 24-30 hours) come directly from the
// business owner's operating experience -- do not adjust without checking
// with him first. See handoff doc, Section 4.3.
const ROWS: Row[] = [
  {
    label: "Insurance",
    carrier: "Fully insured through the carrier",
    personalDriver: "N/A \u2014 mileage is added to the vehicle instead",
  },
  {
    label: "Mileage on your car",
    carrier: "None \u2014 it rides on the hauler",
    personalDriver: "Some \u2014 the vehicle is driven point-to-point",
  },
  {
    label: "Fees",
    carrier: "No hidden fees",
    personalDriver: "Sometimes cheaper, especially short-notice single-vehicle jobs",
  },
  {
    label: "Typical turnaround",
    carrier: "1\u20134 days",
    personalDriver: "24\u201330 hours",
  },
  {
    label: "Timing precision",
    carrier: "Standard carrier routing",
    personalDriver: "More precise pickup / dropoff timing",
  },
  {
    label: "Best for",
    carrier: "Long distance, multi-vehicle, high-value or enclosed needs",
    personalDriver: "Tight timelines, direct control, fast single-car moves",
  },
];

export default function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">Comparison of Carrier Transport and Personal Driver service</caption>
        <thead>
          <tr className="border-b-2 border-ink">
            <th scope="col" className="w-1/4 py-4 pr-4 manifest-label">
              &nbsp;
            </th>
            <th scope="col" className="py-4 pr-4">
              <span className="inline-block rounded-sm bg-highway px-3 py-1 font-display text-sm uppercase tracking-wideish text-paper">
                Carrier Transport
              </span>
            </th>
            <th scope="col" className="py-4">
              <span className="inline-block rounded-sm bg-rust px-3 py-1 font-display text-sm uppercase tracking-wideish text-paper">
                Personal Driver
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr
              key={row.label}
              className={i % 2 === 0 ? "bg-paper" : "bg-paper-dim"}
            >
              <th scope="row" className="py-4 pr-4 align-top font-display text-sm uppercase tracking-wideish text-ink/70">
                {row.label}
              </th>
              <td className="py-4 pr-4 align-top text-sm text-ink">{row.carrier}</td>
              <td className="py-4 align-top text-sm text-ink">{row.personalDriver}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
