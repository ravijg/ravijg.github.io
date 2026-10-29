"use client";

import { useEffect, useRef } from "react";
import type { Skill } from "@/data/resume";
import { TechIcon, techColor } from "@/components/ui/TechIcon";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = { skills: Skill[]; onFocusSkill: (s: Skill | null) => void };

/**
 * Draggable 3D sphere of skill logos. Points sit on a Fibonacci sphere; each
 * frame we rotate them and project to 2D, using depth for scale, opacity and
 * stacking — no WebGL context needed, and every item stays a real button.
 */
export function SkillSphere({ skills, onFocusSkill }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const n = skills.length;
    const base = skills.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return [Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi)];
    });

    let radius = 200;
    let compact = 1;
    let rotX = -0.3;
    let rotY = 0;
    let velX = 0;
    let velY = reduced ? 0 : 0.0035;
    let dragging = false;
    let hovering = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let visible = false;

    const resize = () => {
      // Narrow screens: tighter orbit and smaller pills so labels never clip.
      compact = el.clientWidth < 460 ? 0.72 : 1;
      radius = Math.min(el.clientWidth, el.clientHeight) * (compact < 1 ? 0.34 : 0.4);
    };

    const render = () => {
      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      base.forEach(([x, y, z], i) => {
        // rotate around Y then X
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 back … 1 front
        const node = items.current[i];
        if (!node) return;
        const scale = (0.55 + depth * 0.65) * compact;
        node.style.transform = `translate3d(${x1 * radius}px, ${y2 * radius}px, 0) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = String(0.2 + depth * 0.8);
        node.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const tick = () => {
      if (!dragging) {
        // Ease back to a gentle idle spin; slow down while the visitor is reading.
        const idle = reduced ? 0 : hovering ? 0.0008 : 0.0035;
        velY += (idle - velY) * 0.02;
        velX += (0 - velX) * 0.04;
      }
      rotY += velY;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + velX));
      render();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      velY = (e.clientX - lastX) * 0.005;
      velX = -(e.clientY - lastY) * 0.005;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => (dragging = false);
    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);

    resize();
    render();
    const ro = new ResizeObserver(() => {
      resize();
      render();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [skills, reduced]);

  return (
    <div
      ref={stage}
      data-cursor="Drag"
      className="relative aspect-square w-full max-w-[520px] touch-pan-y select-none"
      role="group"
      aria-label="Interactive sphere of skills — drag to rotate"
    >
      {/* Orbital guides */}
      <div aria-hidden className="absolute inset-[8%] rounded-full border border-line" />
      <div aria-hidden className="absolute inset-[8%] rotate-[60deg] scale-y-[0.3] rounded-full border border-signal-2/25" />
      <div aria-hidden className="absolute inset-[8%] -rotate-[30deg] scale-y-[0.3] rounded-full border border-signal-1/20" />
      <div
        aria-hidden
        className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,rgba(139,123,255,.35),rgba(124,247,255,.08)_45%,transparent_70%)] blur-xl"
      />
      <div className="absolute top-1/2 left-1/2">
        {skills.map((s, i) => (
          <button
            key={s.id}
            ref={(node) => {
              items.current[i] = node;
            }}
            type="button"
            onMouseEnter={() => onFocusSkill(s)}
            onMouseLeave={() => onFocusSkill(null)}
            onFocus={() => onFocusSkill(s)}
            onBlur={() => onFocusSkill(null)}
            className="glass absolute top-0 left-0 flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5 text-xs font-medium whitespace-nowrap will-change-transform hover:border-line-strong focus-visible:opacity-100"
            style={{ boxShadow: `0 0 24px -8px ${techColor(s.id)}` }}
          >
            <span className="grid size-7 place-items-center rounded-full bg-black/40 text-sm">
              <TechIcon id={s.id} />
            </span>
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
