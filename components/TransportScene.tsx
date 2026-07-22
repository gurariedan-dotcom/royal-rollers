"use client";

import { motion, useReducedMotion } from "motion/react";

// The signature hero visual: a flatbed carrier hauling two cars, with a
// solo "Personal Driver" car out ahead on the same road -- a literal,
// moving picture of the site's core choice (Carrier Transport vs. Personal
// Driver) instead of an abstract diagram. Carrier elements use the
// "highway" teal, the solo car uses the "rust" wine, matching the color
// coding used everywhere else on the site (homepage cards, service pages).
//
// Vehicle silhouettes carry real automotive detail (wheel arches, door
// seams, mirrors; a proper sloped-hood conventional-tractor cab with
// grille/headlight/exhaust) rather than plain rounded rectangles, so the
// scene reads as vehicles at a glance instead of abstract shapes.
//
// Motion is a "treadmill": the vehicles stay put, wheels spin and the road
// markings scroll under them, which reads as continuous forward motion
// without needing off-canvas re-entry logic. Every loop is gated behind
// prefers-reduced-motion, collapsing to a single still frame.
export default function TransportScene() {
  const reduce = useReducedMotion();

  const wheelSpin = reduce
    ? {}
    : {
        animate: { rotate: 360 },
        transition: { duration: 1.4, repeat: Infinity, ease: "linear" as const },
      };

  const bob = (delay: number) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -2.5, 0] },
          transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  const settle = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, scale: 0.92 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] as const },
        };

  const roadDash = reduce
    ? {}
    : {
        animate: { strokeDashoffset: [0, -48] },
        transition: { duration: 1.1, repeat: Infinity, ease: "linear" as const },
      };

  // Translate to position first, then rotate the (already re-centered)
  // inner group around its own local (0,0) -- avoids relying on SVG
  // transform-origin percentage/pixel quirks entirely.
  const Wheel = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
    <g transform={`translate(${cx}, ${cy})`}>
      {/* tire */}
      <circle r={r} className="fill-ink" />
      <circle r={r * 0.86} fill="none" className="stroke-paper/25" strokeWidth={r * 0.16} />
      <motion.g {...wheelSpin}>
        <circle r={r * 0.42} className="fill-brass" />
        <rect x={-1} y={-r * 0.62} width="2" height={r * 1.24} className="fill-paper" opacity="0.6" />
        <rect x={-r * 0.62} y={-1} width={r * 1.24} height="2" className="fill-paper" opacity="0.6" />
      </motion.g>
    </g>
  );

  // A simple side-profile car: rounded body + greenhouse, door seam,
  // wheel-arch shading, and a small side mirror for a less "blobby" read.
  const Car = ({
    x,
    bodyClass,
    windowOpacity = 0.9,
  }: {
    x: number;
    bodyClass: string;
    windowOpacity?: number;
  }) => (
    <g transform={`translate(${x}, 0)`}>
      <ellipse cx="18" cy="192" rx="16" ry="6" className="fill-ink/30" />
      <ellipse cx="54" cy="192" rx="16" ry="6" className="fill-ink/30" />
      <path
        d="M 0 192 L 6 168 Q 10 160 20 160 L 52 160 Q 62 160 66 168 L 72 192 Z"
        className={bodyClass}
      />
      <rect x="18" y="166" width="36" height="14" rx="4" className="fill-paper" opacity={windowOpacity} />
      <line x1="36" y1="180" x2="36" y2="192" className="stroke-ink/25" strokeWidth="1.5" />
      <path d="M 21 162 L 15 158 L 21 158 Z" className="fill-ink/50" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 640 300"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of a carrier truck hauling two cars, with a personal driver's car out ahead on the same road"
    >
      {/* Road */}
      <line x1="0" y1="248" x2="640" y2="248" className="stroke-ink/15" strokeWidth="2" />
      <motion.line
        x1="0"
        y1="256"
        x2="640"
        y2="256"
        className="stroke-brass/50"
        strokeWidth="3"
        strokeDasharray="24 24"
        strokeLinecap="round"
        {...roadDash}
      />

      {/* Carrier: flatbed hauling two cars */}
      <motion.g {...settle(0)}>
        <motion.g {...bob(0)}>
          {/* flatbed deck */}
          <rect x="86" y="192" width="192" height="14" rx="3" className="fill-ink" />
          <rect x="86" y="192" width="192" height="4" rx="2" className="fill-brass" opacity="0.6" />

          <Car x={100} bodyClass="fill-highway" />
          <Car x={184} bodyClass="fill-ink/70" />

          {/* tractor cab: upright cab + sloped hood, grille, headlight, exhaust */}
          <rect x="269" y="106" width="7" height="6" rx="1" className="fill-ink" />
          <rect x="270" y="110" width="5" height="42" rx="2" className="fill-ink" />
          <rect x="270" y="130" width="5" height="3" className="fill-brass" opacity="0.8" />

          <ellipse cx="292" cy="206" rx="18" ry="6" className="fill-ink/30" />
          <ellipse cx="316" cy="206" rx="18" ry="6" className="fill-ink/30" />

          <path
            d="M 276 206 L 276 150 Q 276 144 282 144 L 302 144 Q 308 144 309 150 L 309 170 L 332 188 Q 340 191 342 197 Q 344 201 344 206 Z"
            className="fill-ink"
          />
          <rect x="284" y="152" width="22" height="17" rx="2" className="fill-paper" opacity="0.9" />
          <line x1="309" y1="150" x2="309" y2="172" className="stroke-paper/20" strokeWidth="1.5" />
          <path d="M 310 154 L 317 149 L 317 156 Z" className="fill-ink/70" />

          {/* grille */}
          <line x1="335" y1="188" x2="341" y2="192" className="stroke-paper/40" strokeWidth="1.5" />
          <line x1="333" y1="193" x2="340" y2="197" className="stroke-paper/40" strokeWidth="1.5" />
          <circle cx="340" cy="200" r="3.5" className="fill-brass" />
          <rect x="330" y="203" width="14" height="3" className="fill-brass" opacity="0.85" />

          {/* wheels */}
          <Wheel cx={118} cy={230} r={13} />
          <Wheel cx={154} cy={230} r={13} />
          <Wheel cx={228} cy={230} r={13} />
          <Wheel cx={300} cy={230} r={15} />
          <Wheel cx={324} cy={230} r={15} />
        </motion.g>
      </motion.g>

      {/* Personal Driver: solo car, out ahead */}
      <motion.g {...settle(0.15)}>
        <motion.g {...bob(0.4)}>
          <ellipse cx="452" cy="205" rx="17" ry="6" className="fill-ink/25" />
          <ellipse cx="498" cy="205" rx="17" ry="6" className="fill-ink/25" />
          <path
            d="M 432 205 L 440 178 Q 444 168 456 168 L 494 168 Q 505 168 509 178 L 517 205 Z"
            className="fill-rust"
          />
          <rect x="452" y="174" width="44" height="17" rx="5" className="fill-paper" opacity="0.9" />
          <line x1="474" y1="188" x2="474" y2="205" className="stroke-ink/20" strokeWidth="1.5" />
          <path d="M 441 171 L 434 167 L 441 167 Z" className="fill-ink/40" />
          <circle cx="514" cy="192" r="3" className="fill-brass" />
          <Wheel cx={452} cy={228} r={16} />
          <Wheel cx={498} cy={228} r={16} />
        </motion.g>
      </motion.g>

      {/* Tri-State origin marker */}
      <g className="text-ink">
        <circle cx="40" cy="248" r="5" fill="currentColor" />
        <text x="40" y="272" textAnchor="middle" className="fill-ink font-display text-[13px] uppercase tracking-signage">
          Tri-State
        </text>
      </g>
    </svg>
  );
}
