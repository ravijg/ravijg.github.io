"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/hooks";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
  strength?: number;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">;

const styles: Record<Variant, string> = {
  primary:
    "bg-fg text-bg shadow-[0_0_0_1px_rgba(255,255,255,.2),0_10px_40px_-10px_rgba(124,247,255,.55)] hover:shadow-[0_0_0_1px_rgba(255,255,255,.3),0_14px_60px_-8px_rgba(139,123,255,.7)]",
  secondary: "glass text-fg hover:border-line-strong hover:bg-surface-strong",
  ghost: "text-fg-muted hover:text-fg",
};

/** Anchor that is gently pulled toward the cursor (fine pointers only). */
export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  strength = 0.35,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = useFinePointer();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[box-shadow,background-color,border-color,color] duration-300",
        styles[variant],
        className,
      )}
      {...(rest as object)}
    >
      {children}
    </motion.a>
  );
}
