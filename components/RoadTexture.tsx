"use client";

import { motion, useReducedMotion } from "motion/react";

// A large-scale, drifting version of the site's dashed route-rule motif --
// used as a full-bleed background texture instead of a stock photo, so the
// "motion" in a photo-free band still reads as "the road, moving."
export default function RoadTexture() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(-35deg, #F2F2F0 0, #F2F2F0 3px, transparent 3px, transparent 46px)",
        backgroundSize: "260px 260px",
      }}
      animate={reduce ? {} : { backgroundPositionX: [0, 260] }}
      transition={reduce ? {} : { duration: 6, repeat: Infinity, ease: "linear" }}
    />
  );
}
