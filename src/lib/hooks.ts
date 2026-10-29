"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

/** SSR-safe media query hook. Returns `fallback` on the server. */
export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export type DeviceTier = "pending" | "none" | "low" | "high";

/**
 * Decides whether the WebGL scene should render and at what fidelity.
 * - "none": reduced motion, no WebGL, or data-saver → static fallback
 * - "low":  touch / few cores / low memory → lighter scene
 * - "high": everything on
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("pending");

  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = nav.connection?.saveData === true;

    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }

    let next: DeviceTier;
    if (reduced || saveData || !webgl) next = "none";
    else {
      const cores = nav.hardwareConcurrency ?? 4;
      const memory = nav.deviceMemory ?? 8;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      next = cores <= 4 || memory <= 4 || coarse ? "low" : "high";
    }
    // Deferred to idle so the 3D bundle never competes with first paint.
    const ric =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = ric(() => setTier(next));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, []);

  return tier;
}

/** True once the element has entered the viewport (one-shot) or while visible. */
export function useInView<T extends Element>(
  ref: React.RefObject<T | null>,
  { once = false, rootMargin = "0px" }: { once?: boolean; rootMargin?: string } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin]);
  return inView;
}

/**
 * Becomes true on the visitor's first interaction (touch, scroll, mouse move,
 * key) or after `fallbackMs` (null = interaction only). Used to keep heavy 3D
 * work out of the initial page load, so the page is responsive immediately.
 */
export function useFirstInteraction(fallbackMs: number | null) {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    const go = () => setStarted(true);
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const timer = fallbackMs === null ? 0 : window.setTimeout(go, fallbackMs);
    return () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.clearTimeout(timer);
    };
  }, [fallbackMs]);
  return started;
}
