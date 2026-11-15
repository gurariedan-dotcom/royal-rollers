// Hero visual from the redesign mockup: a two-deck car hauler with the two
// service turnarounds underneath. Pure SVG, no client JS; the roll-in is a
// CSS animation (globals.css) that reduced-motion collapses to nothing.

const CAR_PATH = "M0 26 L9 9 Q13 1 22 1 H70 Q79 1 83 9 L92 26 Z";

const UPPER = [
  { x: 52, fill: "#F2B84C" },
  { x: 156, fill: "#7FA2F5" },
  { x: 260, fill: "#E8ECF5" },
];
const LOWER = [
  { x: 40, fill: "#E8ECF5" },
  { x: 150, fill: "#F2B84C" },
  { x: 258, fill: "#7FA2F5" },
];
const WHEELS = [74, 134, 300, 392];

export default function TruckIllustration() {
  return (
    <div className="rounded-3xl border border-navy-line bg-navy-2 p-6 shadow-panel-lg sm:p-8">
      <svg
        viewBox="0 0 440 190"
        className="w-full"
        role="img"
        aria-label="A two-deck car carrier loaded with six cars"
      >
        <line x1="10" y1="170" x2="430" y2="170" stroke="#3A4766" strokeWidth="3" strokeDasharray="10 9" />
        <g className="truck-in">
          {/* upper deck */}
          <rect x="44" y="58" width="300" height="8" rx="3" fill="#2A3653" />
          {/* Position lives on the <g>; the CSS animation transforms the
              inner path, so the two never overwrite each other. */}
          {UPPER.map((car, i) => (
            <g key={`u${car.x}`} transform={`translate(${car.x} 31)`}>
              <path
                d={CAR_PATH}
                fill={car.fill}
                className="car-drop"
                style={{ animationDelay: `${0.35 + i * 0.08}s` }}
              />
            </g>
          ))}
          {/* lower deck + chassis */}
          {LOWER.map((car, i) => (
            <g key={`l${car.x}`} transform={`translate(${car.x} 104)`}>
              <path
                d={CAR_PATH}
                fill={car.fill}
                className="car-drop"
                style={{ animationDelay: `${0.6 + i * 0.08}s` }}
              />
            </g>
          ))}
          <rect x="30" y="130" width="322" height="9" rx="3" fill="#2A3653" />
          <rect x="30" y="139" width="322" height="16" rx="3" fill="#1C2A4D" />
          {/* cab */}
          <path
            d="M352 155 V80 H384 Q394 80 400 90 L424 132 V155 Z"
            fill="none"
            stroke="#F2B84C"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M362 90 H382 L396 114 H362 Z" fill="#4A5E9A" />
          {WHEELS.map((cx) => (
            <circle key={cx} cx={cx} cy="166" r="13" fill="#16264A" stroke="#F2B84C" strokeWidth="4" />
          ))}
        </g>
      </svg>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-navy-line bg-navy-3/40 px-4 py-4 sm:px-5">
          <dt className="sr-only">Carrier Transport turnaround</dt>
          <dd className="whitespace-nowrap text-xl font-extrabold text-amber sm:text-3xl">1-4 days</dd>
          <dd className="mt-1 text-sm text-navy-muted">Carrier Transport</dd>
        </div>
        <div className="rounded-xl border border-navy-line bg-navy-3/40 px-4 py-4 sm:px-5">
          <dt className="sr-only">Personal Driver turnaround</dt>
          <dd className="whitespace-nowrap text-xl font-extrabold text-amber sm:text-3xl">24-30 hrs</dd>
          <dd className="mt-1 text-sm text-navy-muted">Personal Driver</dd>
        </div>
      </dl>
    </div>
  );
}
