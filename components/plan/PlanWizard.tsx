"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FormProvider,
  useForm,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  EXPENSE_FIELDS,
  RISK_PROFILE_META,
} from "@/lib/plan/catalog";
import { postJson } from "@/lib/plan/post-json";
import {
  PLAN_STEPS,
  STEP_FIELD_PATHS,
  planSchema,
  type PlanFormValues,
} from "@/lib/plan/schema";
import { COMPANY } from "@/lib/content/company";
import { cn } from "@/lib/utils";
import { OtpGate } from "./OtpGate";
import { StepAssets } from "./steps/StepAssets";
import { StepCashflow } from "./steps/StepCashflow";
import { StepGenerate } from "./steps/StepGenerate";
import { StepGoals } from "./steps/StepGoals";
import { StepPersonal } from "./steps/StepPersonal";

/* ==========================================================================
   The planner.

   One react-hook-form instance across all five steps. Steps mount and unmount,
   but react-hook-form keeps the values of unmounted fields by default, so
   stepping back and forth never loses anything.

   `useForm<PlanFormValues>` rather than the schema's own input type: see the
   note on PlanFormValues in lib/plan/schema.ts for why the output type is the
   honest description of what the form holds, and why the resolver needs one
   cast to say so.
   ========================================================================== */

const DRAFT_KEY = "sarvam-plan-draft-v1";

const DEFAULTS: PlanFormValues = {
  name: "",
  dob: "",
  // Left unselected on purpose. Defaulting someone's gender or marital status
  // to save a tap is not a trade worth making.
  gender: "" as PlanFormValues["gender"],
  maritalStatus: "" as PlanFormValues["maritalStatus"],
  email: "",
  phone: "",
  retirementAge: 60,
  lifeExpectancy: 85,
  riskProfile: "" as PlanFormValues["riskProfile"],
  // Seeded from the middle band so the five boxes do not open on a red
  // "0% of 100%". Picking any profile reseeds them.
  allocation: { ...RISK_PROFILE_META.moderate.allocation },
  wantsWill: false,
  wantsInsuranceReview: true,

  income: { salary: 0, rental: 0 },
  monthlySaving: 0,
  expenses: Object.fromEntries(
    EXPENSE_FIELDS.map((f) => [f.key, 0]),
  ) as PlanFormValues["expenses"],
  contingencyMonths: 6,
  incomeShareSelf: 100,
  expenseShareSelf: 100,

  goals: [],
  liabilities: [],
  assets: [],

  planInflation: 6,
  planReturnRate: 10,
  postRetirementReturn: 7,

  consent: false,
  company: "",
};

type Phase =
  | { name: "form" }
  | { name: "verify"; planId: string; phone: string; devCode?: string; otpError?: string };

export function PlanWizard() {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>({ name: "form" });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema) as unknown as Resolver<PlanFormValues>,
    mode: "onBlur",
    defaultValues: DEFAULTS,
  });

  const { handleSubmit, trigger, reset, subscribe, getValues } = form;

  /* ------------------------------------------------------------- drafting */

  // Ninety fields is far too many to retype because a tab was closed. The
  // draft lives in this browser only: it is never sent anywhere, and the
  // footer below offers a one-click clear.
  //
  // This is the sanctioned exception to "no setState in an effect". localStorage
  // cannot be read while rendering on the server, so the first client render
  // must match the server's empty form and the restore can only happen after
  // mount. The lint rule cannot see that constraint; the one cascading render
  // it costs is the price of not shipping a hydration mismatch.
  //
  // `consent` is deliberately NOT restored. Agreement to hand over financial
  // details should be given in the session it is acted on, not inherited from
  // a tick made days ago in another sitting.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { step?: number; values?: PlanFormValues };
      if (parsed.values) {
        reset({ ...DEFAULTS, ...parsed.values, consent: false });
        /* eslint-disable react-hooks/set-state-in-effect */
        setStep(Math.min(parsed.step ?? 0, PLAN_STEPS.length - 1));
        setDraftRestored(true);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // A corrupt or unreadable draft is not worth a broken form.
    }
  }, [reset]);

  // `subscribe` rather than `watch(callback)`: watch() hands back a new
  // function on every render, which makes the React Compiler give up on
  // memoising this component entirely. subscribe() is stable and exists for
  // exactly this — reacting to values outside render.
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) => {
          try {
            window.localStorage.setItem(
              DRAFT_KEY,
              JSON.stringify({ step, values }),
            );
          } catch {
            // Private browsing, or a full quota. The form still works.
          }
        },
      }),
    [subscribe, step],
  );

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* nothing to do */
    }
  }, []);

  /* ------------------------------------------------------------- focus */

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, phase.name]);

  /* ------------------------------------------------------- navigation */

  const next = async () => {
    const paths = STEP_FIELD_PATHS[PLAN_STEPS[step].id];
    const valid = await trigger(paths as never);
    if (valid) setStep((s) => Math.min(s + 1, PLAN_STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  /* ----------------------------------------------------------- submit */

  /**
   * Submit validates the whole form, not just the step on screen — so a
   * problem left behind on step 2 would otherwise fail silently under a button
   * on step 5, with no error anywhere the visitor can see. This walks the step
   * map and sends them to the first step that actually has something wrong.
   */
  const onInvalid = (errors: FieldErrors<PlanFormValues>) => {
    const firstBad = PLAN_STEPS.findIndex((planStep) =>
      STEP_FIELD_PATHS[planStep.id].some(
        (path) => errors[path.split(".")[0] as keyof typeof errors],
      ),
    );

    if (firstBad >= 0 && firstBad !== step) {
      setStep(firstBad);
      setServerError(
        `Something on "${PLAN_STEPS[firstBad].subtitle}" still needs checking.`,
      );
    }
  };

  const onSubmit = async (values: PlanFormValues) => {
    setSubmitting(true);
    setServerError(null);

    const result = await postJson("/api/plan", values, COMPANY.email);

    if (!result.ok) {
      setServerError(result.error);
      setSubmitting(false);
      return;
    }

    const payload = result.payload ?? {};

    // The draft is only cleared once the submission is genuinely stored. A
    // failed submit that wiped ninety fields would be unforgivable.
    clearDraft();
    setSubmitting(false);
    setPhase({
      name: "verify",
      planId: String(payload.planId),
      phone: String(values.phone),
      devCode: typeof payload.devCode === "string" ? payload.devCode : undefined,
      otpError: typeof payload.otpError === "string" ? payload.otpError : undefined,
    });
  };

  /* ------------------------------------------------------------ verify */

  if (phase.name === "verify") {
    return (
      <OtpGate
        planId={phase.planId}
        phone={phase.phone}
        initialDevCode={phase.devCode}
        otpFailed={phase.otpError}
      />
    );
  }

  /* -------------------------------------------------------------- form */

  const current = PLAN_STEPS[step];
  const isLast = step === PLAN_STEPS.length - 1;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="border-line bg-card rounded-card border p-5 sm:p-8 lg:p-10"
      >
        {/* Progress */}
        <div className="mb-8">
          <ol className="mb-5 hidden gap-1.5 sm:grid sm:grid-cols-5">
            {PLAN_STEPS.map((planStep, index) => (
              <li key={planStep.id}>
                <div
                  className={cn(
                    "h-0.5 w-full rounded-full transition-colors duration-500",
                    index <= step ? "bg-accent" : "bg-line",
                  )}
                />
                <p
                  className={cn(
                    "mt-2.5 text-xs leading-tight transition-colors",
                    index === step
                      ? "text-navy font-medium"
                      : index < step
                        ? "text-muted"
                        : "text-muted/60",
                  )}
                >
                  {planStep.subtitle}
                </p>
              </li>
            ))}
          </ol>

          <div className="flex items-center justify-between gap-4 sm:hidden">
            <p className="text-muted text-xs font-medium tracking-[0.1em] uppercase">
              Step {step + 1} of {PLAN_STEPS.length}
            </p>
            <div className="bg-line h-0.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-accent h-full rounded-full transition-[width] duration-500 ease-[var(--ease-editorial)]"
                style={{ width: `${((step + 1) / PLAN_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {draftRestored && step === 0 && (
          <p
            role="status"
            className="border-line bg-mist text-body mb-7 rounded-input border p-3.5 text-xs leading-relaxed"
          >
            We have put back what you had entered before. It was saved in this
            browser only —{" "}
            <button
              type="button"
              onClick={() => {
                clearDraft();
                reset(DEFAULTS);
                setStep(0);
                setDraftRestored(false);
              }}
              className="text-accent-ink link-underline font-medium"
            >
              start fresh instead
            </button>
            .
          </p>
        )}

        <div className="mb-8">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-navy text-xl font-semibold outline-none sm:text-2xl"
          >
            {current.title}
          </h2>
        </div>

        {/* Steps are mounted one at a time; react-hook-form keeps the values of
            the four that are not on screen. */}
        {step === 0 && <StepPersonal />}
        {step === 1 && <StepCashflow />}
        {step === 2 && <StepGoals />}
        {step === 3 && <StepAssets />}
        {step === 4 && <StepGenerate />}

        {/* Honeypot — off-screen, never announced, never tab-reachable */}
        <div aria-hidden className="absolute left-[-9999px]">
          <label htmlFor="plan-company">Company (leave blank)</label>
          <input
            id="plan-company"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("company")}
          />
        </div>

        {serverError && (
          <p
            role="alert"
            className="border-error/30 bg-error/[0.06] text-error mt-8 flex items-start gap-2.5 rounded-input border p-4 text-sm"
          >
            <CircleAlert strokeWidth={1.75} aria-hidden className="mt-0.5 size-4 shrink-0" />
            {serverError}
          </p>
        )}

        <div className="border-line mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              disabled={submitting}
              className="text-muted hover:text-navy flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <ArrowLeft strokeWidth={1.75} aria-hidden className="size-4" />
              Back
            </button>
          ) : (
            <span />
          )}

          {isLast ? (
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              aria-busy={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 strokeWidth={1.75} aria-hidden className="size-4 animate-spin" />
                  Building your plan…
                </>
              ) : (
                "Generate my plan"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={next}
              size="lg"
              withArrow
              className="w-full sm:w-auto"
            >
              Continue
            </Button>
          )}
        </div>

        <p className="text-muted mt-5 text-xs leading-relaxed">
          Your answers are kept in this browser as you go, so you can close the
          tab and come back. Nothing is sent to us until you press{" "}
          <em>Generate my plan</em>.{" "}
          <button
            type="button"
            onClick={() => {
              clearDraft();
              reset(DEFAULTS);
              setStep(0);
              setDraftRestored(false);
              void getValues();
            }}
            className="text-accent-ink link-underline"
          >
            Clear what I have entered
          </button>
        </p>
      </form>
    </FormProvider>
  );
}
