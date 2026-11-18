import { useState } from "react";
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
  "w-full border-b border-white/20 bg-transparent py-3 font-sans text-[15px] text-foreground placeholder:text-[16px] placeholder:text-neutral-600 transition-colors focus:border-accent";

const selectClass =
  "w-full cursor-pointer border-b border-white/20 bg-background py-3 font-sans text-[15px] text-foreground transition-colors [color-scheme:dark] focus:border-accent";

const FORM_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`;

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

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

      // FormSubmit replies with success:"false" until the recipient clicks the
      // one-time activation link. The activation email is already on its way,
      // so treat that case as a successful send for the visitor.
      const pendingActivation =
        !ok && /activation/i.test(responseMessage) && /activate/i.test(responseMessage);

      if (!ok && !pendingActivation) {
        throw new Error(responseMessage || "Submission failed.");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setError(
        `Something went wrong while sending your message. Please try again or email us directly at ${site.email}.`,
      );
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-white/10 pb-16 pt-10 md:pb-24 md:pt-14"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-neutral-400 md:mb-12">
        <span className="text-neutral-500">Inquiry / 006</span>
        <span>{site.studioTagline} / India</span>
      </div>

      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <h1
          id="contact-heading"
          className="font-sans text-[clamp(2.8rem,8vw,7.5rem)] font-medium leading-none tracking-[-0.045em] text-foreground"
        >
          Start a project.
        </h1>
        <p className="max-w-[32ch] font-mono text-[12px] uppercase leading-relaxed tracking-[0.12em] text-neutral-400">
          Available for new product design and engineering work.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-10 lg:col-span-5">
          <div>
            <span className="mb-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-neutral-500">
              Direct email
            </span>
            <a
              href={`mailto:${site.email}`}
              className="break-all font-sans text-[22px] font-semibold text-foreground underline decoration-white/20 underline-offset-8 transition-colors hover:text-accent md:text-[28px]"
            >
              {site.email}
            </a>
          </div>

          <div>
            <span className="mb-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-neutral-500">
              Studio
            </span>
            <p className="max-w-[34ch] font-sans text-[15px] leading-relaxed text-neutral-300">
              Based in India, working with teams across time zones. Remote-first,
              with calls scheduled around your working day.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <span className="mb-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-neutral-500">
              What to include
            </span>
            <p className="max-w-[34ch] font-sans text-[15px] leading-relaxed text-neutral-300">
              A short description of the product, who it is for, what stage it is
              at, and any deadline you are working towards.
            </p>
          </div>
        </div>

        <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 lg:col-span-7">
          {status === "success" ? (
            <div role="status" className="py-10">
              <h2 className="font-sans text-[24px] font-medium text-foreground">
                Message sent.
              </h2>
              <p className="mt-3 max-w-[46ch] font-sans text-[14px] leading-relaxed text-neutral-400">
                Thanks for reaching out. We have received your details and will
                reply to you by email, usually within one to two business days.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 font-mono text-[12px] uppercase tracking-[0.12em] text-neutral-400 transition-colors hover:text-foreground"
              >
                [ Send another message ]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-neutral-400"
                  >
                    Your name *
                  </label>
                  <input
                    id="contact-name"
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
                    htmlFor="contact-email"
                    className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-neutral-400"
                  >
                    Email address *
                  </label>
                  <input
                    id="contact-email"
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
                    htmlFor="contact-service"
                    className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-neutral-400"
                  >
                    Service
                  </label>
                  <select
                    id="contact-service"
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
                </div>
                <div>
                  <label
                    htmlFor="contact-budget"
                    className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-neutral-400"
                  >
                    Estimated budget
                  </label>
                  <select
                    id="contact-budget"
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
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-neutral-400"
                >
                  Project details *
                </label>
                <textarea
                  id="contact-message"
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

              {status === "error" && error ? (
                <p
                  role="alert"
                  className="border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-[13px] leading-relaxed text-red-300"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-[38ch] text-[12px] leading-relaxed text-neutral-500">
                  Your details are sent straight to our inbox. We usually reply
                  within one to two business days.
                </p>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex shrink-0 items-center justify-center rounded-[2px] bg-accent px-6 py-3 font-sans text-[14px] font-semibold text-background transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
