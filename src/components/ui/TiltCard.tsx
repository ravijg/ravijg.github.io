"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number;
};

/**
 * 3D hover tilt with a cursor-tracking spotlight (.card-spot).
 * Tilt is disabled on touch devices where it would feel janky.
 */
export function TiltCard({ children, className, max = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 20 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--cx", `${x * 100}%`);
    el.style.setProperty("--cy", `${y * 100}%`);
    if (fine) {
      px.set(x);
      py.set(y);
    }
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("card-spot relative will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
