"use client";

import { useFormContext } from "react-hook-form";
import { Smartphone } from "lucide-react";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ASSUMPTIONS, GOAL_TYPE_META } from "@/lib/plan/catalog";
import type { PlanFormValues } from "@/lib/plan/schema";
import {
  CheckboxField,
  Field,
  RateInput,
  StepSection,
  TextInput,
} from "../fields";

/* ==========================================================================
   Step 5 — the assumptions, then who you are, then consent.

   The contact details live here rather than on step 1 by design. A visitor who
   has worked through four steps of their own figures is in a completely
   different position from one who has just arrived: the plan is built, the
   number unlocks it, and the exchange is obvious to both sides. Asking first
   would have been both worse for conversion and a worse bargain.

   The consent line is the honest half of that exchange. The submission is
   stored the moment it is sent — before the code is entered, not after — so
   the line says plainly where the details go. A lead magnet is a fair trade
   only when both sides can see it.
   ========================================================================== */

export function StepGenerate() {
  const { watch } = useFormContext<PlanFormValues>();

  const goals = watch("goals") ?? [];
  const assets = watch("assets") ?? [];
  const phone = String(watch("phone") ?? "");

  const digits = phone.replace(/\D/g, "").slice(-10);
  const phoneReady = /^[6-9]\d{9}$/.test(digits);

  return (
    <div className="space-y-8">
      <StepSection
        title="Assumptions for the retirement projection"
        description="Your goals each carry their own rates. These three drive the retirement figures, where no single goal sets the number."
        className="border-t-0 pt-0"
      >
        <div className="space-y-7">
          <RateInput
            name="planInflation"
            label="General inflation"
            min={ASSUMPTIONS.inflation.min}
            max={ASSUMPTIONS.inflation.max}
            step={ASSUMPTIONS.inflation.step}
            hint="Seeded at 6% — the top of the RBI's tolerance band, a conventional planning figure rather than a forecast."
          />

          <RateInput
            name="planReturnRate"
            label="Return while you are still working"
            min={ASSUMPTIONS.returnRate.min}
            max={ASSUMPTIONS.returnRate.max}
            step={ASSUMPTIONS.returnRate.step}
            hint="What you assume your investments average between now and retirement."
          />

          <RateInput
            name="postRetirementReturn"
            label="Return once you have retired"
            min={ASSUMPTIONS.postRetirementReturn.min}
            max={ASSUMPTIONS.postRetirementReturn.max}
            step={ASSUMPTIONS.postRetirementReturn.step}
            hint="Usually lower than the figure above, because a portfolio being drawn down is generally held more conservatively."
          />
        </div>
      </StepSection>

      <StepSection title="What we are about to work out">
        <ul className="divide-line border-line divide-y border-y text-sm">
          <SummaryRow
            label="Goals"
            value={
              goals.length === 0
                ? "None added"
                : goals
                    .map((g) => GOAL_TYPE_META[g.type].label)
                    .slice(0, 4)
                    .join(", ") +
                  (goals.length > 4 ? ` +${goals.length - 4} more` : "")
            }
          />
          <SummaryRow
            label="Holdings"
            value={
              assets.length === 0
                ? "Starting from scratch"
                : `${assets.length} ${assets.length === 1 ? "holding" : "holdings"}`
            }
          />
        </ul>
      </StepSection>

      <StepSection
        title="Last thing — where to send it"
        description="We have not asked for either of these until now. The mobile number is how you unlock the plan: we text a six-digit code, you enter it, and the plan opens."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email address" name="email">
            <TextInput
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </Field>

          <Field label="Mobile number" name="phone">
            <TextInput
              name="phone"
              type="tel"
              placeholder="98765 43210"
              autoComplete="tel"
              inputMode="tel"
            />
          </Field>
        </div>

        <div className="border-navy/15 bg-mist rounded-card mt-6 border p-5 sm:p-6">
          <h3 className="font-display text-navy flex items-center gap-2.5 text-sm font-semibold">
            <Smartphone
              aria-hidden
              strokeWidth={1.75}
              className="text-accent size-4"
            />
            One quick check, then your plan opens
          </h3>
          <p className="text-body mt-2.5 text-xs leading-relaxed">
            We will text a six-digit code to{" "}
            <strong className="text-navy">
              {phoneReady ? formatPhone(digits) : "the number above"}
            </strong>
            . Enter it on the next screen and your plan opens straight away —
            about fifteen seconds, and it is the only thing between you and the
            numbers. You can read it on screen or save it as a PDF.
          </p>
        </div>
      </StepSection>

      <div className="space-y-4">
        <CheckboxField name="consent">
          I am happy for Sarvam Associates to hold the details I have entered
          and to contact me about this plan. I understand the plan is an
          illustration built from my own figures and assumptions, and is not
          investment advice.
        </CheckboxField>

        <Disclaimer
          ids={[
            "plan-illustration",
            "plan-assumptions-are-yours",
            "plan-data-handling",
          ]}
          variant="panel"
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-6 py-3">
      <span className="text-muted shrink-0 text-xs">{label}</span>
      <span className="text-navy text-right text-sm font-medium">{value}</span>
    </li>
  );
}

/** 9967354971 -> 99673 54971 */
function formatPhone(digits: string): string {
  return digits.length === 10 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}
