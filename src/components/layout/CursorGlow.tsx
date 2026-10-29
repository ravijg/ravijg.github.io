"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Writes the cursor position into --mx/--my (consumed by `.spotlight`)
 * and renders a soft trailing glow orb. Mouse users only.
 */
export function CursorGlow() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const orb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      root.style.setProperty("--mx", `${tx}px`);
      root.style.setProperty("--my", `${ty}px`);
      if (!raf && !reduced) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      if (orb.current) orb.current.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div
      ref={orb}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[1] size-[400px] rounded-full opacity-60 mix-blend-screen blur-3xl"
      style={{
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--signal-1) 18%, transparent), transparent 70%)",
      }}
    />
  );
}
