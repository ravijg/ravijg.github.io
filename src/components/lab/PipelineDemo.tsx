"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  TbBrain,
  TbDatabase,
  TbFileText,
  TbMessage2Check,
  TbScissors,
  TbSortDescending,
  TbVectorTriangle,
} from "react-icons/tb";
import { useInView } from "@/lib/hooks";
import { usePrefersReducedMotion } from "@/lib/hooks";

const STAGES = [
  { icon: TbFileText, label: "Documents", note: "PDFs, research, manuals" },
  { icon: TbScissors, label: "Chunk", note: "Split into passages" },
  { icon: TbVectorTriangle, label: "Embed", note: "Vector embeddings" },
  { icon: TbDatabase, label: "ChromaDB / FAISS", note: "Semantic index" },
  { icon: TbSortDescending, label: "Rank", note: "Relevance scoring" },
  { icon: TbBrain, label: "LLM", note: "Context-aware answer" },
  { icon: TbMessage2Check, label: "Answer", note: "Grounded in context" },
];

// Illustrative relevance scores for the top-k retrieved chunks.
const CHUNKS = [
  { id: "chunk_14", score: 0.91 },
  { id: "chunk_03", score: 0.84 },
  { id: "chunk_27", score: 0.77 },
  { id: "chunk_09", score: 0.42 },
  { id: "chunk_31", score: 0.28 },
];
const THRESHOLD = 0.6;

export function PipelineDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!visible || reduced) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % STAGES.length), 1100);
    return () => window.clearInterval(t);
  }, [visible, reduced]);

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-line bg-black/30 p-4 sm:p-6">
        <p className="mb-6 font-mono text-xs tracking-widest text-fg-subtle uppercase">RAG pipeline · data flow</p>
        <ol className="relative grid gap-3 sm:grid-cols-7 sm:gap-2">
          {/* Connector rail */}
          <span aria-hidden className="absolute top-6 right-[7%] left-[7%] hidden h-px bg-line sm:block" />
          <motion.span
            aria-hidden
            className="absolute top-[22px] hidden size-1.5 rounded-full bg-signal-1 shadow-[0_0_12px_4px_var(--signal-1)] sm:block"
            animate={{ left: `${7 + (active / (STAGES.length - 1)) * 86}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {STAGES.map((s, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <li key={s.label} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
                <motion.span
                  animate={{ scale: on ? 1.1 : 1 }}
                  className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl border text-xl transition-colors duration-500"
                  style={{
                    borderColor: on ? "var(--signal-1)" : done ? "rgba(139,123,255,.5)" : "var(--border)",
                    background: on ? "rgba(124,247,255,.12)" : "var(--bg-elevated)",
                    color: on ? "var(--signal-1)" : done ? "var(--signal-2)" : "var(--fg-subtle)",
                    boxShadow: on ? "0 0 30px -4px rgba(124,247,255,.5)" : "none",
                  }}
                >
                  <s.icon aria-hidden />
                </motion.span>
                <span>
                  <span className={`block text-xs font-medium ${on ? "text-fg" : "text-fg-muted"}`}>{s.label}</span>
                  <span className="block text-[11px] text-fg-subtle sm:hidden lg:block">{s.note}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-2xl border border-line bg-black/30 p-4 sm:p-6">
        <p className="mb-1 font-mono text-xs tracking-widest text-fg-subtle uppercase">Top-k relevance</p>
        <p className="mb-5 text-xs text-fg-subtle">
          Only chunks above the threshold reach the prompt — fewer tokens, sharper answers.
        </p>
        <ul className="space-y-3">
          {CHUNKS.map((c, i) => {
            const pass = c.score >= THRESHOLD;
            return (
              <li key={c.id} className="font-mono text-xs">
                <div className="mb-1 flex justify-between">
                  <span className={pass ? "text-fg" : "text-fg-subtle line-through"}>{c.id}</span>
                  <span className={pass ? "text-signal-1" : "text-fg-subtle"}>{c.score.toFixed(2)}</span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-surface-strong">
                  <motion.div
                    className="h-full origin-left rounded-full"
                    style={{
                      background: pass
                        ? "linear-gradient(90deg,var(--signal-1),var(--signal-2))"
                        : "rgba(255,255,255,.18)",
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: c.score }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span
                    aria-hidden
                    className="absolute top-0 bottom-0 w-px bg-warn"
                    style={{ left: `${THRESHOLD * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex items-center gap-2 font-mono text-[11px] text-fg-subtle">
          <span className="inline-block h-3 w-px bg-warn" /> relevance threshold {THRESHOLD}
        </p>
      </div>
    </div>
  );
}
