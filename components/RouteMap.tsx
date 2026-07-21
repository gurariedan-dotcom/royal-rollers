// The signature visual for the site: a stylized manifest-style illustration
// fanning out from the Tri-State cluster to destinations across the
// country. Florida stays the flagship route (full-opacity brass line, rust
// endpoint) since that's still where the business built its reputation and
// sees the heaviest seasonal demand -- the other routes are real, just
// drawn a shade quieter so Florida keeps reading as "the main one." The
// same line/dot language is reused (smaller) as the quote form's step
// tracker in RouteProgress.tsx, so "stops on a route" means something
// consistent across the site.
export default function RouteMap() {
  return (
    <svg
      viewBox="0 0 420 520"
      className="h-full w-full"
      role="img"
      aria-label="Illustrated transport routes from the Tri-State area to destinations across the country, including Florida, Chicago, Texas, and Los Angeles"
    >
      {/* Florida -- flagship route, full opacity */}
      <path
        d="M 130 42 C 190 130, 280 190, 300 320 S 330 420, 320 480"
        fill="none"
        stroke="var(--color-route-line, #A6763B)"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        className="text-brass"
        style={{ stroke: "currentColor" }}
      />

      {/* Chicago, Texas, Los Angeles -- also-real, drawn a shade quieter */}
      <path
        d="M 130 42 C 90 110, 50 160, 52 220 S 55 245, 55 260"
        fill="none"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        className="text-highway"
        style={{ stroke: "currentColor" }}
        opacity="0.6"
      />
      <path
        d="M 130 42 C 110 160, 70 260, 95 380 S 125 450, 130 480"
        fill="none"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        className="text-highway"
        style={{ stroke: "currentColor" }}
        opacity="0.6"
      />
      <path
        d="M 130 42 C 60 150, 10 260, 20 360 S 35 400, 40 430"
        fill="none"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        className="text-highway"
        style={{ stroke: "currentColor" }}
        opacity="0.6"
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

      {/* Florida endpoint -- flagship */}
      <g>
        <circle cx="320" cy="480" r="8" className="fill-rust" />
        <text x="320" y="504" textAnchor="middle" className="fill-ink font-display text-[13px] uppercase tracking-signage">
          Florida
        </text>
      </g>

      {/* Chicago endpoint */}
      <g opacity="0.85">
        <circle cx="55" cy="260" r="6" className="fill-highway" />
        <text x="55" y="242" textAnchor="middle" className="fill-ink font-display text-[13px] uppercase tracking-signage">
          Chicago
        </text>
      </g>

      {/* Texas endpoint */}
      <g opacity="0.85">
        <circle cx="130" cy="480" r="6" className="fill-highway" />
        <text x="130" y="504" textAnchor="middle" className="fill-ink font-display text-[13px] uppercase tracking-signage">
          Texas
        </text>
      </g>

      {/* Los Angeles endpoint */}
      <g opacity="0.85">
        <circle cx="40" cy="430" r="6" className="fill-highway" />
        <text x="40" y="412" textAnchor="middle" className="fill-ink font-display text-[13px] uppercase tracking-signage">
          L.A.
        </text>
      </g>
    </svg>
  );
}
