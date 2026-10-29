"use client";

import { useEffect, useRef, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Custom cursor: a precise dot plus a lagging ring that grows over interactive
 * elements and morphs into a labelled pill over anything with `data-cursor`
 * (or when 3D objects set `document.body.dataset.cursor`).
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let scale = 1;
    let targetScale = 1;
    let pressed = false;
    let hidden = false;
    let raf = 0;
    let currentLabel = "";

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = e.target as Element | null;
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      const next = tagged?.dataset.cursor || document.body.dataset.cursor || "";
      if (next !== currentLabel) {
        currentLabel = next;
        setLabel(next);
      }
      const interactive = el?.closest("a, button, [role='tab'], [role='radio'], input, textarea, label");
      const typing = el?.closest("input, textarea");
      targetScale = next ? 0 : typing ? 0.4 : interactive ? 2.2 : 1;
      if (hidden) {
        hidden = false;
        root.classList.remove("cursor-hidden");
      }
    };
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);
    const onLeave = () => {
      hidden = true;
      root.classList.add("cursor-hidden");
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      scale += ((pressed ? targetScale * 0.75 : targetScale) - scale) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      const follow = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `${follow} scale(${scale.toFixed(3)})`;
      if (pill.current) pill.current.style.transform = follow;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor", "cursor-hidden");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  // Separate top-level fixed elements so mix-blend-difference blends with the page.
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] size-9 rounded-full border border-white/70 mix-blend-difference transition-opacity duration-200"
        style={{ opacity: label ? 0 : 1 }}
      />
      <div ref={pill} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[100]">
        <div
          className="flex h-[72px] min-w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-signal-1 via-signal-2 to-signal-3 px-4 font-mono text-[11px] font-bold tracking-wider whitespace-nowrap text-bg uppercase shadow-[0_10px_40px_-6px_rgba(139,123,255,.8)] transition-[scale,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ scale: label ? 1 : 0.2, opacity: label ? 1 : 0 }}
        >
          {label}
        </div>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 rounded-full bg-white mix-blend-difference"
      />
    </>
  );
}
