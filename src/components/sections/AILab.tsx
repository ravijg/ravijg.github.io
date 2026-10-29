"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { NeuralViz } from "@/components/lab/NeuralViz";
import { ExtractDemo } from "@/components/lab/ExtractDemo";
import { PipelineDemo } from "@/components/lab/PipelineDemo";
import { TriageDemo } from "@/components/lab/TriageDemo";
import { VisualSearchDemo } from "@/components/lab/VisualSearchDemo";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "search",
    label: "Search",
    title: "Visual product search",
    caption: "How the product-similarity API crops, embeds and reads an image to return its 4 closest matches.",
    Demo: VisualSearchDemo,
  },
  {
    id: "extract",
    label: "Extract",
    title: "Medical entity extraction",
    caption: "How the Medical Information Extraction System turns prose into structured clinical data.",
    Demo: ExtractDemo,
  },
  {
    id: "retrieve",
    label: "Retrieve",
    title: "Retrieval-augmented generation",
    caption: "The DocumentReader / NEMO retrieval path, with relevance scoring trimming the context.",
    Demo: PipelineDemo,
  },
  {
    id: "converse",
    label: "Converse",
    title: "Intent detection & slot filling",
    caption: "How Triage-BOT decides what a patient wants and what it still needs to ask.",
    Demo: TriageDemo,
  },
] as const;

export function AILab() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("search");
  const uid = useId();
  const current = TABS.find((t) => t.id === tab)!;

  return (
    <section id="lab" aria-labelledby="lab-title" className="relative overflow-hidden px-6 py-28 md:py-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(139,123,255,.12),transparent_60%)]" />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
          <SectionHeading
            id="lab-title"
            index="05"
            eyebrow="AI Lab"
            title={
              <>
                Inside the <Em>models.</Em>
              </>
            }
            description="Interactive simulations of the techniques behind my production systems: visual search, extraction, retrieval and dialogue. Sample data is fictional and outputs are pre-computed for illustration."
          />
          <Reveal className="mb-14 md:mb-20">
            <div className="glass relative aspect-[16/10] overflow-hidden rounded-3xl">
              <NeuralViz className="absolute inset-0 size-full" />
              <div className="absolute bottom-3 left-4 flex gap-4 font-mono text-[10px] tracking-widest text-fg-subtle uppercase">
                <span>input</span>
                <span>→ hidden ×3 →</span>
                <span>output</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="glass ring-gradient rounded-3xl p-3 sm:p-4">
            <div role="tablist" aria-label="AI demos" className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-black/30 p-1 sm:flex">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  id={`${uid}-tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  aria-controls={`${uid}-panel`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
                    setTab(next.id);
                    document.getElementById(`${uid}-tab-${next.id}`)?.focus();
                  }}
                  className={cn(
                    "relative flex-1 rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                    tab === t.id ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId={`${uid}-tab`}
                      className="absolute inset-0 rounded-xl bg-surface-strong ring-1 ring-line-strong"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    <span className="mr-2 font-mono text-xs text-fg-subtle">0{i + 1}</span>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>

            <div
              id={`${uid}-panel`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${tab}`}
              className="p-2 sm:p-4"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold tracking-tight">{current.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{current.caption}</p>
                  </div>
                  <current.Demo />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
