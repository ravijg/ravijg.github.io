"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  id?: string;
};

export function SectionHeading({ index, eyebrow, title, description, align = "left", id }: Props) {
  return (
    <div className={cn("mb-14 md:mb-20", align === "center" && "mx-auto max-w-3xl text-center")}>
      <Reveal>
        <p
          className={cn(
            "mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-fg-muted uppercase",
            align === "center" && "justify-center",
          )}
        >
          <span className="text-signal-1">{index}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {eyebrow}
        </p>
      </Reveal>
      {/* Masked rise: the heading slides up from behind an invisible edge. */}
      {/* The wrapper is observed (not the h2): a clipped child never registers as in view. */}
      <motion.div className="mask-line" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
        <motion.h2
          id={id}
          variants={{
            hidden: { y: "105%", rotate: 2.5, opacity: 0 },
            show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.05 } },
          }}
          className="origin-bottom-left text-4xl leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h2>
      </motion.div>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-fg-muted",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Serif italic accent used inside headings, e.g. <Em>intelligence</Em>. */
export function Em({ children }: { children: ReactNode }) {
  return <em className="font-serif font-normal tracking-[-0.01em] text-gradient">{children}</em>;
}
