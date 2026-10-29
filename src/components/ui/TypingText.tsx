"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  words: readonly string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
};

/** Cycles through `words` with a type / hold / delete rhythm. */
export function TypingText({ words, typeMs = 55, deleteMs = 28, holdMs = 1800 }: Props) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  // Start fully typed: the paragraph is complete at first paint (stable LCP), then the cycle begins.
  const [text, setText] = useState<string>(words[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const word = words[index % words.length];
    let t: number;
    if (!deleting && text === word) t = window.setTimeout(() => setDeleting(true), holdMs);
    else if (deleting && text === "") {
      t = window.setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }, 250);
    } else {
      t = window.setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteMs : typeMs,
      );
    }
    return () => window.clearTimeout(t);
  }, [text, deleting, index, words, typeMs, deleteMs, holdMs, reduced]);

  const shown = reduced ? words[0] : text;

  return (
    <span className="inline-flex items-baseline">
      {/* Screen readers get the full list once instead of a stream of edits. */}
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="text-fg">
        {shown}
      </span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-caret bg-signal-1"
      />
    </span>
  );
}
