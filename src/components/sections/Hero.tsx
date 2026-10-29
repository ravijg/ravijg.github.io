"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TbArrowDown, TbArrowRight, TbDownload, TbMapPin } from "react-icons/tb";
import { profile, skillCategories } from "@/data/resume";
import { useDeviceTier, useFinePointer, useFirstInteraction, useInView } from "@/lib/hooks";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TypingText } from "@/components/ui/TypingText";
import { TechIcon } from "@/components/ui/TechIcon";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

/** Stagger delay for the CSS `.rise` intro (see globals.css). */
const intro = (delay: number) => ({ style: { "--d": `${delay}s` } as React.CSSProperties });

const marquee = skillCategories.flatMap((c) => c.skills);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  // Phones wait for the first touch/scroll before loading 3D; desktops start on mouse move (or after 4s).
  const fine = useFinePointer();
  const started = useFirstInteraction(fine ? 4000 : null);
  const sceneTier = tier === "low" || tier === "high" ? tier : null;
  const show3D = sceneTier !== null && started;
  const visible = useInView(ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_40%,#000_20%,transparent_70%)] opacity-60" />
        <div className="absolute top-[-20%] right-[-10%] size-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(139,123,255,.22),transparent_60%)]" />
        <div className="absolute bottom-[-30%] left-[-20%] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(124,247,255,.12),transparent_60%)]" />
        {sceneTier && started && (
          <motion.div
            className="absolute inset-0 opacity-40 md:opacity-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <HeroScene tier={sceneTier} active={visible} />
          </motion.div>
        )}
        {!show3D && <StaticNetwork />}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-bg via-bg/80 to-transparent md:w-[65%]" />
        {/* Phones: the scene sits behind the text, so dim it a little more for legibility. */}
        <div className="absolute inset-0 bg-bg/45 md:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-28 pb-16"
      >
        <div className="pointer-events-auto max-w-3xl">
          <div {...intro(0.1)} className="rise mb-8 flex items-center gap-4">
            <Avatar />
            <div>
              <p className="text-base font-medium">{profile.name}</p>
              <p className="flex items-center gap-1.5 text-sm text-fg-muted">
                <TbMapPin aria-hidden /> {profile.location}
              </p>
            </div>
          </div>

          <p
            {...intro(0.2)}
            className="rise mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-xs tracking-wider text-fg-muted uppercase backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal-1 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-signal-1" />
            </span>
            {profile.role}
            <span className="hidden sm:inline">· {profile.headline}</span>
          </p>

          <h1
            id="hero-title"
            {...intro(0.3)}
            className="rise text-[clamp(2.6rem,7.2vw,6rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            I turn unstructured language into{" "}
            <em className="font-serif font-normal tracking-[-0.02em] text-gradient">
              structured intelligence.
            </em>
          </h1>

          <p
            {...intro(0.45)}
            className="rise mt-7 max-w-xl text-lg leading-relaxed text-fg-muted md:text-xl"
          >
            AI Engineer with {profile.yearsOfExperience} years shipping{" "}
            <TypingText words={profile.typing} />
            <br className="hidden sm:block" /> in Python — from LLM reasoning to vector search to production APIs.
          </p>

          <div {...intro(0.6)} className="rise mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton href="#projects">
              View Projects
              <TbArrowRight aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </MagneticButton>
            <MagneticButton href={profile.resumeUrl} variant="secondary" download>
              <TbDownload aria-hidden /> Download Resume
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Contact Me
            </MagneticButton>
          </div>
        </div>
      </motion.div>

      {/* Tech marquee */}
      <div
        {...intro(0.8)}
        className="rise relative border-y border-line bg-bg/70 py-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      >
        <ul className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]" aria-label="Technologies">
          {[...marquee, ...marquee].map((s, i) => (
            <li
              key={`${s.id}-${i}`}
              aria-hidden={i >= marquee.length}
              className="flex items-center gap-2.5 font-mono text-sm whitespace-nowrap text-fg-muted"
            >
              <TechIcon id={s.id} className="text-lg" />
              {s.name}
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-fg-subtle uppercase md:flex"
      >
        Scroll
        <TbArrowDown className="animate-bounce text-base" aria-hidden />
      </a>
    </section>
  );
}

/** Profile photo placeholder: monogram with a rotating holographic ring. */
function Avatar() {
  return (
    <div className="relative size-14 shrink-0">
      <div
        aria-hidden
        className="absolute -inset-[2px] animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,var(--signal-1),var(--signal-2),var(--signal-3),var(--signal-1))]"
      />
      <div
        role="img"
        aria-label={`${profile.name} monogram`}
        className="relative grid size-full place-items-center rounded-full bg-bg-elevated font-serif text-2xl italic"
      >
        {profile.initials}
      </div>
    </div>
  );
}

/** Lightweight SVG stand-in for the WebGL scene (reduced motion / no WebGL). */
function StaticNetwork() {
  const layers = [4, 6, 8, 6, 4];
  const nodes = layers.flatMap((n, li) =>
    Array.from({ length: n }, (_, i) => ({ x: 120 + li * 140, y: 300 + (i - (n - 1) / 2) * 60, li })),
  );
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 600"
      className="absolute top-1/2 right-0 h-[80%] -translate-y-1/2 opacity-40 md:opacity-70"
    >
      <defs>
        <linearGradient id="sn" x1="0" x2="1">
          <stop offset="0" stopColor="#7cf7ff" />
          <stop offset=".5" stopColor="#8b7bff" />
          <stop offset="1" stopColor="#ff7ad9" />
        </linearGradient>
      </defs>
      {nodes.map((a, i) =>
        nodes
          .filter((b) => b.li === a.li + 1)
          .filter((_, j) => (i + j) % 3 === 0)
          .map((b, j) => (
            <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#sn)" strokeOpacity=".25" />
          )),
      )}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="5" fill="url(#sn)" />
      ))}
    </svg>
  );
}
