"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  ASSET_TYPE_META,
  ASSET_TYPES,
  GOAL_TYPE_META,
  type AssetType,
} from "@/lib/plan/catalog";
import type { PlanFormValues } from "@/lib/plan/schema";
import { Field, MoneyInput, StepSection, TextInput, TotalRow } from "../fields";

/* ==========================================================================
   Step 4 — what you already hold, and what it is for.

   The mapping column is the point of this step. A holding earmarked against a
   goal is counted towards that goal; one left unallocated falls through to the
   retirement projection, and the report names it as capital doing no
   particular job. That distinction is most of what the worksheet's "Assets &
   Mapping" page exists to draw out.

   Some asset types cannot be mapped — a self-occupied house and an EPF balance
   are not going to pay for a car in five years. Those rows render without a
   goal selector rather than offering one that would quietly lie.
   ========================================================================== */

let counter = 0;
const nextId = () => `a${Date.now().toString(36)}${(counter += 1).toString(36)}`;

export function StepAssets() {
  const { control, watch } = useFormContext<PlanFormValues>();
  const assets = useFieldArray({ control, name: "assets" });

  const watchedAssets = watch("assets") ?? [];
  const liabilities = watch("liabilities") ?? [];

  const totalAssets = watchedAssets.reduce(
    (sum, a) => sum + (Number(a?.value) || 0),
    0,
  );
  const totalLiabilities = liabilities.reduce(
    (sum, l) => sum + (Number(l?.outstanding) || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <StepSection
        title="Your holdings"
        description="Current values, roughly. Skip anything you would rather not put in a web form — the plan will simply show a larger gap than you actually have, which is the safer way to be wrong."
        className="border-t-0 pt-0"
      >
        {assets.fields.length === 0 ? (
          <p className="text-muted text-xs">
            Nothing added yet. If you are starting from scratch, carry on — the
            plan works perfectly well from zero.
          </p>
        ) : (
          <ul className="space-y-4">
            {assets.fields.map((field, index) => (
              <AssetRow
                key={field.id}
                index={index}
                onRemove={() => assets.remove(index)}
              />
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() =>
            assets.append({
              id: nextId(),
              type: "equity-mf",
              label: "",
              value: 0,
              mappedGoalId: null,
            })
          }
          className="text-navy hover:text-accent-ink mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus strokeWidth={2} aria-hidden className="size-4" />
          Add a holding
        </button>
      </StepSection>

      <StepSection
        title="Where that leaves you"
        description="Everything you hold, less everything you owe."
      >
        <div className="space-y-2.5">
          <TotalRow label="Total assets" value={totalAssets} />
          <TotalRow label="Total liabilities" value={totalLiabilities} />
          <TotalRow
            label="Net worth"
            value={totalAssets - totalLiabilities}
            emphasis
          />
        </div>
      </StepSection>
    </div>
  );
}

function AssetRow({
  index,
  onRemove,
}: {
  index: number;
  onRemove: () => void;
}) {
  const { register, watch } = useFormContext<PlanFormValues>();

  const type = watch(`assets.${index}.type`) as AssetType;
  const goals = watch("goals") ?? [];
  const mappable = ASSET_TYPE_META[type]?.mappable ?? false;

  return (
    <li className="border-line rounded-input border p-4">
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-end">
        <Field label="What is it" name={`assets.${index}.type`}>
          <select
            id={`assets.${index}.type`}
            {...register(`assets.${index}.type`)}
            className="border-line bg-card text-navy focus:border-navy focus:ring-navy/15 w-full rounded-input border px-3.5 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none"
          >
            {ASSET_TYPES.map((value) => (
              <option key={value} value={value}>
                {ASSET_TYPE_META[value].label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Current value"
          name={`assets.${index}.value`}
        >
          <MoneyInput name={`assets.${index}.value`} compact />
        </Field>

        {mappable ? (
          <Field label="Earmarked for" name={`assets.${index}.mappedGoalId`}>
            <select
              id={`assets.${index}.mappedGoalId`}
              {...register(`assets.${index}.mappedGoalId`, {
                // An empty <option> value is the string "", but the schema and
                // the calculation both treat "no goal" as null.
                setValueAs: (v) => (v === "" ? null : v),
              })}
              className="border-line bg-card text-navy focus:border-navy focus:ring-navy/15 w-full rounded-input border px-3.5 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none"
            >
              <option value="">Nothing in particular</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {GOAL_TYPE_META[goal.type].label}
                  {goal.subject ? ` — ${goal.subject}` : ""}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <div className="self-end pb-2.5">
            <p className="text-muted text-xs leading-relaxed">
              Counted towards retirement and net worth, not against a single
              goal.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove this holding"
          className="text-muted hover:text-error hover:bg-error/[0.06] grid size-9 shrink-0 place-items-center rounded-full transition-colors sm:mb-1"
        >
          <Trash2 strokeWidth={1.75} aria-hidden className="size-4" />
        </button>
      </div>

      <div className="mt-4">
        <Field
          label="Label"
          hint="Optional — helps you tell two of the same apart"
          name={`assets.${index}.label`}
        >
          <TextInput
            name={`assets.${index}.label`}
            placeholder="e.g. HDFC Flexi Cap"
          />
        </Field>
      </div>
    </li>
  );
}
