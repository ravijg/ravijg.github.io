"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TbEye, TbScan, TbTextRecognition, TbVectorTriangle } from "react-icons/tb";
import { cn } from "@/lib/utils";

type Kind = "roll" | "bag" | "pipe";
type Item = { id: string; kind: Kind; color: string; code: string };

// Fictional catalogue — illustrates the search, not real products.
const CATALOG: Record<string, Item> = {
  r1: { id: "r1", kind: "roll", color: "#7cf7ff", code: "RL-210" },
  r2: { id: "r2", kind: "roll", color: "#60a5fa", code: "RL-214" },
  r3: { id: "r3", kind: "roll", color: "#a78bfa", code: "RL-305" },
  r4: { id: "r4", kind: "roll", color: "#38bdf8", code: "RL-210B" },
  b1: { id: "b1", kind: "bag", color: "#fbbf24", code: "BG-25K" },
  b2: { id: "b2", kind: "bag", color: "#f59e0b", code: "BG-50K" },
  b3: { id: "b3", kind: "bag", color: "#fb923c", code: "BG-25S" },
  b4: { id: "b4", kind: "bag", color: "#fcd34d", code: "BG-10K" },
  p1: { id: "p1", kind: "pipe", color: "#4ade80", code: "PP-110" },
  p2: { id: "p2", kind: "pipe", color: "#34d399", code: "PP-160" },
  p3: { id: "p3", kind: "pipe", color: "#a3e635", code: "PP-110L" },
  p4: { id: "p4", kind: "pipe", color: "#2dd4bf", code: "PP-090" },
};

const QUERIES: { item: Item; results: { id: string; visual: number; text: number }[] }[] = [
  {
    item: { id: "q1", kind: "roll", color: "#5eead4", code: "RL-210" },
    results: [
      { id: "r1", visual: 0.94, text: 1 },
      { id: "r4", visual: 0.91, text: 0.86 },
      { id: "r2", visual: 0.88, text: 0.71 },
      { id: "r3", visual: 0.79, text: 0.43 },
    ],
  },
  {
    item: { id: "q2", kind: "bag", color: "#fbbf24", code: "BG-25K" },
    results: [
      { id: "b1", visual: 0.96, text: 1 },
      { id: "b3", visual: 0.9, text: 0.83 },
      { id: "b2", visual: 0.87, text: 0.67 },
      { id: "b4", visual: 0.82, text: 0.5 },
    ],
  },
  {
    item: { id: "q3", kind: "pipe", color: "#4ade80", code: "PP-110" },
    results: [
      { id: "p1", visual: 0.95, text: 1 },
      { id: "p3", visual: 0.92, text: 0.86 },
      { id: "p2", visual: 0.85, text: 0.67 },
      { id: "p4", visual: 0.81, text: 0.5 },
    ],
  },
];

const STEPS = [
  { icon: TbScan, label: "YOLO11n", note: "detect & crop" },
  { icon: TbVectorTriangle, label: "DINOv2-Base", note: "visual embedding" },
  { icon: TbTextRecognition, label: "EasyOCR", note: "read on-product text" },
  { icon: TbEye, label: "Rank", note: "top-4 similar" },
];

function Product({ item, className }: { item: Item; className?: string }) {
  const c = item.color;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <rect width="100" height="100" fill="#0b0d14" />
      {item.kind === "roll" && (
        <g>
          <circle cx="50" cy="46" r="28" fill={c} fillOpacity=".25" stroke={c} strokeWidth="2" />
          <circle cx="50" cy="46" r="18" fill="none" stroke={c} strokeOpacity=".6" />
          <circle cx="50" cy="46" r="8" fill="#0b0d14" stroke={c} />
        </g>
      )}
      {item.kind === "bag" && (
        <path d="M30 26h40l6 10-4 44H28l-4-44z" fill={c} fillOpacity=".25" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      )}
      {item.kind === "pipe" && (
        <g>
          <rect x="18" y="34" width="64" height="24" rx="4" fill={c} fillOpacity=".25" stroke={c} strokeWidth="2" />
          <ellipse cx="82" cy="46" rx="5" ry="12" fill="#0b0d14" stroke={c} strokeWidth="2" />
        </g>
      )}
      <rect x="26" y="80" width="48" height="12" rx="3" fill="#000" fillOpacity=".5" />
      <text x="50" y="89" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#fff">
        {item.code}
      </text>
    </svg>
  );
}

export function VisualSearchDemo() {
  const [q, setQ] = useState(0);
  const [step, setStep] = useState(0);
  // Only run the pipeline once the demo is actually on screen — otherwise it
  // animates invisibly during page load and competes with it on phones.
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-80px" });
  const query = QUERIES[q];

  // Play the pipeline each time a query is chosen.
  useEffect(() => {
    if (!inView || step >= STEPS.length) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 300 : 650);
    return () => window.clearTimeout(t);
  }, [step, inView]);

  const choose = (i: number) => {
    setQ(i);
    setStep(0);
  };
  const done = step >= STEPS.length;

  return (
    <div ref={root} className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
      <div className="rounded-2xl border border-line bg-black/30 p-4 sm:p-6">
        <p className="mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">Query image</p>
        <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl border border-line">
          <Product item={query.item} className="size-full" />
          {/* YOLO crop box */}
          <motion.div
            key={`crop-${q}`}
            className="absolute rounded-md border-2 border-warn"
            initial={{ top: "2%", right: "2%", bottom: "2%", left: "2%", opacity: 0 }}
            animate={
              step >= 1
                ? { top: "14%", right: "12%", bottom: "22%", left: "12%", opacity: 1 }
                : { top: "2%", right: "2%", bottom: "2%", left: "2%", opacity: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            <span className="absolute -top-5 left-0 rounded bg-warn px-1 font-mono text-[9px] font-bold text-bg">
              {query.item.kind} 0.97
            </span>
          </motion.div>
          {/* Scan line */}
          {inView && !done && (
            <motion.div
              className="absolute inset-x-0 h-px bg-signal-1 shadow-[0_0_12px_2px_var(--signal-1)]"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>

        <div className="mt-5 flex justify-center gap-2" role="radiogroup" aria-label="Choose a query image">
          {QUERIES.map((qq, i) => (
            <button
              key={qq.item.id}
              type="button"
              role="radio"
              aria-checked={i === q}
              aria-label={`Search with ${qq.item.kind} ${qq.item.code}`}
              onClick={() => choose(i)}
              className={cn(
                "size-14 overflow-hidden rounded-xl border-2 transition-all",
                i === q ? "scale-105 border-signal-1" : "border-line opacity-60 hover:opacity-100",
              )}
            >
              <Product item={qq.item} className="size-full" />
            </button>
          ))}
        </div>

        <ol className="mt-6 space-y-2">
          {STEPS.map((s, i) => {
            const state = step > i ? "done" : step === i ? "run" : "wait";
            return (
              <li key={s.label} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg border transition-colors duration-300",
                    state === "done" && "border-signal-1/50 bg-signal-1/10 text-signal-1",
                    state === "run" && "animate-pulse border-signal-2 text-signal-2",
                    state === "wait" && "border-line text-fg-subtle",
                  )}
                >
                  <s.icon aria-hidden />
                </span>
                <span className={state === "wait" ? "text-fg-subtle" : "text-fg"}>{s.label}</span>
                <span className="text-xs text-fg-subtle">{s.note}</span>
                {i === 1 && step > 1 && (
                  <span className="ml-auto flex h-4 items-end gap-px" aria-hidden>
                    {Array.from({ length: 14 }, (_, k) => (
                      <motion.span
                        key={k}
                        className="h-[15px] w-0.5 origin-bottom rounded-sm bg-signal-2"
                        initial={{ scaleY: 0.07 }}
                        animate={{ scaleY: (3 + ((k * 7 + q * 5) % 12)) / 15 }}
                      />
                    ))}
                  </span>
                )}
                {i === 2 && step > 2 && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto font-mono text-xs text-warn">
                    “{query.item.code}”
                  </motion.span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-2xl border border-line bg-black/30 p-4 sm:p-6" aria-live="polite">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs tracking-widest text-fg-subtle uppercase">Top-4 similar</p>
          <p className="font-mono text-[11px] text-fg-subtle">visual · text</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {done &&
              query.results.map((r, i) => {
                const item = CATALOG[r.id];
                return (
                  <motion.div
                    key={`${q}-${r.id}`}
                    initial={{ opacity: 0, y: 16, rotateX: -25, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformPerspective: 800 }}
                    className={cn("overflow-hidden rounded-xl border bg-bg-elevated", i === 0 ? "border-signal-1/60" : "border-line")}
                  >
                    <div className="relative aspect-[4/3]">
                      <Product item={item} className="size-full" />
                      <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px]">#{i + 1}</span>
                    </div>
                    <div className="space-y-1.5 p-3">
                      {[
                        ["visual", r.visual, "var(--signal-1)"],
                        ["text", r.text, "var(--warn)"],
                      ].map(([label, v, color]) => (
                        <div key={label as string} className="flex items-center gap-2 font-mono text-[10px] text-fg-subtle">
                          <span className="w-9">{label}</span>
                          <span className="h-1 flex-1 overflow-hidden rounded-full bg-surface-strong">
                            <motion.span
                              className="block h-full origin-left rounded-full"
                              style={{ background: color as string }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: v as number }}
                              transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                            />
                          </span>
                          <span className="w-7 text-right text-fg-muted">{(v as number).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
          {!done &&
            Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="aspect-[4/3.9] animate-pulse rounded-xl border border-dashed border-line bg-surface" />
            ))}
        </div>
      </div>
    </div>
  );
}
