"use client";

import { useFormContext } from "react-hook-form";
import {
  ASSUMPTIONS,
  EXPENSE_FIELDS,
  INCOME_FIELDS,
} from "@/lib/plan/catalog";
import type { PlanFormValues } from "@/lib/plan/schema";
import { cn } from "@/lib/utils";
import {
  Field,
  MoneyInput,
  NumberInput,
  StepSection,
  TotalRow,
} from "../fields";

/**
 * Step 2 — income and expenses.
 *
 * The worksheet's second page. Its two computed boxes — "Total Family Income"
 * and "Total Current Expenses" — are reproduced as live totals rather than as
 * fields, because a figure the form can add up itself is a figure nobody
 * should be able to mistype.
 *
 * Everything here is monthly. Saying so once, at the top, beats repeating
 * "per month" against sixteen labels.
 */
export function StepCashflow() {
  const { watch } = useFormContext<PlanFormValues>();

  const income = watch("income");
  const expenses = watch("expenses");
  const monthlySaving = Number(watch("monthlySaving")) || 0;
  const contingencyMonths = Number(watch("contingencyMonths")) || 0;

  const totalIncome = INCOME_FIELDS.reduce(
    (sum, f) => sum + (Number(income?.[f.key]) || 0),
    0,
  );
  const totalExpenses = EXPENSE_FIELDS.reduce(
    (sum, f) => sum + (Number(expenses?.[f.key]) || 0),
    0,
  );

  const surplus = totalIncome - totalExpenses;
  const spare = surplus - monthlySaving;

  return (
    <div className="space-y-8">
      <p className="text-muted measure-wide text-xs leading-relaxed">
        Every figure on this page is a <strong className="text-navy">monthly</strong>{" "}
        amount. Round numbers are fine — the plan is only ever as precise as
        what goes into it, and a rough answer you are sure of beats an exact one
        you are guessing at.
      </p>

      <StepSection title="Income" className="border-t-0 pt-0">
        <div className="grid gap-5 sm:grid-cols-2">
          {INCOME_FIELDS.map((field) => (
            <Field key={field.key} label={field.label} name={`income.${field.key}`}>
              <MoneyInput name={`income.${field.key}`} />
            </Field>
          ))}

          <Field
            label="Already saving each month"
            hint="RD, SIP, etc."
            name="monthlySaving"
          >
            <MoneyInput name="monthlySaving" />
          </Field>

          <div className="flex items-end">
            <div className="w-full">
              <TotalRow label="Total family income" value={totalIncome} />
            </div>
          </div>
        </div>
      </StepSection>

      <StepSection
        title="Current expenses"
        description="Leave anything that does not apply at zero."
      >
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {EXPENSE_FIELDS.map((field) => (
            <div
              key={field.key}
              className="grid grid-cols-[1fr_auto] items-center gap-3"
            >
              <label
                htmlFor={`expenses.${field.key}`}
                className="text-body text-sm"
              >
                {field.label}
              </label>
              <div className="w-36">
                <MoneyInput name={`expenses.${field.key}`} compact />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <TotalRow label="Total current expenses" value={totalExpenses} />
        </div>
      </StepSection>

      <StepSection
        title="What that leaves"
        description="Income less expenses, and then less what is already committed to savings. The last line is what is genuinely free each month."
      >
        <div className="space-y-2.5">
          <TotalRow label="Surplus before saving" value={surplus} />
          <TotalRow label="Already committed to saving" value={monthlySaving} />
          <TotalRow label="Spare each month" value={spare} emphasis />
        </div>

        {spare < 0 && (
          <p
            role="status"
            className="border-error/30 bg-error/[0.06] text-error mt-4 rounded-input border p-3.5 text-xs leading-relaxed"
          >
            Your expenses and existing savings add up to more than your income.
            That is worth a conversation on its own — carry on and the plan will
            show where the pressure is.
          </p>
        )}
      </StepSection>

      <StepSection
        title="Emergency buffer"
        description="Months of expenses you want held in cash and deposits before anything else is invested."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Buffer to hold" name="contingencyMonths">
            <NumberInput
              name="contingencyMonths"
              suffix="months"
              min={ASSUMPTIONS.contingencyMonths.min}
              max={ASSUMPTIONS.contingencyMonths.max}
            />
          </Field>

          <div className="flex items-end">
            <div className="w-full">
              <TotalRow
                label="That comes to"
                value={totalExpenses * contingencyMonths}
              />
            </div>
          </div>
        </div>
      </StepSection>

      <StepSection
        title="Household split"
        description="If you and a partner share the household, what share of each is yours? Leave both at 100% if the figures above are yours alone."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your share of income" name="incomeShareSelf">
            <NumberInput name="incomeShareSelf" suffix="%" min={0} max={100} />
          </Field>
          <Field label="Your share of expenses" name="expenseShareSelf">
            <NumberInput name="expenseShareSelf" suffix="%" min={0} max={100} />
          </Field>
        </div>
      </StepSection>
    </div>
  );
}

/** Kept here so the surplus colour logic has one home if it ever grows. */
export function surplusTone(value: number): string {
  return cn(value < 0 ? "text-error" : "text-positive");
}
