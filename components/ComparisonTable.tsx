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
    personalDriver: "N/A, mileage is added to the vehicle instead",
  },
  {
    label: "Mileage on your car",
    carrier: "None, it rides on the hauler",
    personalDriver: "Some, the vehicle is driven point-to-point",
  },
  {
    label: "Fees",
    carrier: "No hidden fees",
    personalDriver: "Sometimes cheaper, especially short-notice single-vehicle jobs",
  },
  {
    label: "Typical turnaround",
    carrier: "1-4 days",
    personalDriver: "24-30 hours",
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

const COLUMNS = [
  { key: "carrier", title: "Carrier Transport", accent: "border-highway" },
  { key: "personalDriver", title: "Personal Driver", accent: "border-rust" },
] as const;

export default function ComparisonTable() {
  return (
    <>
      {/* Below md: two plain side-by-side lists, one per option, instead of
          a row-per-card layout — easier to scan than stacked cards, and
          headings are plain text with an accent underline rather than
          rounded pill badges. */}
      <div
        className="grid grid-cols-2 gap-x-6 md:hidden"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        {COLUMNS.map((col) => (
          <div key={col.key}>
            <h3 className={`border-b-2 pb-2 text-sm font-bold uppercase tracking-tight text-ink ${col.accent}`}>
              {col.title}
            </h3>
            <ul className="mt-4 space-y-4">
              {ROWS.map((row) => (
                <li key={row.label}>
                  <p className="text-xs uppercase tracking-wide text-ink/50">{row.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/80">{row[col.key]}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* md and up: simplified table — modern underline-style column
          headings instead of solid color pills on a dark bar, no zebra
          striping, just a hairline divider between rows. */}
      <div className="hidden rounded-sm border border-ink/10 md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Comparison of Carrier Transport and Personal Driver service</caption>
          <thead>
            <tr>
              <th scope="col" className="w-1/4 py-5 pr-4 pl-6">
                &nbsp;
              </th>
              {COLUMNS.map((col) => (
                <th key={col.key} scope="col" className="py-5 pr-6 first:pr-4">
                  <span className={`inline-block border-b-2 pb-1 font-display text-sm uppercase tracking-wideish text-ink ${col.accent}`}>
                    {col.title}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-ink/10">
                <th scope="row" className="py-4 pr-4 pl-6 align-top font-display text-sm uppercase tracking-wideish text-ink/70">
                  {row.label}
                </th>
                <td className="py-4 pr-4 align-top text-sm text-ink">{row.carrier}</td>
                <td className="py-4 pr-6 align-top text-sm text-ink">{row.personalDriver}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
