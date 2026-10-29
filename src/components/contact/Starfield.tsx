"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** 2D canvas starfield that drifts toward the viewer and leans away from the cursor. */
export function Starfield({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    const COUNT = 260;
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
      hue: Math.random(),
    }));
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    let raf = 0;
    let running = false;
    const frame = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        if (!reduced) {
          s.z -= 0.0025;
          if (s.z <= 0.02) {
            s.z = 1;
            s.x = Math.random() * 2 - 1;
            s.y = Math.random() * 2 - 1;
          }
        }
        const k = 0.5 / s.z;
        const x = w / 2 + (s.x - mouse.x * 0.15 * (1 - s.z)) * k * w * 0.5;
        const y = h / 2 + (s.y - mouse.y * 0.15 * (1 - s.z)) * k * h * 0.5;
        if (x < 0 || x > w || y < 0 || y > h) continue;
        const size = (1 - s.z) * 2.2;
        const alpha = Math.min(1, (1 - s.z) * 1.4);
        ctx.fillStyle =
          s.hue < 0.33
            ? `rgba(124,247,255,${alpha})`
            : s.hue < 0.66
              ? `rgba(139,123,255,${alpha})`
              : `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !reduced;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(frame);
      else frame();
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
