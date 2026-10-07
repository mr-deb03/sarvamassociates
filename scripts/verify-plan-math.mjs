#!/usr/bin/env node
/**
 * Financial plan arithmetic check.
 *
 * Runs lib/plan/calc.ts against the exact figures on the practice's own
 * planning worksheet and asserts the results, including the two totals the
 * worksheet computes for itself: ₹35,000 family income and ₹13,000 of
 * expenses across the same eleven lines. If those two ever stop matching, the
 * field set has drifted away from the document it was modelled on.
 *
 * Everything else is hand-computed and written out in the comments beside it,
 * so a failure says which formula moved rather than just that a number did.
 *
 * Run: npm run check:plan-math  (also part of `npm run check`)
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Teach Node the `@/` alias and extensionless imports before loading any
// project module. See scripts/ts-loader.mjs.
register("./ts-loader.mjs", pathToFileURL(import.meta.dirname + "/"));

const { computePlan } = await import("../lib/plan/calc.ts");
const { ALLOCATION_LABELS } = await import("../lib/plan/catalog.ts");

/** Fixed so the age-derived figures never depend on the day this runs. */
const NOW = new Date("2026-10-07T00:00:00Z");

const plan = {
  name: "Worksheet Example",
  dob: "2002-02-03",
  gender: "male",
  maritalStatus: "married",
  email: "example@example.com",
  phone: "9967354971",
  retirementAge: 60,
  lifeExpectancy: 85,
  riskProfile: "moderately-aggressive",
  allocation: { equity: 55, debt: 25, cash: 10, commodities: 10, alternatives: 0 },
  wantsWill: true,
  wantsInsuranceReview: true,

  income: { salary: 30000, rental: 5000 },
  monthlySaving: 15000,
  expenses: {
    groceries: 3000,
    transportation: 2000,
    clothing: 1000,
    education: 0,
    houseRent: 0,
    diningOut: 3000,
    electricity: 1000,
    houseServant: 0,
    medical: 1000,
    mobileInternet: 1000,
    other: 1000,
  },
  contingencyMonths: 3,
  incomeShareSelf: 100,
  expenseShareSelf: 100,

  goals: [
    {
      id: "g1",
      type: "child-education",
      subject: "",
      targetYear: 2044, // 18 years out from NOW
      currentCost: 500000,
      inflation: 6,
      returnRate: 15,
      currentMonthlySaving: 0,
      lumpsumSaving: 0,
      annualStepUp: 0,
      protect: false,
    },
  ],
  liabilities: [],
  assets: [],

  planInflation: 6,
  planReturnRate: 10,
  postRetirementReturn: 7,
  consent: true,
};

const result = computePlan(plan, ALLOCATION_LABELS, NOW);

let failures = 0;

/** Tolerance is proportional: these are compounding figures, not integers. */
function check(label, actual, expected, tolPct = 0.5) {
  const tolerance = Math.abs(expected) * (tolPct / 100) + 1;
  const ok = Math.abs(actual - expected) <= tolerance;
  if (!ok) failures += 1;

  const shown = Math.round(actual).toLocaleString("en-IN");
  const want = Math.round(expected).toLocaleString("en-IN");
  console.log(
    `  ${ok ? "ok  " : "FAIL"}  ${label.padEnd(36)} ${shown.padStart(14)}` +
      (ok ? "" : `   expected ~${want}`),
  );
}

console.log("\nCashflow — the worksheet prints these two totals itself");
check("total family income", result.cashflow.totalIncome, 35000);
check("total current expenses", result.cashflow.totalExpenses, 13000);
check("surplus", result.cashflow.surplus, 22000);
check("spare after existing saving", result.cashflow.uncommittedSurplus, 7000);
check("savings rate %", Math.round(result.cashflow.savingsRatePct), 43);
check("3 months of expenses", result.contingency.required, 39000);

console.log("\nGoal — 18 years, 6% inflation, 15% assumed return");
const goal = result.goals[0];
check("years to goal", goal.years, 18, 0);
// 500000 x 1.06^18
check("future cost", goal.futureCost, 1427170);
check("shortfall", goal.gap, 1427170);
// gap / [((1+0.15/12)^216 - 1) / (0.15/12)]
check("required monthly SIP", goal.requiredMonthly, 1309);
// gap / 1.15^18
check("required lump sum today", goal.requiredLumpsum, 115322);

console.log("\nRetirement — age 24 to 60, then 25 years of drawdown");
check("current age", result.retirement.currentAge, 24, 0);
check("years to retirement", result.retirement.yearsToRetirement, 36, 0);
check("years in retirement", result.retirement.yearsInRetirement, 25, 0);
// 13000 x 1.06^36
check("monthly expense at 60", result.retirement.monthlyExpenseAtRetirement, 105914);
// annuity due at the real rate, 1.07/1.06 - 1
check("corpus required", result.retirement.corpusRequired, 28452000);
check("required monthly", result.retirement.requiredMonthly, 6763);

console.log("\nProtection reference");
// 13000 x 12 x 36 years x 100% share
check("income replacement", result.protection.incomeReplacement, 5616000);

console.log("\nTotals — the summary panel");
// Goals plus the retirement corpus. These two must be measured on the same
// basis: a shortfall larger than the total it is measured against reads as a
// bug, and did, until retirement was added to both.
check("total future cost", result.totals.totalFutureCost, 1427170 + 28453514);
if (result.totals.totalGap > result.totals.totalFutureCost) {
  failures += 1;
  console.log("  FAIL  shortfall exceeds the total it is measured against");
}

if (failures === 0) {
  console.log("\n✓ plan math: all checks passed\n");
  process.exit(0);
}

console.error(`\n✗ plan math: ${failures} check(s) failed\n`);
process.exit(1);
