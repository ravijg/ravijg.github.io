"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { projectUsage, projects, skillCategories, type Skill } from "@/data/resume";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, fadeUp } from "@/components/ui/Reveal";
import { TechIcon, techColor } from "@/components/ui/TechIcon";
import { TiltCard } from "@/components/ui/TiltCard";
import { SkillSphere } from "@/components/skills/SkillSphere";

const TOTAL = projects.length;
const ALL_SKILLS = skillCategories.flatMap((c) => c.skills);

export function Skills() {
  const [focus, setFocus] = useState<Skill | null>(null);
  const used = focus ? projectUsage(focus.id) : [];

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative px-6 py-28 md:py-40">
      <div aria-hidden className="spotlight pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.05fr]">
          <SectionHeading
            id="skills-title"
            index="02"
            eyebrow="Capabilities"
            title={
              <>
                A full AI stack, <Em>layer by layer.</Em>
              </>
            }
            description={`Proficiency here is measured by evidence, not self-ratings: each ring shows how many of my ${TOTAL} shipped projects rely on that skill. Drag the sphere, or hover any skill to see where it was used.`}
          />
          <Reveal className="mx-auto mb-10 w-full max-w-[520px] lg:mb-20">
            <SkillSphere skills={ALL_SKILLS} onFocusSkill={setFocus} />
          </Reveal>
        </div>

        {/* Live readout of the focused skill */}
        <div className="sticky top-20 z-10 mb-6 flex min-h-12 items-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {focus && (
              <motion.div
                key={focus.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="glass flex flex-wrap items-center gap-2 rounded-full px-4 py-2 text-sm"
              >
                <TechIcon id={focus.id} />
                <span className="font-medium">{focus.name}</span>
                <span className="text-fg-subtle">→</span>
                {used.length ? (
                  used.map((p) => (
                    <span key={p.slug} className="rounded-full bg-surface-strong px-2.5 py-0.5 font-mono text-xs text-fg-muted">
                      {p.codename}
                    </span>
                  ))
                ) : (
                  <span className="text-fg-muted">Core professional toolkit</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" gap={0.07}>
          {skillCategories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <TiltCard max={4} className="glass ring-gradient group h-full overflow-hidden rounded-3xl p-6">
                <div
                  aria-hidden
                  className="absolute -top-24 -right-24 size-48 rounded-full bg-[radial-gradient(circle,rgba(139,123,255,.25),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <p className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase">{cat.blurb}</p>
                <h3 className="mt-1 mb-6 text-xl font-semibold tracking-tight">{cat.title}</h3>
                <ul className="space-y-1">
                  {cat.skills.map((s) => {
                    const count = projectUsage(s.id).length;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setFocus(s)}
                          onFocus={() => setFocus(s)}
                          onMouseLeave={() => setFocus(null)}
                          onBlur={() => setFocus(null)}
                          onClick={() => setFocus(s)}
                          aria-label={`${s.name}: used in ${count} of ${TOTAL} projects`}
                          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-surface-strong"
                        >
                          <span className="grid size-9 place-items-center rounded-lg bg-surface-strong text-lg">
                            <TechIcon id={s.id} />
                          </span>
                          <span className="flex-1 text-sm font-medium">{s.name}</span>
                          <UsageRing count={count} color={techColor(s.id)} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function UsageRing({ count, color }: { count: number; color: string }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const pct = count / TOTAL;
  return (
    <span className="flex items-center gap-2">
      <span className="font-mono text-[11px] text-fg-subtle tabular-nums">
        {count ? `${count}/${TOTAL}` : "core"}
      </span>
      <svg viewBox="0 0 36 36" className="size-8 -rotate-90" aria-hidden>
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
        <motion.circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={count ? color : "rgba(255,255,255,.25)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - (count ? pct : 0.15)) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
    </span>
  );
}
