"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TbPlayerPlay, TbRefresh } from "react-icons/tb";

type Entity = { text: string; label: string; key: string; color: string };

// Fictional sentence — illustrates the extraction task, not real data.
const SENTENCE =
  "In the Phase III study, adults with type 2 diabetes received metformin 500 mg twice daily, and HbA1c improved after 24 weeks.";

const ENTITIES: Entity[] = [
  { text: "Phase III", label: "TRIAL_PHASE", key: "trial_phase", color: "#fbbf24" },
  { text: "type 2 diabetes", label: "CONDITION", key: "condition", color: "#ff7ad9" },
  { text: "metformin", label: "DRUG", key: "drug", color: "#7cf7ff" },
  { text: "500 mg", label: "DOSAGE", key: "dosage", color: "#8b7bff" },
  { text: "twice daily", label: "FREQUENCY", key: "frequency", color: "#4ade80" },
  { text: "HbA1c", label: "BIOMARKER", key: "biomarker", color: "#fb923c" },
  { text: "24 weeks", label: "DURATION", key: "duration", color: "#38bdf8" },
];

/** Split the sentence into plain text and entity segments. */
function segments() {
  const out: (string | Entity)[] = [];
  let rest = SENTENCE;
  for (const e of ENTITIES) {
    const i = rest.indexOf(e.text);
    out.push(rest.slice(0, i), e);
    rest = rest.slice(i + e.text.length);
  }
  out.push(rest);
  return out;
}
const SEGMENTS = segments();

export function ExtractDemo() {
  const [step, setStep] = useState(-1);
  const running = step >= 0 && step < ENTITIES.length;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 450);
    return () => window.clearTimeout(t);
  }, [running, step]);

  const found = ENTITIES.slice(0, Math.max(0, step));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-line bg-black/30 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs tracking-widest text-fg-subtle uppercase">Unstructured input</p>
          <button
            type="button"
            onClick={() => setStep(step === -1 || step >= ENTITIES.length ? 0 : step)}
            disabled={running}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-opacity disabled:opacity-50"
          >
            {step >= ENTITIES.length ? <TbRefresh aria-hidden /> : <TbPlayerPlay aria-hidden />}
            {step >= ENTITIES.length ? "Run again" : running ? "Extracting…" : "Run extraction"}
          </button>
        </div>
        <p className="text-lg leading-[2.1]">
          {SEGMENTS.map((s, i) => {
            if (typeof s === "string") return <span key={i} className="text-fg-muted">{s}</span>;
            const on = found.includes(s);
            return (
              <span
                key={i}
                className="relative rounded-md px-1 transition-all duration-500"
                style={{
                  background: on ? `${s.color}22` : "transparent",
                  boxShadow: on ? `inset 0 -2px 0 ${s.color}` : "none",
                  color: on ? "#fff" : undefined,
                }}
              >
                {s.text}
                {on && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-4 left-0 font-mono text-[9px] font-bold tracking-wider whitespace-nowrap"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </motion.span>
                )}
              </span>
            );
          })}
        </p>
        <p className="mt-6 font-mono text-xs text-fg-subtle">
          pipeline: spaCy → custom NER → OpenAI LLM extraction · parallelised with multiprocessing
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-black/40 p-4 sm:p-6 font-mono text-sm" aria-live="polite">
        <p className="mb-4 text-xs tracking-widest text-fg-subtle uppercase">Structured output</p>
        <pre className="leading-7 whitespace-pre-wrap">
          <span className="text-fg-subtle">{"{"}</span>
          {"\n"}
          <AnimatePresence initial={false}>
            {found.map((e, i) => (
              <motion.span
                key={e.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="block pl-5"
              >
                <span style={{ color: e.color }}>&quot;{e.key}&quot;</span>
                <span className="text-fg-subtle">: </span>
                <span className="text-fg">&quot;{e.text}&quot;</span>
                {i < found.length - 1 && <span className="text-fg-subtle">,</span>}
              </motion.span>
            ))}
          </AnimatePresence>
          {found.length === 0 && <span className="block pl-5 text-fg-subtle">{"// press run"}</span>}
          <span className="text-fg-subtle">{"}"}</span>
        </pre>
      </div>
    </div>
  );
}
