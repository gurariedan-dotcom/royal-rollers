"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Scroll-entrance wrapper -- replays every time a section crosses the
// viewport edge in either direction. Honors reduced-motion by skipping
// straight to the settled state.
export default function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  as = "div",
  hover = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li";
  hover?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={
        hover && !reduce
          ? { y: -8, scale: 1.04, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
          : undefined
      }
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
