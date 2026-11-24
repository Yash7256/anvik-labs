"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { primaryCtaClass } from "@/lib/cta";
import { site } from "@/lib/site";

const servicesOptions = [
  "Product design",
  "Web development",
  "AI solutions",
  "Website maintenance",
  "Not sure yet",
];

const budgetOptions = [
  "Under $1k",
  "$1k to $5k",
  "$5k to $15k",
  "$15k+",
  "Not sure yet",
];

const fieldClass =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3.5 font-sans text-[15px] text-foreground placeholder:text-[15px] placeholder:text-muted/80 transition-[border-color,background-color,box-shadow] duration-200 focus:border-accent/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15";

const selectClass =
  "w-full cursor-pointer appearance-none rounded-xl border border-border bg-background/60 px-4 py-3.5 pr-11 font-sans text-[15px] text-foreground transition-[border-color,background-color,box-shadow] duration-200 focus:border-accent/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15";

const FORM_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`;

type Status = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  idPrefix?: string;
  className?: string;
  onSuccess?: () => void;
};

export default function ContactForm({
  idPrefix = "contact",
  className = "",
  onSuccess,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "");
    const budget = String(data.get("budget") ?? "");
    const message = String(data.get("message") ?? "").trim();
    const honey = String(data.get("_honey") ?? "");

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in your name, email address, and project details.");
      return;
    }

    if (honey) {
      setStatus("success");
      onSuccess?.();
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          service,
          budget,
          message,
          _replyto: email,
          _subject: `New project inquiry from ${name}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        success?: string | boolean;
        message?: string;
      } | null;

      const responseMessage = result?.message ?? "";
      const ok =
        response.ok &&
        (result?.success === true || result?.success === "true");

      const pendingActivation =
        !ok && /activation/i.test(responseMessage) && /activate/i.test(responseMessage);

      if (!ok && !pendingActivation) {
        throw new Error(responseMessage || "Submission failed.");
      }

      form.reset();
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
      setError(
        `Something went wrong while sending your message. Please try again or email us directly at ${site.email}.`,
      );
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="py-10"
          >
            <h2 className="font-sans text-[24px] font-medium text-foreground">
              Message sent.
            </h2>
            <p className="mt-3 max-w-[46ch] font-sans text-[14px] leading-relaxed text-muted">
              Thanks for reaching out. We have received your details and will
              reply to you by email, usually within one to two business days.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 font-mono text-[12px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
            >
              [ Send another message ]
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${idPrefix}-name`}
                  className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-muted"
                >
                  Your name *
                </label>
                <input
                  id={`${idPrefix}-name`}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  htmlFor={`${idPrefix}-email`}
                  className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-muted"
                >
                  Email address *
                </label>
                <input
                  id={`${idPrefix}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${idPrefix}-service`}
                  className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-muted"
                >
                  Service
                </label>
                <div className="relative">
                  <select
                    id={`${idPrefix}-service`}
                    name="service"
                    defaultValue="Product design"
                    className={selectClass}
                  >
                    {servicesOptions.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6l4 4 4-4" /></svg>
                </div>
              </div>
              <div>
                <label
                  htmlFor={`${idPrefix}-budget`}
                  className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-muted"
                >
                  Estimated budget
                </label>
                <div className="relative">
                  <select
                    id={`${idPrefix}-budget`}
                    name="budget"
                    defaultValue="Not sure yet"
                    className={selectClass}
                  >
                    {budgetOptions.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6l4 4 4-4" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-message`}
                className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-muted"
              >
                Project details *
              </label>
              <textarea
                id={`${idPrefix}-message`}
                name="message"
                required
                rows={5}
                placeholder="What are you building, who is it for, and what does success look like?"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <AnimatePresence initial={false}>
              {status === "error" && error ? (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  className="border border border-red-400/30 bg-red-500/10 px-4 py-3 text-[13px] leading-relaxed text-red-200"
                >
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[36ch] text-[13px] leading-relaxed text-muted">
                Your details go straight to our inbox. We usually reply within one to two business days.
              </p>
              <button
                type="submit"
                data-cursor="send"
                disabled={status === "submitting"}
                className={`${primaryCtaClass} shrink-0 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={status === "submitting" ? "sending" : "send"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.16 }}
                  >
                    {status === "submitting" ? "Sending…" : "Send message"}
                  </motion.span>
                </AnimatePresence>
                {status === "submitting" && !reduceMotion ? (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-on-accent/60"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, ease: "linear" }}
                  />
                ) : null}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
