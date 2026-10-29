"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDeviceTier } from "@/lib/hooks";

const MorphField = dynamic(() => import("./MorphField"), { ssr: false });

/** Fixed full-page particle canvas; renders only after the hero scrolls away. */
export function MorphFieldMount() {
  const tier = useDeviceTier();
  const [active, setActive] = useState(false);
  // Latched: the particle bundle is only fetched once the visitor first scrolls past the hero.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.3;
      setActive(past);
      if (past) setMounted(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if ((tier !== "low" && tier !== "high") || !mounted) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-60">
      <MorphField tier={tier} active={active} />
    </div>
  );
}
