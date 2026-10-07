"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  ALLOCATION_KEYS,
  ALLOCATION_LABELS,
  ASSUMPTIONS,
  GENDER_LABELS,
  GENDERS,
  MARITAL_LABELS,
  MARITAL_STATUSES,
  RISK_PROFILE_META,
  RISK_PROFILES,
} from "@/lib/plan/catalog";
import type { PlanFormValues } from "@/lib/plan/schema";
import { cn } from "@/lib/utils";
import {
  CheckboxField,
  Field,
  FieldError,
  NumberInput,
  RadioCards,
  RadioRow,
  StepSection,
  TextInput,
  useFieldError,
} from "../fields";

/**
 * Step 1 — who you are.
 *
 * The worksheet's "Personal & Family Info" page, minus two things: the PAN
 * lookup at the top of it (see lib/plan/catalog.ts for why), and the contact
 * details, which now sit on the last step.
 *
 * What remains is entirely plan input. The date of birth sets the retirement
 * horizon, marital status frames the household split on step 2, and the risk
 * profile seeds the target mix. Nothing here is a way of reaching anybody.
 */
export function StepPersonal() {
  const { watch, setValue } = useFormContext<PlanFormValues>();

  const riskProfile = watch("riskProfile");
  const allocation = watch("allocation");
  const allocationError = useFieldError("allocation");

  // Picking a risk band reseeds the five boxes, but only on an actual change —
  // otherwise every unrelated re-render would wipe out a hand-tuned mix.
  const previousProfile = useRef(riskProfile);
  useEffect(() => {
    if (previousProfile.current === riskProfile) return;
    previousProfile.current = riskProfile;

    const preset = RISK_PROFILE_META[riskProfile].allocation;
    for (const key of ALLOCATION_KEYS) {
      setValue(`allocation.${key}`, preset[key], { shouldValidate: false });
    }
  }, [riskProfile, setValue]);

  const allocationTotal = ALLOCATION_KEYS.reduce(
    (sum, key) => sum + (Number(allocation?.[key]) || 0),
    0,
  );
  const balanced = Math.abs(allocationTotal - 100) < 0.01;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" className="sm:col-span-2">
          <TextInput name="name" placeholder="As it appears on your records" autoComplete="name" />
        </Field>

        <Field
          label="Date of birth"
          hint="Sets your retirement horizon"
          name="dob"
        >
          <TextInput name="dob" type="date" autoComplete="bday" />
        </Field>

        <Field label="Gender" name="gender">
          <RadioRow name="gender" options={GENDERS} labels={GENDER_LABELS} />
        </Field>

        <Field label="Marital status" name="maritalStatus">
          <RadioRow
            name="maritalStatus"
            options={MARITAL_STATUSES}
            labels={MARITAL_LABELS}
          />
        </Field>
      </div>

      <StepSection
        title="Your horizon"
        description="These two ages set the length of the retirement projection — how long you have to build the corpus, and how long it has to last."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Expected retirement age" name="retirementAge">
            <NumberInput
              name="retirementAge"
              suffix="yrs"
              min={ASSUMPTIONS.retirementAge.min}
              max={ASSUMPTIONS.retirementAge.max}
            />
          </Field>

          <Field
            label="Life expectancy"
            hint="Plan conservatively"
            name="lifeExpectancy"
          >
            <NumberInput
              name="lifeExpectancy"
              suffix="yrs"
              min={ASSUMPTIONS.lifeExpectancy.min}
              max={ASSUMPTIONS.lifeExpectancy.max}
            />
          </Field>
        </div>
      </StepSection>

      <StepSection
        title="Risk profile"
        description="Pick the description that sounds most like you. The mix it suggests is a starting point — adjust the five figures below to whatever you actually want."
      >
        <RadioCards
          name="riskProfile"
          options={RISK_PROFILES}
          render={(value) => ({
            title: RISK_PROFILE_META[value].label,
            note: RISK_PROFILE_META[value].note,
          })}
        />

        <div className="mt-6">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <p className="text-navy text-sm font-medium">Target asset mix</p>
            <p
              className={cn(
                "text-sm font-semibold tabular-nums",
                balanced ? "text-positive" : "text-error",
              )}
            >
              {allocationTotal.toFixed(0)}% of 100%
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {ALLOCATION_KEYS.map((key) => (
              <div key={key}>
                <label
                  htmlFor={`allocation.${key}`}
                  className="text-muted mb-1.5 block text-xs"
                >
                  {ALLOCATION_LABELS[key]}
                </label>
                <NumberInput
                  name={`allocation.${key}`}
                  suffix="%"
                  min={0}
                  max={100}
                />
              </div>
            ))}
          </div>

          <FieldError message={allocationError} />
        </div>
      </StepSection>

      <StepSection
        title="Anything else to look at?"
        description="Both are noted for the advisor. Ticking the second adds a protection section to your plan."
      >
        <div className="space-y-3">
          <CheckboxField name="wantsWill">
            I would like to discuss putting a will in place.
          </CheckboxField>
          <CheckboxField name="wantsInsuranceReview">
            Include a life and health protection section in my plan.
          </CheckboxField>
        </div>
      </StepSection>
    </div>
  );
}
