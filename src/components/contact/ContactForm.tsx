"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TbAlertCircle, TbCheck, TbLoader2, TbSend } from "react-icons/tb";
import { profile } from "@/data/resume";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;
type Status = "idle" | "sending" | "sent" | "error";

/** Optional: set NEXT_PUBLIC_FORM_ENDPOINT (e.g. Formspree) to POST submissions. */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "A little more detail, please (10+ characters).";
  return e;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const errors = validate(values);
  const show = (f: Field) => touched[f] && errors[f];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length) {
      const first = (["name", "email", "message"] as Field[]).find((f) => errors[f]);
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    setStatus("sending");

    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        // No backend configured: hand off to the visitor's mail client.
        const subject = encodeURIComponent(`Portfolio enquiry from ${values.name}`);
        const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
        window.location.assign(`mailto:${profile.email}?subject=${subject}&body=${body}`);
      }
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
      setTouched({});
    } catch {
      setStatus("error");
    }
  };

  const input =
    "w-full rounded-2xl border bg-black/30 px-4 py-3.5 text-fg placeholder:text-fg-subtle outline-none transition-all focus:border-signal-1/60 focus:bg-black/40 focus:shadow-[0_0_0_4px_rgba(124,247,255,.08)]";

  return (
    <form onSubmit={onSubmit} noValidate className="glass ring-gradient space-y-5 rounded-3xl p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrap id="cf-name" label="Name" error={show("name")}>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            onBlur={() => setTouched({ ...touched, name: true })}
            aria-invalid={!!show("name")}
            aria-describedby={show("name") ? "cf-name-err" : undefined}
            className={cn(input, show("name") ? "border-danger/60" : "border-line")}
            placeholder="Ada Lovelace"
          />
        </FieldWrap>
        <FieldWrap id="cf-email" label="Email" error={show("email")}>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            onBlur={() => setTouched({ ...touched, email: true })}
            aria-invalid={!!show("email")}
            aria-describedby={show("email") ? "cf-email-err" : undefined}
            className={cn(input, show("email") ? "border-danger/60" : "border-line")}
            placeholder="you@company.com"
          />
        </FieldWrap>
      </div>
      <FieldWrap id="cf-message" label="Message" error={show("message")}>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          onBlur={() => setTouched({ ...touched, message: true })}
          aria-invalid={!!show("message")}
          aria-describedby={show("message") ? "cf-message-err" : undefined}
          className={cn(input, "resize-none", show("message") ? "border-danger/60" : "border-line")}
          placeholder="Tell me about the role, product or problem you're solving…"
        />
      </FieldWrap>

      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-fg px-6 text-sm font-medium text-bg shadow-[0_10px_40px_-10px_rgba(124,247,255,.55)] disabled:opacity-70"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              className="flex items-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <TbLoader2 className="animate-spin" aria-hidden /> Sending…
                </>
              ) : status === "sent" ? (
                <>
                  <TbCheck aria-hidden /> Sent
                </>
              ) : (
                <>
                  <TbSend aria-hidden /> Send message
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <p role="status" aria-live="polite" className="text-sm">
          {status === "sent" && (
            <span className="text-ok">
              {ENDPOINT ? "Thanks — I'll reply within a couple of days." : "Your email app should open with the message ready."}
            </span>
          )}
          {status === "error" && (
            <span className="text-danger">
              Something went wrong. Email me directly at{" "}
              <a className="underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              .
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

function FieldWrap({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | false;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg-muted">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1.5 text-sm text-danger"
          >
            <TbAlertCircle aria-hidden /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
