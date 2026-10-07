"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  ASSUMPTIONS,
  GOAL_TYPE_META,
  GOAL_TYPES,
  LIABILITY_LABELS,
  LIABILITY_TYPES,
  type GoalType,
} from "@/lib/plan/catalog";
import { formatInr } from "@/lib/content/display";
import type { PlanFormValues } from "@/lib/plan/schema";
import { cn } from "@/lib/utils";
import {
  CheckboxField,
  Field,
  FieldError,
  MoneyInput,
  NumberInput,
  RateInput,
  StepSection,
  TextInput,
  useFieldError,
} from "../fields";
import { GoalIcon } from "../GoalIcon";

/* ==========================================================================
   Step 3 — goals and liabilities.

   The worksheet's Quick Goal Maker: eight tiles, each adding a card. The card
   asks for what the goal costs today and when it is needed, and the plan does
   the inflating and the compounding.

   Every rate on a card is per goal rather than per plan, which is the whole
   reason this step is not a single table: a wedding in twenty years and a car
   in five are not the same arithmetic problem, and forcing one inflation
   figure across both would make the output wrong in a way nobody would notice.
   ========================================================================== */

let counter = 0;
const nextId = () => `g${Date.now().toString(36)}${(counter += 1).toString(36)}`;

export function StepGoals() {
  const { control } = useFormContext<PlanFormValues>();
  const currentYear = new Date().getFullYear();

  const goals = useFieldArray({ control, name: "goals" });
  const liabilities = useFieldArray({ control, name: "liabilities" });
  const goalsError = useFieldError("goals");

  const addGoal = (type: GoalType) => {
    const meta = GOAL_TYPE_META[type];
    goals.append({
      id: nextId(),
      type,
      subject: "",
      targetYear: currentYear + meta.defaultHorizonYears,
      currentCost: 0,
      inflation: meta.defaultInflation,
      returnRate: ASSUMPTIONS.returnRate.default,
      currentMonthlySaving: 0,
      lumpsumSaving: 0,
      annualStepUp: 0,
      protect: false,
    });
  };

  return (
    <div className="space-y-8">
      <StepSection
        title="Add a goal"
        description="Pick as many as apply. Each one becomes a card below that you fill in."
        className="border-t-0 pt-0"
      >
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {GOAL_TYPES.map((type) => (
            <li key={type}>
              <button
                type="button"
                onClick={() => addGoal(type)}
                className={cn(
                  "border-line hover:border-navy/30 hover:bg-mist group flex w-full flex-col items-center gap-2.5 rounded-input border p-4 text-center transition-colors",
                  "focus-visible:outline-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
              >
                <GoalIcon type={type} className="text-navy size-6" />
                <span className="text-navy text-xs leading-tight font-medium">
                  {GOAL_TYPE_META[type].label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <FieldError message={goalsError} />
      </StepSection>

      {goals.fields.length > 0 && (
        <StepSection
          title={`Your goals (${goals.fields.length})`}
          description="Enter what each would cost in today's money. The plan works out what it will cost by the time you need it."
        >
          <ol className="space-y-5">
            {goals.fields.map((field, index) => (
              <GoalCard
                key={field.id}
                index={index}
                currentYear={currentYear}
                onRemove={() => goals.remove(index)}
              />
            ))}
          </ol>
        </StepSection>
      )}

      <StepSection
        title="What you owe"
        description="Loans and card balances. These are not subtracted from your goals — they sit against your net worth, and against the protection figure if you asked for one."
      >
        {liabilities.fields.length === 0 ? (
          <p className="text-muted text-xs">Nothing added. Skip this if you have no borrowings.</p>
        ) : (
          <ul className="space-y-4">
            {liabilities.fields.map((field, index) => (
              <li
                key={field.id}
                className="border-line rounded-input border p-4"
              >
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
                  <Field label="Type" name={`liabilities.${index}.type`}>
                    <LiabilitySelect index={index} />
                  </Field>

                  <Field
                    label="Outstanding"
                    name={`liabilities.${index}.outstanding`}
                  >
                    <MoneyInput
                      name={`liabilities.${index}.outstanding`}
                      compact
                    />
                  </Field>

                  <Field label="Monthly EMI" name={`liabilities.${index}.emi`}>
                    <MoneyInput name={`liabilities.${index}.emi`} compact />
                  </Field>

                  <RemoveButton
                    label="Remove this borrowing"
                    onClick={() => liabilities.remove(index)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() =>
            liabilities.append({
              id: nextId(),
              type: "home-loan",
              label: "",
              outstanding: 0,
              emi: 0,
              remainingYears: 0,
            })
          }
          className="text-navy hover:text-accent-ink mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus strokeWidth={2} aria-hidden className="size-4" />
          Add a loan or card balance
        </button>
      </StepSection>
    </div>
  );
}

/* ----------------------------------------------------------------- a goal */

function GoalCard({
  index,
  currentYear,
  onRemove,
}: {
  index: number;
  currentYear: number;
  onRemove: () => void;
}) {
  const { watch } = useFormContext<PlanFormValues>();

  const type = watch(`goals.${index}.type`) as GoalType;
  const meta = GOAL_TYPE_META[type];
  const targetYear = Number(watch(`goals.${index}.targetYear`)) || currentYear;
  const currentCost = Number(watch(`goals.${index}.currentCost`)) || 0;
  const inflation = Number(watch(`goals.${index}.inflation`)) || 0;

  const years = Math.max(0, targetYear - currentYear);
  const futureCost = currentCost * Math.pow(1 + inflation / 100, years);

  return (
    <li className="border-line bg-card rounded-card border p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span
            aria-hidden
            className="bg-navy/[0.05] text-navy grid size-10 shrink-0 place-items-center rounded-full"
          >
            <GoalIcon type={type} className="size-5" />
          </span>
          <div>
            <h4 className="font-display text-navy text-sm font-semibold">
              {meta.label}
            </h4>
            <p className="text-muted text-xs">
              {years === 0
                ? "Needed this year"
                : `${years} ${years === 1 ? "year" : "years"} away`}
            </p>
          </div>
        </div>

        <RemoveButton label={`Remove the ${meta.label} goal`} onClick={onRemove} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={meta.subjectLabel} name={`goals.${index}.subject`}>
          <TextInput
            name={`goals.${index}.subject`}
            placeholder={meta.subjectPlaceholder}
          />
        </Field>

        <Field
          label="Year you will need it"
          hint={years === 0 ? "This year" : `${years} yrs`}
          name={`goals.${index}.targetYear`}
        >
          <NumberInput
            name={`goals.${index}.targetYear`}
            min={currentYear}
            max={currentYear + 60}
          />
        </Field>

        <Field
          label="What it costs today"
          hint="In today's money"
          name={`goals.${index}.currentCost`}
        >
          <MoneyInput name={`goals.${index}.currentCost`} />
        </Field>

        <div className="bg-mist rounded-input p-4">
          <p className="text-muted text-xs">Projected cost in {targetYear}</p>
          <p className="font-display text-navy mt-1 text-lg font-bold tabular-nums">
            {currentCost > 0 ? formatInr(Math.round(futureCost)) : "—"}
          </p>
          <p className="text-muted mt-1 text-xs leading-relaxed">
            At {inflation}% a year, which you set below.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <RateInput
          name={`goals.${index}.inflation`}
          label="Cost rises by"
          min={ASSUMPTIONS.inflation.min}
          max={ASSUMPTIONS.inflation.max}
          step={ASSUMPTIONS.inflation.step}
          hint="How fast you think this particular cost goes up."
        />
        <RateInput
          name={`goals.${index}.returnRate`}
          label="You assume investments return"
          min={ASSUMPTIONS.returnRate.min}
          max={ASSUMPTIONS.returnRate.max}
          step={ASSUMPTIONS.returnRate.step}
          hint="Your assumption, not ours. Nothing here is a forecast."
        />
      </div>

      <details className="group mt-5">
        <summary className="text-navy hover:text-accent-ink cursor-pointer list-none text-sm font-medium transition-colors">
          <span className="group-open:hidden">
            + Already saving towards this?
          </span>
          <span className="hidden group-open:inline">
            − Already saving towards this?
          </span>
        </summary>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field
            label="Saving monthly"
            name={`goals.${index}.currentMonthlySaving`}
          >
            <MoneyInput name={`goals.${index}.currentMonthlySaving`} compact />
          </Field>

          <Field label="Set aside already" name={`goals.${index}.lumpsumSaving`}>
            <MoneyInput name={`goals.${index}.lumpsumSaving`} compact />
          </Field>

          <Field
            label="Increase saving yearly"
            hint="Optional"
            name={`goals.${index}.annualStepUp`}
          >
            <NumberInput
              name={`goals.${index}.annualStepUp`}
              suffix="%"
              min={0}
              max={50}
            />
          </Field>
        </div>

        <div className="mt-4">
          <CheckboxField name={`goals.${index}.protect`}>
            Treat this as a goal that must happen even if my income stops. We
            will include it in the protection section of your plan.
          </CheckboxField>
        </div>
      </details>
    </li>
  );
}

/* ---------------------------------------------------------------- helpers */

function LiabilitySelect({ index }: { index: number }) {
  const { register } = useFormContext<PlanFormValues>();

  return (
    <select
      id={`liabilities.${index}.type`}
      {...register(`liabilities.${index}.type`)}
      className="border-line bg-card text-navy focus:border-navy focus:ring-navy/15 w-full rounded-input border px-3.5 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none"
    >
      {LIABILITY_TYPES.map((type) => (
        <option key={type} value={type}>
          {LIABILITY_LABELS[type]}
        </option>
      ))}
    </select>
  );
}

function RemoveButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="text-muted hover:text-error hover:bg-error/[0.06] grid size-9 shrink-0 place-items-center rounded-full transition-colors"
    >
      <Trash2 strokeWidth={1.75} aria-hidden className="size-4" />
    </button>
  );
}
