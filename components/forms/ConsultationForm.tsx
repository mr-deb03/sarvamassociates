"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  CALLBACK_LABELS,
  CALLBACK_WINDOWS,
  CONTACT_METHOD_LABELS,
  CONTACT_METHODS,
  consultationSchema,
  INTEREST_LABELS,
  INTERESTS,
  STEP_FIELDS,
  type ConsultationData,
  type ConsultationInput,
} from "@/lib/forms/consultation-schema";
import { COMPANY } from "@/lib/content/company";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

const STEP_TITLES = [
  "What would you like to talk about?",
  "How can we reach you?",
  "When suits you?",
];

export function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  // Captured at submit so the confirmation reflects what was actually sent,
  // rather than reading live form state after the form has gone.
  const [submitted, setSubmitted] = useState<ConsultationData | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ConsultationInput, unknown, ConsultationData>({
    resolver: zodResolver(consultationSchema),
    mode: "onBlur",
    defaultValues: {
      preferredContact: "phone",
      callbackWindow: "anytime",
      company: "",
    },
  });

  // Move focus to the new step's heading so keyboard and screen-reader users
  // land in the right place. Skipped on first render — stealing focus on load
  // is hostile.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step] as never);
    if (valid) setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: ConsultationData) => {
    setState("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setServerError(
          result.error ?? "Something went wrong. Please try again.",
        );
        setState("error");
        return;
      }

      setSubmitted(data);
      setState("success");
    } catch {
      setServerError(
        "We couldn't reach the server. Please check your connection and try again.",
      );
      setState("error");
    }
  };

  /* ---------------------------------------------------------------- success */
  if (state === "success") {
    return (
      <div
        role="status"
        className="border-line rounded-card border bg-ivory p-8 text-center lg:p-12"
      >
        <span
          aria-hidden
          className="bg-positive/10 text-positive mx-auto grid size-14 place-items-center rounded-full"
        >
          <Check className="size-7" strokeWidth={2.5} />
        </span>

        <h3 className="font-display text-charcoal mt-6 text-2xl font-semibold">
          Thank you — we&rsquo;ve got it.
        </h3>

        <p className="text-body mx-auto mt-3 max-w-md text-sm leading-relaxed">
          {submitted?.name ? `${submitted.name.split(" ")[0]}, one` : "One"} of
          our advisors will get in touch by{" "}
          <span className="text-charcoal font-medium">
            {CONTACT_METHOD_LABELS[
              submitted?.preferredContact ?? "phone"
            ].toLowerCase()}
          </span>{" "}
          during your{" "}
          <span className="text-charcoal font-medium">
            {CALLBACK_LABELS[submitted?.callbackWindow ?? "anytime"].toLowerCase()}
          </span>{" "}
          window, usually within one working day. The first conversation is
          fifteen minutes and carries no obligation.
        </p>

        <p className="text-muted mt-6 text-xs">
          Need us sooner? Email{" "}
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-champagne-ink link-underline"
          >
            {COMPANY.email}
          </a>
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------- form */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border-line rounded-card border bg-ivory p-6 lg:p-9"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-muted text-xs font-medium tracking-[0.1em] uppercase">
            Step {step + 1} of {STEP_TITLES.length}
          </p>
          {step > 0 && state !== "submitting" && (
            <button
              type="button"
              onClick={back}
              className="text-muted hover:text-charcoal flex items-center gap-1 text-xs font-medium transition-colors"
            >
              <ArrowLeft strokeWidth={1.75} aria-hidden className="size-3.5" />
              Back
            </button>
          )}
        </div>

        <div className="bg-line h-0.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-champagne h-full rounded-full transition-[width] duration-500 ease-[var(--ease-editorial)]"
            style={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
          />
        </div>
      </div>

      <div aria-live="polite">
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-charcoal mb-6 text-xl font-semibold outline-none lg:text-2xl"
        >
          {STEP_TITLES[step]}
        </h3>

        {/* ---------------------------------------------------- step 1 */}
        {step === 0 && (
          <fieldset>
            <legend className="sr-only">Area of interest</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {INTERESTS.map((value) => (
                <label
                  key={value}
                  className={cn(
                    "border-line hover:border-charcoal/30 flex cursor-pointer items-center gap-3 rounded-input border p-4 transition-colors",
                    "has-checked:border-charcoal has-checked:bg-sand",
                    "has-focus-visible:outline has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-champagne",
                  )}
                >
                  <input
                    type="radio"
                    value={value}
                    {...register("interest")}
                    className="accent-charcoal size-4"
                  />
                  <span className="text-charcoal text-sm font-medium">
                    {INTEREST_LABELS[value]}
                  </span>
                </label>
              ))}
            </div>
            <FieldError message={errors.interest?.message} />
          </fieldset>
        )}

        {/* ---------------------------------------------------- step 2 */}
        {step === 1 && (
          <div className="space-y-5">
            <Field
              label="Your name"
              error={errors.name?.message}
              htmlFor="name"
            >
              <input
                id="name"
                autoComplete="name"
                placeholder="Full name"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
                className={inputClass(Boolean(errors.name))}
              />
            </Field>

            <Field
              label="Mobile number"
              hint="10-digit Indian mobile"
              error={errors.phone?.message}
              htmlFor="phone"
            >
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="98765 43210"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
                className={inputClass(Boolean(errors.phone))}
              />
            </Field>

            <Field
              label="Email address"
              error={errors.email?.message}
              htmlFor="email"
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
                className={inputClass(Boolean(errors.email))}
              />
            </Field>

            <p className="text-muted border-line border-t pt-4 text-xs leading-relaxed">
              We ask for nothing beyond this. No PAN, no Aadhaar, no bank
              details, no portfolio values — none of that belongs in a website
              form.
            </p>
          </div>
        )}

        {/* ---------------------------------------------------- step 3 */}
        {step === 2 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="text-charcoal mb-2.5 block text-sm font-medium">
                Preferred way to reach you
              </legend>
              <div className="flex flex-wrap gap-2">
                {CONTACT_METHODS.map((method) => (
                  <label
                    key={method}
                    className={cn(
                      "border-line hover:border-charcoal/30 cursor-pointer rounded-input border px-4 py-2 text-sm transition-colors",
                      "has-checked:border-charcoal has-checked:bg-sand has-checked:text-charcoal has-checked:font-medium",
                      "has-focus-visible:outline has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-champagne",
                      "text-body",
                    )}
                  >
                    <input
                      type="radio"
                      value={method}
                      {...register("preferredContact")}
                      className="sr-only"
                    />
                    {CONTACT_METHOD_LABELS[method]}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-charcoal mb-2.5 block text-sm font-medium">
                Best time to call
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {CALLBACK_WINDOWS.map((window) => (
                  <label
                    key={window}
                    className={cn(
                      "border-line hover:border-charcoal/30 flex cursor-pointer items-center gap-3 rounded-input border p-3.5 transition-colors",
                      "has-checked:border-charcoal has-checked:bg-sand",
                      "has-focus-visible:outline has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-champagne",
                    )}
                  >
                    <input
                      type="radio"
                      value={window}
                      {...register("callbackWindow")}
                      className="accent-charcoal size-4"
                    />
                    <span className="text-body text-sm">
                      {CALLBACK_LABELS[window]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Field
              label="Anything else?"
              hint="Optional"
              error={errors.message?.message}
              htmlFor="message"
            >
              <textarea
                id="message"
                rows={4}
                placeholder="What prompted you to get in touch?"
                {...register("message")}
                className={cn(inputClass(Boolean(errors.message)), "resize-y")}
              />
            </Field>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("consent")}
                aria-invalid={Boolean(errors.consent)}
                className="accent-charcoal mt-0.5 size-4 shrink-0"
              />
              <span className="text-body text-xs leading-relaxed">
                I&rsquo;m happy for Sarvam Associates to contact me about this
                enquiry. We won&rsquo;t add you to a mailing list or pass your
                details to anyone else.
              </span>
            </label>
            <FieldError message={errors.consent?.message} />
          </div>
        )}
      </div>

      {/* Honeypot — off-screen, never announced, never tab-reachable */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      {state === "error" && serverError && (
        <p
          role="alert"
          className="border-error/30 bg-error/[0.06] text-error mt-6 flex items-start gap-2.5 rounded-input border p-4 text-sm"
        >
          <CircleAlert strokeWidth={1.75} aria-hidden className="mt-0.5 size-4 shrink-0" />
          {serverError}
        </p>
      )}

      <div className="border-line mt-8 border-t pt-6">
        {step < STEP_TITLES.length - 1 ? (
          <Button type="button" onClick={next} size="lg" withArrow className="w-full sm:w-auto">
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={state === "submitting"}
            aria-busy={state === "submitting"}
            className="w-full sm:w-auto"
          >
            {state === "submitting" ? (
              <>
                <Loader2 strokeWidth={1.75} aria-hidden className="size-4 animate-spin" />
                Sending…
              </>
            ) : (
              "Book my consultation"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ helpers */

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-input border bg-ivory px-4 py-3 text-sm text-charcoal",
    "placeholder:text-muted/70 transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-charcoal/15",
    hasError ? "border-error focus:border-error" : "border-line focus:border-charcoal",
  );
}

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-charcoal mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium"
      >
        {label}
        {hint && <span className="text-muted text-xs font-normal">{hint}</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-error mt-1.5 flex items-center gap-1.5 text-xs">
      <CircleAlert strokeWidth={1.75} aria-hidden className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}
