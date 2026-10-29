"use client";

import { useRef } from "react";
import { TbBriefcase, TbCheck } from "react-icons/tb";
import { experience } from "@/data/resume";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";

/** "Jan 2023" → months since epoch, for duration labels. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const toMonths = (s: string) => {
  const [mon, year] = s.split(" ");
  return Number(year) * 12 + MONTHS.indexOf(mon);
};
const duration = (start: string, end: string) => {
  // Only exact "Mon YYYY" ranges get a length; "2026 — Present" is shown as-is.
  if (!start.includes(" ") || !end.includes(" ")) return end === "Present" ? "Current role" : "";
  const m = toMonths(end) - toMonths(start) + 1; // inclusive, as on resumes / LinkedIn
  const y = Math.floor(m / 12);
  const r = m % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, r && `${r} mo${r > 1 ? "s" : ""}`].filter(Boolean).join(" ");
};

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".xp-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".xp-list", start: "top 70%", end: "bottom 70%", scrub: 0.5 },
          },
        );
        gsap.utils.toArray<HTMLElement>(".xp-item").forEach((el) => {
          gsap.from(el.querySelector(".xp-card"), {
            x: 80,
            rotationY: -28,
            rotationX: 8,
            transformPerspective: 1200,
            transformOrigin: "left center",
            opacity: 0,
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
          });
          gsap.from(el.querySelectorAll(".xp-hl"), {
            y: 16,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 70%" },
          });
          gsap.fromTo(
            el.querySelector(".xp-dot"),
            { scale: 0.4, opacity: 0.3 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(3)",
              scrollTrigger: { trigger: el, start: "top 70%" },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative px-6 py-28 md:py-40">
      <div ref={ref} className="mx-auto max-w-6xl">
        <SectionHeading
          id="experience-title"
          index="03"
          eyebrow="Experience"
          title={
            <>
              Three years in <Em>production AI.</Em>
            </>
          }
          description="From document intelligence and data pipelines to LLM-driven conversational systems — shipped for real users, not just notebooks."
        />

        <ol className="xp-list relative space-y-10 md:space-y-16">
          <span aria-hidden className="absolute top-0 bottom-0 left-[11px] w-px bg-line md:left-[calc(30%+11px)]" />
          <span
            aria-hidden
            className="xp-progress absolute top-0 bottom-0 left-[11px] w-px origin-top bg-gradient-to-b from-signal-1 via-signal-2 to-signal-3 md:left-[calc(30%+11px)]"
          />

          {experience.map((role) => (
            <li key={role.company} className="xp-item relative grid gap-6 pl-12 md:grid-cols-[30%_1fr] md:gap-0 md:pl-0">
              {/* Meta column */}
              <div className="md:pr-14 md:text-right">
                <p className="font-mono text-sm text-signal-1">
                  {role.start} — {role.end}
                </p>
                <p className="mt-1 text-sm text-fg-subtle">{duration(role.start, role.end)}</p>
              </div>

              <span
                aria-hidden
                className="xp-dot absolute top-0.5 left-0 grid size-6 place-items-center rounded-full border border-line-strong bg-bg md:left-[30%]"
              >
                <span className="size-2 rounded-full bg-signal-1 shadow-[0_0_14px_var(--signal-1)]" />
              </span>

              <div className="xp-card md:pl-14">
                <TiltCard max={3} className="glass ring-gradient overflow-hidden rounded-3xl p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">{role.company}</h3>
                      <p className="mt-1 flex items-center gap-2 text-fg-muted">
                        <TbBriefcase aria-hidden /> {role.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-lg leading-relaxed text-pretty">{role.summary}</p>
                  <ul className="mt-6 space-y-3">
                    {role.highlights.map((h) => (
                      <li key={h} className="xp-hl flex gap-3 text-fg-muted">
                        <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-signal-1/10 text-xs text-signal-1">
                          <TbCheck aria-hidden />
                        </span>
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-7 flex flex-wrap gap-2" aria-label="Focus areas">
                    {role.focus.map((f) => (
                      <li key={f} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted">
                        {f}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
