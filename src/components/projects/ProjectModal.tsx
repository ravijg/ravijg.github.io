"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { TbArrowRight, TbCheck, TbX } from "react-icons/tb";
import type { Project } from "@/data/resume";
import { ProjectArt } from "./ProjectArt";
import { lockScroll } from "@/lib/smooth";

type Props = { project: Project; onClose: () => void };

export function ProjectModal({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Scroll lock, Esc to close, focus management and a simple focus trap.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lockScroll(true);
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lockScroll(false);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-${project.slug}`}
        data-lenis-prevent
        layoutId={`card-${project.slug}`}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line-strong bg-bg-elevated shadow-2xl sm:rounded-3xl"
      >
        <motion.div layoutId={`art-${project.slug}`} className="relative aspect-[16/8] overflow-hidden">
          <ProjectArt project={project} className="size-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-transparent to-transparent" />
        </motion.div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="glass absolute top-4 right-4 grid size-10 place-items-center rounded-full text-lg"
        >
          <TbX />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="px-6 pb-10 sm:px-10"
        >
          <p className="font-mono text-xs tracking-[0.18em] text-fg-subtle uppercase">
            {project.codename} · {project.category}
            {project.org && ` · ${project.org}`}
          </p>
          <h3 id={`modal-${project.slug}`} className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 text-lg text-fg-muted">{project.tagline}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="mb-2 font-mono text-xs tracking-widest text-danger uppercase">Problem</p>
              <p className="leading-relaxed text-fg-muted">{project.problem}</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="mb-2 font-mono text-xs tracking-widest text-ok uppercase">Solution</p>
              <p className="leading-relaxed text-fg-muted">{project.solution}</p>
            </div>
          </div>

          <h4 className="mt-10 mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">Key achievements</h4>
          <ul className="space-y-3">
            {project.achievements.map((a) => (
              <li key={a} className="flex gap-3">
                <TbCheck aria-hidden className="mt-1 shrink-0 text-signal-1" />
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>

          <h4 className="mt-10 mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">Impact</h4>
          <dl className="grid gap-3 sm:grid-cols-3">
            {project.impact.map((m) => (
              <div key={m.label} className="rounded-2xl border border-line p-4">
                <dt className="text-xs text-fg-subtle">{m.label}</dt>
                <dd className="mt-1 font-medium" style={{ color: project.palette[0] }}>
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>

          <h4 className="mt-10 mb-4 font-mono text-xs tracking-widest text-fg-subtle uppercase">Technologies</h4>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
                {s}
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            onClick={onClose}
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-signal-1 hover:underline"
          >
            Want to talk about this build? <TbArrowRight aria-hidden />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
