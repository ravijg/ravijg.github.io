"use client";

import { useState } from "react";
import { TbArrowUpRight, TbBrandLinkedin, TbCheck, TbCopy, TbMail, TbMapPin, TbPhone } from "react-icons/tb";
import { profile } from "@/data/resume";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Starfield } from "@/components/contact/Starfield";
import { ContactForm } from "@/components/contact/ContactForm";

const channels = [
  { icon: TbMail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: TbPhone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/-/g, "")}` },
  { icon: TbBrandLinkedin, label: "LinkedIn", value: "ravi-gauswami", href: profile.linkedin, external: true },
  { icon: TbMapPin, label: "Based in", value: profile.location },
];

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden px-6 py-28 md:py-40">
      <Starfield className="absolute inset-0 -z-10 size-full opacity-70" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(139,123,255,.18),transparent_60%)]"
      />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="contact-title"
          index="08"
          eyebrow="Contact"
          title={
            <>
              Have language data that <Em>should be working harder?</Em>
            </>
          }
          description="I'm open to AI/ML engineering roles and interesting LLM, RAG and conversational-AI problems. Tell me what you're building."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="space-y-3">
            <MagneticButton href={`mailto:${profile.email}`} className="mb-6 h-14 w-full px-8 text-base sm:w-auto">
              <TbMail aria-hidden /> {profile.email}
            </MagneticButton>

            {channels.map((c) => {
              const Inner = (
                <>
                  <span className="grid size-11 place-items-center rounded-xl bg-surface-strong text-xl text-signal-1">
                    <c.icon aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-fg-subtle">{c.label}</span>
                    <span className="block truncate font-medium">{c.value}</span>
                  </span>
                  {c.href && (
                    <TbArrowUpRight
                      aria-hidden
                      className="text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                    />
                  )}
                </>
              );
              const cls =
                "group glass flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-line-strong";
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  className={cls}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {Inner}
                </a>
              ) : (
                <div key={c.label} className={cls}>
                  {Inner}
                </div>
              );
            })}

            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 pt-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {copied ? <TbCheck className="text-ok" aria-hidden /> : <TbCopy aria-hidden />}
              <span aria-live="polite">{copied ? "Email copied to clipboard" : "Copy email address"}</span>
            </button>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
