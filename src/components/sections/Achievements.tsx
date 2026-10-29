"use client";

import { motion } from "framer-motion";
import { TbAward, TbSparkles } from "react-icons/tb";
import { certifications, highlights, stats } from "@/data/resume";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { Stagger, fadeUp } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { TiltCard } from "@/components/ui/TiltCard";

export function Achievements() {
  return (
    <section id="achievements" aria-labelledby="achievements-title" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="achievements-title"
          index="06"
          eyebrow="By the numbers"
          title={
            <>
              Impact, <Em>measured.</Em>
            </>
          }
        />

        <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="group relative bg-bg p-6 sm:p-8">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,123,255,.18),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <p className="relative text-5xl font-semibold tracking-[-0.04em] text-gradient sm:text-6xl">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="relative mt-3 font-medium">{s.label}</p>
              <p className="relative mt-1 text-sm text-fg-subtle">{s.detail}</p>
            </motion.div>
          ))}
        </Stagger>

        <Stagger className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {highlights.map((h) => (
            <motion.div key={h.title} variants={fadeUp}>
              <TiltCard className="glass ring-gradient h-full overflow-hidden rounded-3xl p-6">
                <TbSparkles aria-hidden className="mb-6 text-2xl text-signal-3" />
                <h3 className="text-lg font-semibold tracking-tight">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{h.body}</p>
              </TiltCard>
            </motion.div>
          ))}
        </Stagger>

        {certifications.length > 0 && (
          <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {certifications.map((c) => (
              <motion.a
                key={c.name}
                variants={fadeUp}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-line-strong"
              >
                <TbAward aria-hidden className="text-2xl text-warn" />
                <span>
                  <span className="block font-medium">{c.name}</span>
                  <span className="text-sm text-fg-subtle">
                    {c.issuer} · {c.year}
                  </span>
                </span>
              </motion.a>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
