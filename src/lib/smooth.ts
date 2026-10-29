"use client";

import type Lenis from "lenis";

/** Shared handle to the Lenis instance created by <SmoothScroll />. */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

/** Pause smooth scrolling (e.g. while a modal is open). */
export const lockScroll = (locked: boolean) => {
  if (locked) instance?.stop();
  else instance?.start();
};

/** Scroll to a selector, using Lenis when active so the motion matches. */
export function scrollToTarget(selector: string, offset = -80) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
