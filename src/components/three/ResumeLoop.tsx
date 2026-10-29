"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/**
 * R3F does not restart its render loop when `frameloop` flips from "never" to
 * "always" on a canvas that mounted paused. Kicking it with invalidate() does.
 */
export function ResumeLoop({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  return null;
}
