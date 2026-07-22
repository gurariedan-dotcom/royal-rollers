"use client";

import { motion, useReducedMotion } from "motion/react";

// The signature hero visual: a flatbed carrier hauling two cars, with a
// solo "Personal Driver" car out ahead on the same road -- a literal,
// moving picture of the site's core choice (Carrier Transport vs. Personal
// Driver) instead of an abstract diagram. Carrier elements use the
// "highway" teal, the solo car uses the "rust" copper, matching the color
// coding used everywhere else on the site (homepage cards, service pages).
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

  const Wheel = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
    <motion.g style={{ originX: `${cx}px`, originY: `${cy}px` }} {...wheelSpin}>
      <circle cx={cx} cy={cy} r={r} className="fill-ink" />
      <circle cx={cx} cy={cy} r={r * 0.4} className="fill-brass" />
      <rect x={cx - 1} y={cy - r} width="2" height={r * 2} className="fill-paper" opacity="0.5" />
      <rect x={cx - r} y={cy - 1} width={r * 2} height="2" className="fill-paper" opacity="0.5" />
    </motion.g>
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

          {/* car 1 (teal, carrier-branded) */}
          <path d="M 100 192 L 106 168 Q 110 160 120 160 L 152 160 Q 162 160 166 168 L 172 192 Z" className="fill-highway" />
          <rect x="118" y="166" width="36" height="14" rx="4" className="fill-paper" opacity="0.9" />

          {/* car 2 (neutral) */}
          <path d="M 184 192 L 190 170 Q 193 163 202 163 L 228 163 Q 237 163 240 170 L 246 192 Z" className="fill-ink/70" />
          <rect x="200" y="168" width="32" height="13" rx="4" className="fill-paper" opacity="0.9" />

          {/* tractor cab */}
          <rect x="278" y="150" width="58" height="58" rx="8" className="fill-ink" />
          <rect x="286" y="158" width="26" height="20" rx="3" className="fill-paper" opacity="0.9" />
          <rect x="278" y="203" width="58" height="4" className="fill-brass" />
          <circle cx="330" cy="210" r="4" className="fill-brass" />

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
          <path
            d="M 432 205 L 440 178 Q 444 168 456 168 L 494 168 Q 505 168 509 178 L 517 205 Z"
            className="fill-rust"
          />
          <rect x="452" y="174" width="44" height="17" rx="5" className="fill-paper" opacity="0.9" />
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
