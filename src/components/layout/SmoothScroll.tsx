"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/smooth";

/**
 * Inertial smooth scrolling (Lenis), driven by GSAP's ticker so
 * ScrollTrigger scrubs stay perfectly in sync. Disabled for reduced motion and touch.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch screens already have native momentum scrolling; Lenis would only add work.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      anchors: { offset: -80 },
      autoRaf: false,
    });
    setLenis(lenis);
    document.documentElement.style.scrollBehavior = "auto";

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return null;
}
