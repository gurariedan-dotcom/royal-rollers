// The signature visual for the site: a stylized manifest-style route line
// running from the Tri-State cluster down the seaboard to Florida. This
// isn't decoration -- it's the actual corridor the business runs, and the
// same line/dot language is reused (smaller) as the quote form's step
// tracker in RouteProgress.tsx, so "stops on a route" means something
// consistent across the site.
export default function RouteMap() {
  return (
    <svg
      viewBox="0 0 420 520"
      className="h-full w-full"
      role="img"
      aria-label="Illustrated transport route from the Tri-State area to Florida"
    >
      <path
        d="M 130 40 C 60 140, 260 180, 190 280 S 300 420, 250 480"
        fill="none"
        stroke="var(--color-route-line, #A6763B)"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        className="text-brass"
        style={{ stroke: "currentColor" }}
      />

      {/* Tri-State cluster */}
      <g className="text-ink">
        <circle cx="130" cy="40" r="7" fill="currentColor" />
        <circle cx="150" cy="58" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="108" cy="60" r="4" fill="currentColor" opacity="0.5" />
        <text x="130" y="18" textAnchor="middle" className="fill-ink font-display text-[13px] uppercase tracking-signage">
          NY / NJ / CT
        </text>
      </g>

      {/* Midpoint waypoint */}
      <circle cx="190" cy="280" r="5" className="fill-highway" />
      <text x="212" y="284" className="fill-slate font-mono text-[11px] uppercase">
        en route
      </text>

      {/* Florida endpoint */}
      <g>
        <circle cx="250" cy="480" r="8" className="fill-rust" />
        <text x="250" y="504" textAnchor="middle" className="fill-ink font-display text-[13px] uppercase tracking-signage">
          Florida
        </text>
      </g>
    </svg>
  );
}
