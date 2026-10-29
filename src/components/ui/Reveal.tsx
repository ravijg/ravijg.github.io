"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cards rise and swing up from a 3D tilt — used for staggered grids. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48, rotateX: -22, scale: 0.96, transformPerspective: 1100 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transformPerspective: 1100,
    transition: { duration: 1, ease: EASE },
  },
};

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "p" | "span";
};

/** Fade + rise + de-blur on scroll into view. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: EASE, delay },
        },
      }}
    >
      {children}
    </Comp>
  );
}

/** Container that staggers any `motion` children using the `fadeUp` variant. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  as = "div",
}: RevealProps & { gap?: number }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger(gap, delay)}
    >
      {children}
    </Comp>
  );
}
