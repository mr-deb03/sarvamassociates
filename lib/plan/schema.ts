import { z } from "zod";
import { normalizeIndianMobile } from "@/lib/forms/consultation-schema";
import { yearsSince } from "./dates";
import {
  ASSET_TYPES,
  ASSUMPTIONS,
  EXPENSE_FIELDS,
  GENDERS,
  GOAL_TYPES,
  LIABILITY_TYPES,
  MARITAL_STATUSES,
  RISK_PROFILES,
  type ExpenseKey,
} from "./catalog";

/* ==========================================================================
   Financial plan input schema.

   One schema, four consumers: the wizard's per-step validation, the route
   handler that re-validates on arrival, the calculation layer's input type,
   and the stored record. Writing those rules four times would guarantee they
   drift.

   Everything here is money the visitor already knows off the top of their
   head, or an assumption they choose. There is no field for an account
   number, a folio, a PAN, an Aadhaar or a card — a planning illustration does
   not need them, and a website has no business holding them.
   ========================================================================== */

/** Rupee amount. Non-negative, bounded, and tolerant of an empty input box. */
const money = (max = 10_000_000_000) =>
  z.coerce
    .number({ message: "Enter an amount" })
    .min(0, "Cannot be negative")
    .max(max, "That is larger than this planner handles");

/** A 0–100 percentage. */
const percent = (message = "Enter a value between 0 and 100") =>
  z.coerce.number({ message }).min(0, message).max(100, message);

const rate = (bounds: { min: number; max: number }) =>
  z.coerce
    .number({ message: "Enter a rate" })
    .min(bounds.min, `Use at least ${bounds.min}%`)
    .max(bounds.max, `Keep this at or below ${bounds.max}%`);

/* --------------------------------------------------------------- allocation */

export const allocationSchema = z
  .object({
    equity: percent(),
    debt: percent(),
    cash: percent(),
    commodities: percent(),
    alternatives: percent(),
  })
  .refine(
    (a) =>
      Math.abs(
        a.equity + a.debt + a.cash + a.commodities + a.alternatives - 100,
      ) < 0.01,
    { message: "The five allocations need to add up to 100%" },
  );

/* -------------------------------------------------------------------- goals */

export const goalSchema = z.object({
  id: z.string().min(1),
  type: z.enum(GOAL_TYPES),

  subject: z
    .string()
    .trim()
    .max(60, "Please keep this short")
    .optional()
    .default(""),

  /**
   * Calendar year the money is needed.
   *
   * The practice's worksheet derives this from a child's date of birth plus an
   * education age. That is a nicer input for exactly two of the eight goal
   * types and an awkward one for the other six, so the planner asks for the
   * year directly and lets the advisor refine it on the call.
   */
  targetYear: z.coerce
    .number({ message: "Enter a year" })
    .int()
    .min(new Date().getFullYear(), "Pick this year or later")
    .max(new Date().getFullYear() + 60, "That is further out than we model"),

  currentCost: money(1_000_000_000).refine((v) => v > 0, {
    message: "What would this cost today?",
  }),

  inflation: rate(ASSUMPTIONS.inflation),
  returnRate: rate(ASSUMPTIONS.returnRate),

  /** Already being put aside towards this goal, every month. */
  currentMonthlySaving: money(100_000_000).default(0),
  /** Already set aside towards this goal, as a single sum. */
  lumpsumSaving: money(10_000_000_000).default(0),
  /** Yearly increase applied to the monthly contribution. */
  annualStepUp: z.coerce.number().min(0).max(50).default(0),

  /** "PTG" on the worksheet — protect this goal with cover if income stops. */
  protect: z.coerce.boolean().default(false),
});

export type GoalInput = z.input<typeof goalSchema>;
export type GoalData = z.output<typeof goalSchema>;

/* -------------------------------------------------- liabilities and assets */

export const liabilitySchema = z.object({
  id: z.string().min(1),
  type: z.enum(LIABILITY_TYPES),
  label: z.string().trim().max(60).optional().default(""),
  outstanding: money(10_000_000_000).default(0),
  emi: money(100_000_000).default(0),
  /** Years left on the borrowing. 0 means revolving, like a card balance. */
  remainingYears: z.coerce.number().min(0).max(40).default(0),
});

export const assetSchema = z.object({
  id: z.string().min(1),
  type: z.enum(ASSET_TYPES),
  label: z.string().trim().max(60).optional().default(""),
  value: money(10_000_000_000).default(0),
  /**
   * Goal this holding is earmarked against — the worksheet's step 4 mapping.
   * Null means unallocated, which is the interesting case: the report surfaces
   * it as capital doing no particular job.
   */
  mappedGoalId: z.string().nullable().default(null),
});

export type LiabilityInput = z.input<typeof liabilitySchema>;
export type LiabilityData = z.output<typeof liabilitySchema>;
export type AssetInput = z.input<typeof assetSchema>;
export type AssetData = z.output<typeof assetSchema>;

/* ------------------------------------------------------------------ expenses */

/* Built from the catalog rather than typed out, so adding an expense line in
   one place cannot leave the schema behind. The cast names the exact shape
   Object.fromEntries erases. */
const expenseField = () => money(100_000_000).default(0);

const expenseShape = Object.fromEntries(
  EXPENSE_FIELDS.map((f) => [f.key, expenseField()]),
) as Record<ExpenseKey, ReturnType<typeof expenseField>>;

export const expensesSchema = z.object(expenseShape);

/* ------------------------------------------------------------------- whole */

export const planSchema = z.object({
  /* --- Step 1: who you are ------------------------------------------- */
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "That name is longer than we can store"),

  dob: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth")
    .refine((v) => !Number.isNaN(Date.parse(v)), "That is not a real date")
    .refine((v) => {
      const age = yearsSince(v);
      return age >= 18 && age <= 100;
    }, "The planner is built for ages 18 to 100"),

  gender: z.enum(GENDERS),
  maritalStatus: z.enum(MARITAL_STATUSES),

  /* --- Step 5: how to reach you ----------------------------------------
     Asked at the end, not the beginning. See the note on STEP_FIELD_PATHS. */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email address")
    .email("Enter a valid email address"),

  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number")
    .transform(normalizeIndianMobile)
    .refine((v) => /^[6-9]\d{9}$/.test(v), {
      message: "Enter a valid 10-digit Indian mobile number",
    }),

  retirementAge: z.coerce
    .number({ message: "Enter an age" })
    .int()
    .min(ASSUMPTIONS.retirementAge.min, "That is early even for this planner")
    .max(ASSUMPTIONS.retirementAge.max, "Enter a retirement age up to 80"),

  lifeExpectancy: z.coerce
    .number({ message: "Enter an age" })
    .int()
    .min(ASSUMPTIONS.lifeExpectancy.min)
    .max(ASSUMPTIONS.lifeExpectancy.max),

  riskProfile: z.enum(RISK_PROFILES),
  allocation: allocationSchema,

  /* Worksheet checkboxes, carried through to the advisor's brief. */
  wantsWill: z.coerce.boolean().default(false),
  wantsInsuranceReview: z.coerce.boolean().default(false),

  /* --- Step 2: income and expenses ----------------------------------- */
  income: z.object({
    salary: money(100_000_000).default(0),
    rental: money(100_000_000).default(0),
  }),

  /** Postal RD / bank RD / SIP already running, per month. */
  monthlySaving: money(100_000_000).default(0),

  expenses: expensesSchema,

  contingencyMonths: z.coerce
    .number()
    .int()
    .min(ASSUMPTIONS.contingencyMonths.min)
    .max(ASSUMPTIONS.contingencyMonths.max)
    .default(ASSUMPTIONS.contingencyMonths.default),

  /** Share of household income and expenses carried by the applicant. */
  incomeShareSelf: percent().default(100),
  expenseShareSelf: percent().default(100),

  /* --- Step 3: goals and liabilities --------------------------------- */
  goals: z
    .array(goalSchema)
    .min(1, "Add at least one goal — that is what the plan is built around")
    .max(12, "Twelve goals is as many as this planner handles"),

  liabilities: z.array(liabilitySchema).max(12).default([]),

  /* --- Step 4: assets ------------------------------------------------- */
  assets: z.array(assetSchema).max(24).default([]),

  /* --- Step 5: assumptions and consent --------------------------------

     Goals carry their own inflation and return because a wedding and a car do
     not inflate alike. These three are the plan-level figures used where no
     goal owns the number: the retirement projection, and the real value of
     today's money shown in the summary.
     -------------------------------------------------------------------- */
  planInflation: rate(ASSUMPTIONS.inflation).default(ASSUMPTIONS.inflation.default),
  planReturnRate: rate(ASSUMPTIONS.returnRate).default(
    ASSUMPTIONS.returnRate.default,
  ),
  postRetirementReturn: rate(ASSUMPTIONS.postRetirementReturn).default(
    ASSUMPTIONS.postRetirementReturn.default,
  ),

  consent: z.literal(true, {
    message:
      "Please confirm you are happy for Sarvam Associates to hold these details",
  }),

  /**
   * Honeypot. Same reasoning as the consultation form: it always validates, and
   * the route handler quietly drops a filled one rather than returning a field
   * error that tells a bot which trap it fell into.
   */
  company: z.string().optional(),
});

export type PlanInput = z.input<typeof planSchema>;
export type PlanData = z.output<typeof planSchema>;

/**
 * The shape react-hook-form holds while the wizard is open.
 *
 * Not `z.input<...>`: every money and rate field runs through
 * `z.coerce.number()`, whose declared input is `unknown`, which would type the
 * entire form as unknown and throw away field-level autocomplete. The output
 * type is the accurate description of what the form actually holds — the
 * inputs register with `valueAsNumber`, so a number is what lands in state.
 *
 * Two relaxations: `consent` is a boolean until it is true, and the honeypot
 * is optional. Both are re-tightened by the schema at the submit boundary.
 */
export type PlanFormValues = Omit<PlanData, "consent" | "company"> & {
  consent: boolean;
  company?: string;
};

/* ==========================================================================
   Step map

   react-hook-form validates by field path, so each step names the paths it
   owns. Arrays are named by their root: `trigger("goals")` walks every element
   through goalSchema, which is what we want when leaving the goals step.
   ========================================================================== */

export const PLAN_STEPS = [
  { id: "personal", title: "About you", subtitle: "Personal & family details" },
  { id: "cashflow", title: "Money in, money out", subtitle: "Income & expenses" },
  { id: "goals", title: "What you are planning for", subtitle: "Goals & liabilities" },
  { id: "assets", title: "What you already hold", subtitle: "Assets & mapping" },
  { id: "generate", title: "Generate your plan", subtitle: "Review & verify" },
] as const;

export type PlanStepId = (typeof PLAN_STEPS)[number]["id"];

/*
   `email` and `phone` sit in the LAST step, not the first.

   Asking a stranger for a mobile number before they have typed anything is
   where this kind of form loses people — and it is the wrong trade besides.
   By the final step they have spent ten minutes on their own figures, and the
   number buys them the result: a bargain either side can see. Everything on
   step 1 is a plan input — the date of birth drives the retirement horizon,
   and marital status frames the household questions.
*/
export const STEP_FIELD_PATHS: Record<PlanStepId, readonly string[]> = {
  personal: [
    "name",
    "dob",
    "gender",
    "maritalStatus",
    "retirementAge",
    "lifeExpectancy",
    "riskProfile",
    "allocation",
  ],
  cashflow: [
    "income",
    "monthlySaving",
    "expenses",
    "contingencyMonths",
    "incomeShareSelf",
    "expenseShareSelf",
  ],
  goals: ["goals", "liabilities"],
  assets: ["assets"],
  generate: [
    "planInflation",
    "planReturnRate",
    "postRetirementReturn",
    "email",
    "phone",
    "consent",
  ],
};

/* ==========================================================================
   OTP verification
   ========================================================================== */

export const otpRequestSchema = z.object({
  planId: z.string().min(8).max(64),
});

export const otpVerifySchema = z.object({
  planId: z.string().min(8).max(64),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code we sent you"),
});

/* ------------------------------------------------------------------ helpers */

export { yearsSince };
