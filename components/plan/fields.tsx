"use client";

import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { CircleAlert } from "lucide-react";
import { formatInr } from "@/lib/content/display";
import type { PlanFormValues } from "@/lib/plan/schema";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Planner form primitives.

   The wizard asks for roughly ninety numbers. Anything repeated ninety times
   has to be one component, or the fifteenth money field will quietly differ
   from the first.

   Everything here reads react-hook-form through context rather than props, so
   a step component is a layout of field names and nothing else.
   ========================================================================== */

/** Dotted paths into the form. Typed loosely on purpose — array indices make a
 *  precise path type unreadable, and the names are checked by the schema. */
export type FieldName = string;

export function useFieldError(name: FieldName): string | undefined {
  const {
    formState: { errors },
  } = useFormContext<PlanFormValues>();

  // Walk the dotted path; react-hook-form nests errors the same way it nests
  // values, so "goals.0.currentCost" lands on the right node.
  const node = name
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      errors,
    );

  const message = (node as { message?: unknown } | undefined)?.message;
  return typeof message === "string" ? message : undefined;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-error mt-1.5 flex items-start gap-1.5 text-xs">
      <CircleAlert strokeWidth={1.75} aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      {message}
    </p>
  );
}

export function inputClass(hasError?: boolean, extra?: string) {
  return cn(
    "w-full rounded-input border bg-card px-4 py-2.5 text-sm text-navy",
    "placeholder:text-muted/70 transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-navy/15",
    hasError ? "border-error focus:border-error" : "border-line focus:border-navy",
    extra,
  );
}

/* ------------------------------------------------------------------ label */

export function Field({
  label,
  hint,
  name,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  name?: FieldName;
  children: ReactNode;
  className?: string;
}) {
  const error = useFieldError(name ?? "");

  return (
    <div className={className}>
      <label
        htmlFor={name}
        // flex-wrap, so a hint drops to its own line on a narrow screen rather
        // than squeezing the label into two cramped lines beside it.
        className="text-navy mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-sm font-medium"
      >
        <span>{label}</span>
        {hint && <span className="text-muted text-xs font-normal">{hint}</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

/* ------------------------------------------------------------------- text */

export function TextInput({
  name,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
}: {
  name: FieldName;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  const { register } = useFormContext<PlanFormValues>();
  const error = useFieldError(name);

  return (
    <input
      id={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      aria-invalid={Boolean(error)}
      {...register(name as never)}
      className={inputClass(Boolean(error))}
    />
  );
}

/* ------------------------------------------------------------------ money */

/**
 * Rupee amount.
 *
 * Registered with `valueAsNumber` so form state holds a number, never the
 * string the DOM gives back. An empty box becomes 0 rather than NaN: these are
 * "how much do you spend on X" fields, and blank plainly means none.
 *
 * The formatted readout under the box is the error-catcher. A missing or extra
 * zero is invisible in `150000` and obvious in "₹1.5 Lakh", and this form asks
 * for enough large numbers that someone will type one wrong.
 */
export function MoneyInput({
  name,
  placeholder = "0",
  compact = false,
}: {
  name: FieldName;
  placeholder?: string;
  /** Hides the formatted readout, for dense grids of small amounts. */
  compact?: boolean;
}) {
  const { register, watch } = useFormContext<PlanFormValues>();
  const error = useFieldError(name);
  const value = watch(name as never) as unknown as number | undefined;

  return (
    <div>
      <div className="relative">
        <span
          aria-hidden
          className="text-muted pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm"
        >
          ₹
        </span>
        <input
          id={name}
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          {...register(name as never, {
            setValueAs: (v) =>
              v === "" || v === null || v === undefined ? 0 : Number(v),
          })}
          className={inputClass(
            Boolean(error),
            "pl-8 text-right tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          )}
        />
      </div>

      {!compact && typeof value === "number" && value > 0 && (
        <p className="text-muted mt-1 text-right text-xs tabular-nums">
          {formatInr(value)}
        </p>
      )}
      <FieldError message={error} />
    </div>
  );
}

/* ----------------------------------------------------------------- number */

export function NumberInput({
  name,
  suffix,
  min,
  max,
  step = 1,
  placeholder,
}: {
  name: FieldName;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) {
  const { register } = useFormContext<PlanFormValues>();
  const error = useFieldError(name);

  return (
    <div>
      <div className="relative">
        <input
          id={name}
          type="number"
          min={min}
          max={max}
          step={step}
          inputMode="numeric"
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          {...register(name as never, {
            setValueAs: (v) =>
              v === "" || v === null || v === undefined ? 0 : Number(v),
          })}
          className={inputClass(
            Boolean(error),
            cn(
              "tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              suffix && "pr-12",
            ),
          )}
        />
        {suffix && (
          <span
            aria-hidden
            className="text-muted pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs"
          >
            {suffix}
          </span>
        )}
      </div>
      <FieldError message={error} />
    </div>
  );
}

/* ----------------------------------------------------------------- choice */

export function RadioRow<T extends string>({
  name,
  options,
  labels,
}: {
  name: FieldName;
  options: readonly T[];
  labels: Record<T, string>;
}) {
  const { register } = useFormContext<PlanFormValues>();

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((value) => (
        <label
          key={value}
          className={cn(
            "border-line hover:border-navy/30 text-body cursor-pointer rounded-input border px-4 py-2 text-sm transition-colors",
            "has-checked:border-navy has-checked:bg-mist has-checked:text-navy has-checked:font-medium",
            "has-focus-visible:outline-accent has-focus-visible:outline has-focus-visible:outline-2 has-focus-visible:outline-offset-2",
          )}
        >
          <input
            type="radio"
            value={value}
            {...register(name as never)}
            className="sr-only"
          />
          {labels[value]}
        </label>
      ))}
    </div>
  );
}

export function RadioCards<T extends string>({
  name,
  options,
  render,
  columns = 2,
}: {
  name: FieldName;
  options: readonly T[];
  render: (value: T) => { title: string; note?: string };
  columns?: 1 | 2 | 3;
}) {
  const { register } = useFormContext<PlanFormValues>();

  return (
    <div
      className={cn(
        "grid gap-2.5",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
      )}
    >
      {options.map((value) => {
        const { title, note } = render(value);
        return (
          <label
            key={value}
            className={cn(
              "border-line hover:border-navy/30 flex cursor-pointer gap-3 rounded-input border p-4 transition-colors",
              "has-checked:border-navy has-checked:bg-mist",
              "has-focus-visible:outline-accent has-focus-visible:outline has-focus-visible:outline-2 has-focus-visible:outline-offset-2",
            )}
          >
            <input
              type="radio"
              value={value}
              {...register(name as never)}
              className="accent-navy mt-0.5 size-4 shrink-0"
            />
            <span>
              <span className="text-navy block text-sm font-medium">{title}</span>
              {note && (
                <span className="text-muted mt-1 block text-xs leading-relaxed">
                  {note}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function CheckboxField({
  name,
  children,
}: {
  name: FieldName;
  children: ReactNode;
}) {
  const { register } = useFormContext<PlanFormValues>();
  const error = useFieldError(name);

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          {...register(name as never)}
          aria-invalid={Boolean(error)}
          className="accent-navy mt-0.5 size-4 shrink-0"
        />
        <span className="text-body text-xs leading-relaxed">{children}</span>
      </label>
      <FieldError message={error} />
    </div>
  );
}

/* ------------------------------------------------------------------- rate */

/**
 * Percentage input, as a slider and a box together.
 *
 * The slider is for exploring, the box for someone who already knows the
 * number. Both write the same field, so they cannot disagree.
 */
export function RateInput({
  name,
  min,
  max,
  step = 0.5,
  label,
  hint,
}: {
  name: FieldName;
  min: number;
  max: number;
  step?: number;
  label: ReactNode;
  hint?: ReactNode;
}) {
  const { register, watch } = useFormContext<PlanFormValues>();
  const error = useFieldError(name);
  const value = (watch(name as never) as unknown as number | undefined) ?? min;

  const registration = register(name as never, {
    setValueAs: (v) => (v === "" || v === null || v === undefined ? min : Number(v)),
  });

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={name} className="text-navy text-sm font-medium">
          {label}
        </label>
        <span className="text-navy text-sm font-semibold tabular-nums">
          {value}%
        </span>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="range"
          aria-label={typeof label === "string" ? label : undefined}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={registration.onChange}
          name={registration.name}
          className="accent-navy h-1 flex-1 cursor-pointer"
        />
        <input
          id={name}
          type="number"
          min={min}
          max={max}
          step={step}
          inputMode="decimal"
          aria-invalid={Boolean(error)}
          {...registration}
          className={inputClass(
            Boolean(error),
            "w-20 shrink-0 px-2.5 py-1.5 text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          )}
        />
      </div>

      {hint && <p className="text-muted mt-1.5 text-xs leading-relaxed">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
}

/* --------------------------------------------------------------- sections */

export function StepSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-line border-t pt-7", className)}>
      <h3 className="font-display text-navy text-base font-semibold">{title}</h3>
      {description && (
        <p className="text-muted measure mt-1.5 text-xs leading-relaxed">
          {description}
        </p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Running total shown beneath a group of money fields. */
export function TotalRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 rounded-input px-4 py-3",
        emphasis ? "bg-navy text-paper" : "bg-mist",
      )}
    >
      <span
        className={cn(
          "text-sm font-medium",
          emphasis ? "text-paper/80" : "text-muted",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          emphasis ? "text-paper" : "text-navy",
        )}
      >
        ₹{Math.round(value).toLocaleString("en-IN")}
      </span>
    </div>
  );
}
