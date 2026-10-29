"use client";

import { motion } from "framer-motion";
import { TbSchool } from "react-icons/tb";
import { education } from "@/data/resume";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, fadeUp } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

export function Education() {
  const cgpa = parseFloat(education.grade);

  return (
    <section id="education" aria-labelledby="education-title" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="education-title"
          index="07"
          eyebrow="Education"
          title={
            <>
              Where the <Em>foundations</Em> were laid.
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <TiltCard max={4} className="glass ring-gradient noise h-full overflow-hidden rounded-3xl p-8 md:p-10">
              <div
                aria-hidden
                className="absolute -top-32 -right-32 size-80 rounded-full bg-[radial-gradient(circle,rgba(124,247,255,.18),transparent_65%)]"
              />
              <span className="grid size-14 place-items-center rounded-2xl bg-surface-strong text-2xl text-signal-1">
                <TbSchool aria-hidden />
              </span>
              <p className="mt-8 font-mono text-sm text-signal-1">
                {education.start} — {education.end}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{education.institution}</h3>
              <p className="mt-2 text-lg text-fg-muted">
                {education.degree} · {education.field}
              </p>

              <div className="mt-10 flex items-center gap-6">
                <svg viewBox="0 0 120 120" className="size-28 -rotate-90" aria-hidden>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#cgpa)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - cgpa / 10) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <defs>
                    <linearGradient id="cgpa">
                      <stop offset="0" stopColor="#7cf7ff" />
                      <stop offset="1" stopColor="#ff7ad9" />
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <p className="text-4xl font-semibold tracking-tight">{education.grade.split(" ")[0]}</p>
                  <p className="text-sm text-fg-subtle">CGPA out of 10</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          <Stagger as="div" className="relative flex flex-col justify-center gap-4" gap={0.12}>
            {education.milestones.map((m, i) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                className="glass flex items-center gap-5 rounded-2xl p-5 transition-colors hover:border-line-strong"
              >
                <span className="font-mono text-2xl font-semibold text-gradient">{m.year}</span>
                <span className="h-8 w-px bg-line-strong" aria-hidden />
                <span className="text-sm leading-relaxed text-fg-muted">{m.label}</span>
                <span className="ml-auto font-mono text-xs text-fg-subtle">0{i + 1}</span>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
