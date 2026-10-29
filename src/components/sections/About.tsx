"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { TbBolt, TbBrain, TbMessageChatbot, TbVectorTriangle } from "react-icons/tb";
import type { IconType } from "react-icons";
import { education, experience, story, strengths, type Strength } from "@/data/resume";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, fadeUp } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

const strengthIcons: Record<Strength["icon"], IconType> = {
  brain: TbBrain,
  vector: TbVectorTriangle,
  chat: TbMessageChatbot,
  bolt: TbBolt,
};

// Roles in chronological order (experience is listed newest first).
const roles = [...experience].reverse();
const journey = [
  { date: education.start, title: "Started B.E. in ICT", place: education.institution },
  { date: roles[0].start, title: roles[0].title, place: roles[0].company },
  { date: education.end, title: `Graduated · ${education.grade}`, place: education.institution },
  ...roles.slice(1).map((r) => ({ date: r.start, title: r.title, place: r.company })),
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About"
          title={
            <>
              Engineering AI that <Em>understands</Em> — and acts.
            </>
          }
        />

        <Manifesto text={story.manifesto} />

        <div className="mt-24 grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="text-2xl leading-snug font-medium tracking-tight text-pretty md:text-3xl">
                {story.lead}
              </p>
            </Reveal>
            {story.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.05 * (i + 1)}>
                <p className="mt-6 text-lg leading-relaxed text-pretty text-fg-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          <Journey />
        </div>

        <Stagger className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {strengths.map((s, i) => {
            const Icon = strengthIcons[s.icon];
            return (
              <motion.div key={s.title} variants={fadeUp} className="h-full">
                <TiltCard className="glass ring-gradient h-full overflow-hidden rounded-3xl p-6">
                  <div className="mb-10 flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-surface-strong text-xl text-signal-1">
                      <Icon aria-hidden />
                    </span>
                    <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.body}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/** Large statement whose words light up as you scroll (GSAP ScrollTrigger scrub). */
function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".word",
          // Unlit words stay ≥ 3:1 contrast (large-text WCAG minimum).
          { opacity: 0.4 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <p
      ref={ref}
      className="max-w-5xl text-[clamp(1.75rem,4.4vw,3.6rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-balance"
    >
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          className={`word inline-block ${/structure|unstructured/i.test(w) ? "text-gradient" : ""}`}
        >
          {w}&nbsp;
        </span>
      ))}
    </p>
  );
}

/** Vertical journey with a line that draws itself on scroll. */
function Journey() {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".journey-line",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div>
      <Reveal>
        <h3 className="mb-8 font-mono text-xs tracking-[0.2em] text-fg-subtle uppercase">The journey so far</h3>
      </Reveal>
      <ol ref={ref} className="relative space-y-8 pl-8">
        <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
        <span
          aria-hidden
          className="journey-line absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-signal-1 via-signal-2 to-signal-3"
        />
        {journey.map((j, i) => (
          <Reveal as="li" key={i} delay={0.08 * i} className="relative">
            <span
              aria-hidden
              className="absolute top-1.5 -left-8 grid size-[15px] place-items-center rounded-full border border-line-strong bg-bg"
            >
              <span className="size-1.5 rounded-full bg-signal-1 shadow-[0_0_12px_var(--signal-1)]" />
            </span>
            <p className="font-mono text-xs text-signal-1">{j.date}</p>
            <p className="mt-1 font-medium">{j.title}</p>
            <p className="text-sm text-fg-muted">{j.place}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
