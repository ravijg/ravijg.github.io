"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { TbDownload, TbMenu2, TbX } from "react-icons/tb";
import { navLinks, profile } from "@/data/resume";
import { cn } from "@/lib/utils";
import { lockScroll } from "@/lib/smooth";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  // Scroll-spy: highlight the section currently in the middle of the viewport.
  useEffect(() => {
    // "top" (the hero) is observed too so the highlight clears when scrolling back up.
    const ids = ["top", ...navLinks.map((l) => l.href.slice(1))];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    lockScroll(open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pr-2 pl-5 transition-all duration-500",
          scrolled ? "border border-line bg-bg/75 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)]" : "border border-transparent",
        )}
      >
        <a href="#top" className="group flex items-center gap-2.5" aria-label={`${profile.name} — home`}>
          <span className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-signal-1 via-signal-2 to-signal-3 font-mono text-[11px] font-bold text-bg">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:block">
            {profile.name}
            <span className="ml-2 text-fg-subtle">/ {profile.role}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                  active === l.href ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {active === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-surface-strong"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.resumeUrl}
            download
            className="hidden h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <TbDownload aria-hidden /> Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full text-xl text-fg md:hidden"
          >
            {open ? <TbX /> : <TbMenu2 />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl p-3 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg text-fg-muted hover:bg-surface hover:text-fg"
                  >
                    {l.label}
                    <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
              <li className="mt-2">
                <a
                  href={profile.resumeUrl}
                  download
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-fg font-medium text-bg"
                >
                  <TbDownload aria-hidden /> Download resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
