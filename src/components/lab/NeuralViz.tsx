"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Canvas neural network with forward-pass activation waves.
 * Pauses when off-screen and draws a single still frame for reduced motion.
 */
export function NeuralViz({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const layers = [5, 8, 8, 6, 3];
    let w = 0;
    let h = 0;
    let nodes: { x: number; y: number; l: number }[] = [];
    const weights = new Map<string, number>();

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = layers.flatMap((n, l) =>
        Array.from({ length: n }, (_, i) => ({
          x: (w * (l + 0.5)) / layers.length,
          y: (h * (i + 1)) / (n + 1),
          l,
        })),
      );
      nodes.forEach((a, i) =>
        nodes.forEach((b, j) => {
          if (b.l === a.l + 1) weights.set(`${i}-${j}`, ((i * 7 + j * 13) % 10) / 10);
        }),
      );
    };

    let raf = 0;
    let running = false;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      // A wave travels across layers every 2.4s
      const wave = (t % 2.4) / 2.4 * (layers.length + 1) - 0.5;
      ctx.clearRect(0, 0, w, h);

      nodes.forEach((a, i) =>
        nodes.forEach((b, j) => {
          if (b.l !== a.l + 1) return;
          const wgt = weights.get(`${i}-${j}`) ?? 0;
          const active = Math.max(0, 1 - Math.abs(wave - (a.l + 0.5)) * 1.6);
          ctx.strokeStyle = `rgba(139,123,255,${0.05 + wgt * 0.08 + active * wgt * 0.5})`;
          ctx.lineWidth = 0.6 + active * wgt * 1.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }),
      );

      nodes.forEach((n, i) => {
        const act = Math.max(0, 1 - Math.abs(wave - n.l) * 1.4) * (0.5 + 0.5 * Math.sin(i * 1.7 + t));
        const r = 4 + act * 3;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        g.addColorStop(0, `rgba(124,247,255,${0.25 + act * 0.6})`);
        g.addColorStop(1, "rgba(124,247,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = act > 0.3 ? "#eafcff" : "#6b7385";
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      if (running) raf = requestAnimationFrame(draw);
    };

    layout();
    const ro = new ResizeObserver(() => {
      layout();
      if (!running) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !reduced;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(draw);
      else draw(start + 900);
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
