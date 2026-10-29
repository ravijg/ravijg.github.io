"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TbCircleCheck, TbCircleDashed } from "react-icons/tb";
import { cn } from "@/lib/utils";

type Sample = {
  message: string;
  intents: { name: string; p: number }[];
  slots: { name: string; value: string | null }[];
  next: string;
  priority: { level: string; color: string };
};

// Illustrative conversation turns showing intent detection + slot filling.
const SAMPLES: Sample[] = [
  {
    message: "I've had a high fever and chest pain since last night",
    intents: [
      { name: "report_symptom", p: 0.93 },
      { name: "book_appointment", p: 0.04 },
      { name: "general_query", p: 0.03 },
    ],
    slots: [
      { name: "symptom", value: "fever, chest pain" },
      { name: "duration", value: "since last night" },
      { name: "severity", value: null },
    ],
    next: "On a scale of 1–10, how severe is the chest pain?",
    priority: { level: "Urgent", color: "#fb7185" },
  },
  {
    message: "Can I see a dermatologist next Tuesday?",
    intents: [
      { name: "book_appointment", p: 0.89 },
      { name: "general_query", p: 0.08 },
      { name: "report_symptom", p: 0.03 },
    ],
    slots: [
      { name: "specialty", value: "dermatology" },
      { name: "date", value: "next Tuesday" },
      { name: "time", value: null },
    ],
    next: "Morning or afternoon works better for you?",
    priority: { level: "Routine", color: "#4ade80" },
  },
  {
    message: "Mild headache for 3 days, about a 4 out of 10",
    intents: [
      { name: "report_symptom", p: 0.95 },
      { name: "general_query", p: 0.03 },
      { name: "book_appointment", p: 0.02 },
    ],
    slots: [
      { name: "symptom", value: "headache" },
      { name: "duration", value: "3 days" },
      { name: "severity", value: "4 / 10" },
    ],
    next: "All slots filled → routing to assessment workflow.",
    priority: { level: "Standard", color: "#fbbf24" },
  },
];

export function TriageDemo() {
  const [idx, setIdx] = useState(0);
  const s = SAMPLES[idx];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border border-line bg-black/30 p-4 sm:p-6">
        <p className="mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">Pick a patient message</p>
        <div className="space-y-2" role="radiogroup" aria-label="Sample messages">
          {SAMPLES.map((m, i) => (
            <button
              key={m.message}
              type="button"
              role="radio"
              aria-checked={i === idx}
              onClick={() => setIdx(i)}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                i === idx
                  ? "border-signal-2/60 bg-signal-2/10 text-fg"
                  : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
              )}
            >
              “{m.message}”
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl rounded-tl-sm bg-surface-strong p-4 text-sm"
          >
            <p className="mb-1 font-mono text-[10px] tracking-widest text-signal-1 uppercase">Bot · next turn</p>
            {s.next}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid gap-6 rounded-2xl border border-line bg-black/30 p-4 sm:p-6" aria-live="polite">
        <div>
          <p className="mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">Intent prediction</p>
          <ul className="space-y-3">
            {s.intents.map((it, i) => (
              <li key={it.name} className="font-mono text-xs">
                <div className="mb-1 flex justify-between">
                  <span className={i === 0 ? "text-fg" : "text-fg-muted"}>{it.name}</span>
                  <span className={i === 0 ? "text-signal-1" : "text-fg-subtle"}>{(it.p * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
                  <motion.div
                    key={`${idx}-${it.name}`}
                    className="h-full origin-left rounded-full"
                    style={{
                      background: i === 0 ? "linear-gradient(90deg,var(--signal-2),var(--signal-3))" : "rgba(255,255,255,.2)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: it.p }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest text-fg-subtle uppercase">Slot filling</p>
            <motion.span
              key={`p-${idx}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.6 } }}
              className="rounded-full px-3 py-1 font-mono text-[11px] font-bold"
              style={{ background: `${s.priority.color}22`, color: s.priority.color }}
            >
              priority: {s.priority.level}
            </motion.span>
          </div>
          <ul className="grid gap-2 sm:grid-cols-3">
            {s.slots.map((sl, i) => (
              <motion.li
                key={`${idx}-${sl.name}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.12 } }}
                className={cn(
                  "rounded-xl border p-3",
                  sl.value ? "border-ok/40 bg-ok/5" : "border-dashed border-line-strong",
                )}
              >
                <p className="flex items-center gap-1.5 font-mono text-[11px] text-fg-subtle">
                  {sl.value ? <TbCircleCheck className="text-ok" aria-hidden /> : <TbCircleDashed aria-hidden />}
                  {sl.name}
                </p>
                <p className={cn("mt-1 text-sm", sl.value ? "text-fg" : "text-fg-subtle italic")}>
                  {sl.value ?? "asking…"}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
