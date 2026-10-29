"use client";

import { AnimatePresence, LayoutGroup, motion, useInView, type Variants } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { TbArrowUpRight } from "react-icons/tb";
import { projectKinds, projects, type Project, type ProjectKind } from "@/data/resume";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { ProjectArt } from "@/components/projects/ProjectArt";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { cn } from "@/lib/utils";

/** Bento spans on a 6-column grid (lg+) for the unfiltered view: rows of 4+2, 2+4, 3+3, 2+2+2, 4+2. */
// Literal class names: Tailwind only generates classes it can find written out in the source.
const C2 = "lg:col-span-2";
const C3 = "lg:col-span-3";
const C4 = "lg:col-span-4";
const SPANS = [C4, C2, C2, C4, C3, C3, C2, C2, C2, C4, C2];
const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const countWord = NUMBER_WORDS[projects.length] ?? String(projects.length);

/** Cards swing up in 3D, staggered by index (passed as `custom`). */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48, rotateX: -22, scale: 0.96, transformPerspective: 1100 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transformPerspective: 1100,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 6) * 0.06 },
  }),
};

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  const [kind, setKind] = useState<ProjectKind | "all">("all");
  const close = useCallback(() => setOpen(null), []);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px" });
  const shown = kind === "all" ? projects : projects.filter((p) => p.kind === kind);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="projects-title"
          index="04"
          eyebrow="Selected work"
          title={
            <>
              {countWord} systems. <Em>One obsession:</Em> turning messy inputs into answers.
            </>
          }
          description="Visual search, computer-vision counting, medical NLP, RAG, LangGraph agents, e-invoice middleware, mail automation and trade-data reporting. Filter by discipline and open any card for the problem, solution and impact."
        />

        {/* Discipline filter */}
        <div role="tablist" aria-label="Filter projects" className="glass mb-8 inline-flex max-w-full flex-wrap gap-1 rounded-3xl p-1 sm:flex-nowrap sm:rounded-full">
          {projectKinds.map((k) => {
            const count = k.id === "all" ? projects.length : projects.filter((p) => p.kind === k.id).length;
            const active = kind === k.id;
            return (
              <button
                key={k.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setKind(k.id)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors",
                  active ? "text-bg" : "text-fg-muted hover:text-fg",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-fg"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {k.label}
                  <span className={cn("ml-1.5 font-mono text-[11px]", active ? "text-bg/60" : "text-fg-subtle")}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>

        <LayoutGroup>
          <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => {
                const span = kind === "all" ? (SPANS[i] ?? C2) : C2;
                return (
                  <motion.div
                    key={p.slug}
                    layout
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                    className={span}
                    id={`project-${p.slug}`}
                  >
                    <ProjectCard project={p} onOpen={() => setOpen(p)} large={span === C4} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence>{open && <ProjectModal project={open} onClose={close} />}</AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}

function ProjectCard({ project, onOpen, large }: { project: Project; onOpen: () => void; large: boolean }) {
  return (
    <TiltCard max={5} className="h-full">
      <motion.button
        type="button"
        layoutId={`card-${project.slug}`}
        onClick={onOpen}
        aria-haspopup="dialog"
        data-cursor="View"
        aria-label={`${project.title} — view details`}
        className="group glass relative flex h-full w-full flex-col overflow-hidden rounded-3xl text-left transition-colors hover:border-line-strong"
      >
        <motion.div
          layoutId={`art-${project.slug}`}
          className={cn("relative w-full overflow-hidden", large ? "aspect-[16/7]" : "aspect-[16/9]")}
        >
          <ProjectArt project={project} className="size-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-transparent to-transparent" />
          <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 font-mono text-[11px] text-fg-muted">
            {project.codename}
          </span>
          <span className="absolute top-4 right-4 grid size-10 translate-y-1 place-items-center rounded-full bg-fg text-lg text-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
            <TbArrowUpRight aria-hidden />
          </span>
        </motion.div>

        <div className="flex flex-1 flex-col p-6">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase" style={{ color: project.palette[0] }}>
            {project.category}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{project.title}</h3>
          {project.org && <p className="mt-1 text-xs text-fg-subtle">@ {project.org}</p>}
          <p className="mt-2 leading-relaxed text-fg-muted">{project.tagline}</p>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Technologies">
            {project.stack.slice(0, large ? 5 : 3).map((s) => (
              <li key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-fg-muted">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </motion.button>
    </TiltCard>
  );
}
