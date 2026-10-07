import {
  ASSET_TYPE_META,
  EXPENSE_FIELDS,
  GOAL_TYPE_META,
  type Allocation,
  type AssetType,
} from "./catalog";
import { yearsSince } from "./dates";
import type { PlanData } from "./schema";

/* ==========================================================================
   Financial plan arithmetic.

   Pure functions, no React, no I/O. The wizard calls these to preview, the
   route handler calls them to store a computed snapshot, and the report
   renders that snapshot. All three therefore show the same numbers.

   WHAT THIS IS

   Compound arithmetic over the figures the visitor typed, at the rates the
   visitor chose. That is all. It assumes a constant rate of return, which no
   real investment delivers, and it cannot know anything the visitor did not
   enter. Every surface that renders these numbers says so — see
   DISCLAIMERS["plan-illustration"].

   Nothing in this file decides what anyone should buy.
   ========================================================================== */

const MONTHS = 12;

/** Future value of a single sum. */
function fvLumpsum(principal: number, annualRate: number, years: number): number {
  return principal * Math.pow(1 + annualRate / 100, years);
}

/**
 * Future value of a monthly contribution that steps up once a year.
 *
 * Computed year by year rather than in closed form: each year's twelve
 * payments are grown to the end of that year, then compounded for the years
 * that remain. A closed form exists but is unreadable, and this runs over a
 * horizon of at most 60 iterations.
 */
function fvSteppedSip(
  monthly: number,
  annualRate: number,
  years: number,
  stepUpPct: number,
): number {
  if (monthly <= 0 || years <= 0) return 0;

  const i = annualRate / 100 / MONTHS;
  const wholeYears = Math.floor(years);
  const yearFactor = i === 0 ? MONTHS : (Math.pow(1 + i, MONTHS) - 1) / i;

  let total = 0;
  for (let y = 0; y < wholeYears; y += 1) {
    const payment = monthly * Math.pow(1 + stepUpPct / 100, y);
    const grownToYearEnd = payment * yearFactor;
    const remainingMonths = (wholeYears - 1 - y) * MONTHS;
    total += grownToYearEnd * Math.pow(1 + i, remainingMonths);
  }

  // Part-year tail, if the horizon is not a whole number of years.
  const tailMonths = Math.round((years - wholeYears) * MONTHS);
  if (tailMonths > 0) {
    const payment = monthly * Math.pow(1 + stepUpPct / 100, wholeYears);
    const tailFactor =
      i === 0 ? tailMonths : (Math.pow(1 + i, tailMonths) - 1) / i;
    total += payment * tailFactor;
  }

  return total;
}

/** The level monthly contribution that reaches `target` over `years`. */
function monthlyForTarget(
  target: number,
  annualRate: number,
  years: number,
): number {
  if (target <= 0 || years <= 0) return 0;
  const i = annualRate / 100 / MONTHS;
  const n = Math.round(years * MONTHS);
  const factor = i === 0 ? n : (Math.pow(1 + i, n) - 1) / i;
  return target / factor;
}

/** The single sum invested today that reaches `target` over `years`. */
function lumpsumForTarget(
  target: number,
  annualRate: number,
  years: number,
): number {
  if (target <= 0) return 0;
  return target / Math.pow(1 + annualRate / 100, years);
}

const round = (n: number) => Math.round(n) || 0;
const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

/* ==========================================================================
   Cashflow
   ========================================================================== */

export interface CashflowResult {
  totalIncome: number;
  totalExpenses: number;
  /** Income minus expenses, before anything is put aside. */
  surplus: number;
  /** Already committed to RDs and SIPs each month. */
  committedSaving: number;
  /** Surplus that is not yet doing anything. */
  uncommittedSurplus: number;
  savingsRatePct: number;
  expenseRatioPct: number;
  /** Largest expense lines, biggest first. */
  topExpenses: { key: string; label: string; amount: number; sharePct: number }[];
}

export function computeCashflow(plan: PlanData): CashflowResult {
  const totalIncome = plan.income.salary + plan.income.rental;
  const expenseEntries = EXPENSE_FIELDS.map((f) => ({
    key: f.key,
    label: f.label,
    amount: plan.expenses[f.key],
  }));
  const totalExpenses = sum(expenseEntries.map((e) => e.amount));

  const surplus = totalIncome - totalExpenses;
  const committedSaving = plan.monthlySaving;

  return {
    totalIncome: round(totalIncome),
    totalExpenses: round(totalExpenses),
    surplus: round(surplus),
    committedSaving: round(committedSaving),
    uncommittedSurplus: round(surplus - committedSaving),
    savingsRatePct: totalIncome > 0 ? (committedSaving / totalIncome) * 100 : 0,
    expenseRatioPct: totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0,
    topExpenses: expenseEntries
      .filter((e) => e.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .map((e) => ({
        ...e,
        amount: round(e.amount),
        sharePct: totalExpenses > 0 ? (e.amount / totalExpenses) * 100 : 0,
      })),
  };
}

/* ==========================================================================
   Contingency fund

   Counted as liquid: savings balances and deposits. Nothing else — equity can
   be down exactly when the emergency arrives, which is the entire reason the
   buffer exists.
   ========================================================================== */

const LIQUID_ASSET_TYPES: readonly AssetType[] = ["cash", "fd-rd"];

export interface ContingencyResult {
  monthsTargeted: number;
  required: number;
  available: number;
  gap: number;
  /** Months of expenses the current liquid balance actually covers. */
  monthsCovered: number;
}

export function computeContingency(
  plan: PlanData,
  cashflow: CashflowResult,
): ContingencyResult {
  const required = cashflow.totalExpenses * plan.contingencyMonths;
  const available = sum(
    plan.assets
      .filter((a) => LIQUID_ASSET_TYPES.includes(a.type))
      .map((a) => a.value),
  );

  return {
    monthsTargeted: plan.contingencyMonths,
    required: round(required),
    available: round(available),
    gap: round(Math.max(0, required - available)),
    monthsCovered:
      cashflow.totalExpenses > 0 ? available / cashflow.totalExpenses : 0,
  };
}

/* ==========================================================================
   Goals
   ========================================================================== */

export interface GoalResult {
  id: string;
  type: PlanData["goals"][number]["type"];
  label: string;
  subject: string;
  targetYear: number;
  years: number;
  /** True when the money is needed this year — nothing left to compound. */
  immediate: boolean;

  currentCost: number;
  inflationPct: number;
  returnPct: number;
  futureCost: number;

  /** What today's arrangements grow into by the target year. */
  provisionFromLumpsum: number;
  provisionFromSip: number;
  provisionFromMappedAssets: number;
  totalProvision: number;

  gap: number;
  fundedPct: number;

  /** Extra contribution needed to close the gap. */
  requiredMonthly: number;
  requiredLumpsum: number;

  protect: boolean;
  mappedAssetIds: string[];
}

export function computeGoal(
  goal: PlanData["goals"][number],
  assets: PlanData["assets"],
  currentYear: number,
): GoalResult {
  const years = Math.max(0, goal.targetYear - currentYear);
  const immediate = years === 0;

  const futureCost = fvLumpsum(goal.currentCost, goal.inflation, years);

  const mapped = assets.filter((a) => a.mappedGoalId === goal.id);
  const mappedValue = sum(mapped.map((a) => a.value));

  const provisionFromLumpsum = fvLumpsum(goal.lumpsumSaving, goal.returnRate, years);
  const provisionFromSip = fvSteppedSip(
    goal.currentMonthlySaving,
    goal.returnRate,
    years,
    goal.annualStepUp,
  );
  const provisionFromMappedAssets = fvLumpsum(mappedValue, goal.returnRate, years);

  const totalProvision =
    provisionFromLumpsum + provisionFromSip + provisionFromMappedAssets;
  const gap = Math.max(0, futureCost - totalProvision);

  const meta = GOAL_TYPE_META[goal.type];

  return {
    id: goal.id,
    type: goal.type,
    label: meta.label,
    subject: goal.subject ?? "",
    targetYear: goal.targetYear,
    years,
    immediate,

    currentCost: round(goal.currentCost),
    inflationPct: goal.inflation,
    returnPct: goal.returnRate,
    futureCost: round(futureCost),

    provisionFromLumpsum: round(provisionFromLumpsum),
    provisionFromSip: round(provisionFromSip),
    provisionFromMappedAssets: round(provisionFromMappedAssets),
    totalProvision: round(totalProvision),

    gap: round(gap),
    fundedPct:
      futureCost > 0 ? Math.min(100, (totalProvision / futureCost) * 100) : 100,

    // With no time left there is nothing for a monthly contribution to do, so
    // the whole shortfall shows as a sum needed now rather than as an
    // implausibly large SIP.
    requiredMonthly: immediate ? 0 : round(monthlyForTarget(gap, goal.returnRate, years)),
    requiredLumpsum: immediate
      ? round(gap)
      : round(lumpsumForTarget(gap, goal.returnRate, years)),

    protect: goal.protect,
    mappedAssetIds: mapped.map((a) => a.id),
  };
}

/* ==========================================================================
   Retirement

   Kept separate from the goal list because it is driven by the two ages on
   step 1, not by a tile on step 3 — and because the corpus is an annuity
   problem rather than a single future cost.

   The projection assumes expenses continue at today's level, inflated. Using
   today's full figure rather than a reduced one is the conservative choice and
   avoids inventing a replacement ratio, so it is what the report states.
   ========================================================================== */

export interface RetirementResult {
  applicable: boolean;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  yearsToRetirement: number;
  yearsInRetirement: number;

  monthlyExpenseToday: number;
  monthlyExpenseAtRetirement: number;
  corpusRequired: number;

  provision: number;
  provisionSources: { label: string; value: number }[];
  gap: number;
  fundedPct: number;
  requiredMonthly: number;
  requiredLumpsum: number;
}

/** Vehicles that exist for retirement and cannot be earmarked elsewhere. */
const RETIREMENT_ASSET_TYPES: readonly AssetType[] = ["ppf-epf", "nps"];

export function computeRetirement(
  plan: PlanData,
  cashflow: CashflowResult,
): RetirementResult {
  const currentAge = yearsSince(plan.dob);
  const yearsToRetirement = Math.max(0, plan.retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, plan.lifeExpectancy - plan.retirementAge);

  const monthlyExpenseToday = cashflow.totalExpenses;
  const monthlyExpenseAtRetirement = fvLumpsum(
    monthlyExpenseToday,
    plan.planInflation,
    yearsToRetirement,
  );
  const annualAtRetirement = monthlyExpenseAtRetirement * MONTHS;

  // Corpus is the present value, at retirement, of an income that itself rises
  // with inflation. Discounting at the real rate is what makes that work:
  // a 7% portfolio against 6% inflation sustains far less than 7% suggests.
  const realRate =
    (1 + plan.postRetirementReturn / 100) / (1 + plan.planInflation / 100) - 1;

  let corpusRequired: number;
  if (yearsInRetirement <= 0) {
    corpusRequired = 0;
  } else if (Math.abs(realRate) < 1e-9) {
    corpusRequired = annualAtRetirement * yearsInRetirement;
  } else {
    // Annuity due — the first year is drawn at the start of retirement.
    corpusRequired =
      annualAtRetirement *
      ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate) *
      (1 + realRate);
  }

  const retirementAssets = plan.assets.filter((a) =>
    RETIREMENT_ASSET_TYPES.includes(a.type),
  );
  const unmappedAssets = plan.assets.filter(
    (a) =>
      a.mappedGoalId === null &&
      ASSET_TYPE_META[a.type].mappable &&
      !LIQUID_ASSET_TYPES.includes(a.type),
  );

  const provisionSources = [
    ...retirementAssets.map((a) => ({
      label: a.label || ASSET_TYPE_META[a.type].label,
      value: round(fvLumpsum(a.value, plan.planReturnRate, yearsToRetirement)),
    })),
    ...unmappedAssets.map((a) => ({
      label: `${a.label || ASSET_TYPE_META[a.type].label} (unallocated)`,
      value: round(fvLumpsum(a.value, plan.planReturnRate, yearsToRetirement)),
    })),
  ].filter((s) => s.value > 0);

  const provision = sum(provisionSources.map((s) => s.value));
  const gap = Math.max(0, corpusRequired - provision);

  return {
    applicable: yearsToRetirement > 0 && yearsInRetirement > 0,
    currentAge,
    retirementAge: plan.retirementAge,
    lifeExpectancy: plan.lifeExpectancy,
    yearsToRetirement,
    yearsInRetirement,

    monthlyExpenseToday: round(monthlyExpenseToday),
    monthlyExpenseAtRetirement: round(monthlyExpenseAtRetirement),
    corpusRequired: round(corpusRequired),

    provision: round(provision),
    provisionSources,
    gap: round(gap),
    fundedPct:
      corpusRequired > 0
        ? Math.min(100, (provision / corpusRequired) * 100)
        : 100,
    requiredMonthly: round(
      monthlyForTarget(gap, plan.planReturnRate, yearsToRetirement),
    ),
    requiredLumpsum: round(
      lumpsumForTarget(gap, plan.planReturnRate, yearsToRetirement),
    ),
  };
}

/* ==========================================================================
   Net worth and allocation
   ========================================================================== */

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  totalEmi: number;
  emiToIncomePct: number;
  assetsByType: { type: AssetType; label: string; value: number; sharePct: number }[];
  liabilities: { id: string; label: string; outstanding: number; emi: number }[];
  /** Holdings with no goal against them. */
  unallocatedValue: number;
}

export function computeNetWorth(
  plan: PlanData,
  cashflow: CashflowResult,
): NetWorthResult {
  const totalAssets = sum(plan.assets.map((a) => a.value));
  const totalLiabilities = sum(plan.liabilities.map((l) => l.outstanding));
  const totalEmi = sum(plan.liabilities.map((l) => l.emi));

  const byType = new Map<AssetType, number>();
  for (const a of plan.assets) {
    byType.set(a.type, (byType.get(a.type) ?? 0) + a.value);
  }

  return {
    totalAssets: round(totalAssets),
    totalLiabilities: round(totalLiabilities),
    netWorth: round(totalAssets - totalLiabilities),
    totalEmi: round(totalEmi),
    emiToIncomePct:
      cashflow.totalIncome > 0 ? (totalEmi / cashflow.totalIncome) * 100 : 0,
    assetsByType: [...byType.entries()]
      .map(([type, value]) => ({
        type,
        label: ASSET_TYPE_META[type].label,
        value: round(value),
        sharePct: totalAssets > 0 ? (value / totalAssets) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value),
    liabilities: plan.liabilities.map((l) => ({
      id: l.id,
      label: l.label || l.type,
      outstanding: round(l.outstanding),
      emi: round(l.emi),
    })),
    unallocatedValue: round(
      sum(
        plan.assets
          .filter((a) => a.mappedGoalId === null && ASSET_TYPE_META[a.type].mappable)
          .map((a) => a.value),
      ),
    ),
  };
}

export interface AllocationComparison {
  sleeve: keyof Allocation;
  label: string;
  targetPct: number;
  currentPct: number;
  currentValue: number;
  /** Positive means over the chosen target. */
  driftPct: number;
}

export function compareAllocation(
  plan: PlanData,
  labels: Record<keyof Allocation, string>,
): AllocationComparison[] {
  const totals: Record<keyof Allocation, number> = {
    equity: 0,
    debt: 0,
    cash: 0,
    commodities: 0,
    alternatives: 0,
  };

  for (const a of plan.assets) {
    totals[ASSET_TYPE_META[a.type].sleeve] += a.value;
  }

  const grand = sum(Object.values(totals));

  return (Object.keys(totals) as (keyof Allocation)[]).map((sleeve) => {
    const currentPct = grand > 0 ? (totals[sleeve] / grand) * 100 : 0;
    return {
      sleeve,
      label: labels[sleeve],
      targetPct: plan.allocation[sleeve],
      currentPct,
      currentValue: round(totals[sleeve]),
      driftPct: currentPct - plan.allocation[sleeve],
    };
  });
}

/* ==========================================================================
   Protection reference

   Rendered only when the visitor ticked the insurance box, and framed as
   arithmetic rather than as a recommendation: liabilities that would fall to
   the family, plus the future cost of every goal flagged "protect", plus
   income replacement to retirement. The report prints each of the three lines
   so the figure can be argued with.

   This is not a recommendation of cover, an assessment of need, or a
   solicitation. IRDAI wording and the not-investment-advice notice sit
   alongside it.
   ========================================================================== */

export interface ProtectionResult {
  requested: boolean;
  liabilitiesCover: number;
  protectedGoalsCover: number;
  incomeReplacement: number;
  total: number;
  protectedGoalLabels: string[];
}

export function computeProtection(
  plan: PlanData,
  goals: GoalResult[],
  netWorth: NetWorthResult,
  cashflow: CashflowResult,
  retirement: RetirementResult,
): ProtectionResult {
  const protectedGoals = goals.filter((g) => g.protect);
  const protectedGoalsCover = sum(protectedGoals.map((g) => g.futureCost));

  // Expenses the household would still carry, for the years the earner would
  // otherwise have been working. Undiscounted on purpose: discounting it would
  // make the figure look precise, and it is not.
  const incomeReplacement =
    cashflow.totalExpenses *
    MONTHS *
    retirement.yearsToRetirement *
    (plan.expenseShareSelf / 100);

  return {
    requested: plan.wantsInsuranceReview,
    liabilitiesCover: netWorth.totalLiabilities,
    protectedGoalsCover: round(protectedGoalsCover),
    incomeReplacement: round(incomeReplacement),
    total: round(
      netWorth.totalLiabilities + protectedGoalsCover + incomeReplacement,
    ),
    protectedGoalLabels: protectedGoals.map((g) =>
      g.subject ? `${g.label} — ${g.subject}` : g.label,
    ),
  };
}

/* ==========================================================================
   Indicators

   Named checks with stated thresholds, rather than one score out of a hundred.
   A score would compress five unrelated facts into a number that looks like a
   verdict; these say what was measured and against what.

   Thresholds are conventional personal-finance rules of thumb, not regulatory
   standards, and the report labels them that way.
   ========================================================================== */

export type IndicatorStatus = "good" | "watch" | "action";

export interface Indicator {
  id: string;
  label: string;
  value: string;
  status: IndicatorStatus;
  note: string;
}

export function computeIndicators(
  cashflow: CashflowResult,
  contingency: ContingencyResult,
  netWorth: NetWorthResult,
  goals: GoalResult[],
): Indicator[] {
  const indicators: Indicator[] = [];

  indicators.push({
    id: "savings-rate",
    label: "Savings rate",
    value: `${cashflow.savingsRatePct.toFixed(0)}% of income`,
    status:
      cashflow.savingsRatePct >= 20
        ? "good"
        : cashflow.savingsRatePct >= 10
          ? "watch"
          : "action",
    note: "A commonly used reference point is 20% of income going into investments.",
  });

  indicators.push({
    id: "surplus",
    label: "Monthly surplus",
    value:
      cashflow.uncommittedSurplus >= 0
        ? `₹${cashflow.uncommittedSurplus.toLocaleString("en-IN")} spare`
        : `₹${Math.abs(cashflow.uncommittedSurplus).toLocaleString("en-IN")} short`,
    status:
      cashflow.uncommittedSurplus > 0
        ? "good"
        : cashflow.uncommittedSurplus === 0
          ? "watch"
          : "action",
    note: "Income less expenses, less what is already going into RDs and SIPs.",
  });

  indicators.push({
    id: "contingency",
    label: "Emergency buffer",
    value: `${contingency.monthsCovered.toFixed(1)} months covered`,
    status:
      contingency.monthsCovered >= contingency.monthsTargeted
        ? "good"
        : contingency.monthsCovered >= 3
          ? "watch"
          : "action",
    note: `Measured against the ${contingency.monthsTargeted} months you asked for, counting savings balances and deposits only.`,
  });

  indicators.push({
    id: "emi",
    label: "EMI burden",
    value: `${netWorth.emiToIncomePct.toFixed(0)}% of income`,
    status:
      netWorth.emiToIncomePct <= 30
        ? "good"
        : netWorth.emiToIncomePct <= 45
          ? "watch"
          : "action",
    note: "Lenders commonly start to balk somewhere past 40–50% of income.",
  });

  const funded = goals.length
    ? sum(goals.map((g) => g.fundedPct)) / goals.length
    : 100;

  indicators.push({
    id: "goal-funding",
    label: "Goals on track",
    value: `${funded.toFixed(0)}% funded on average`,
    status: funded >= 75 ? "good" : funded >= 40 ? "watch" : "action",
    note: "What current arrangements grow into, against what each goal is projected to cost.",
  });

  return indicators;
}

/* ==========================================================================
   The whole plan
   ========================================================================== */

export interface PlanResult {
  generatedAt: string;
  currentYear: number;
  cashflow: CashflowResult;
  contingency: ContingencyResult;
  goals: GoalResult[];
  retirement: RetirementResult;
  netWorth: NetWorthResult;
  allocation: AllocationComparison[];
  protection: ProtectionResult;
  indicators: Indicator[];
  totals: {
    /**
     * Every goal at its projected cost, PLUS the retirement corpus.
     *
     * Retirement has to be in here because it is in `totalGap`. Leaving it out
     * of one and not the other put a shortfall of 3.89 Crore next to a total
     * of 1.59 Crore on the summary panel, which reads as a bug whether or not
     * both figures are individually correct.
     */
    totalFutureCost: number;
    totalGap: number;
    /** What closing every gap would cost per month, retirement included. */
    requiredMonthlyTotal: number;
    /** Required monthly against what is actually spare each month. */
    affordabilityPct: number;
  };
}

export function computePlan(
  plan: PlanData,
  allocationLabels: Record<keyof Allocation, string>,
  now: Date = new Date(),
): PlanResult {
  const currentYear = now.getFullYear();

  const cashflow = computeCashflow(plan);
  const contingency = computeContingency(plan, cashflow);
  const goals = plan.goals.map((g) => computeGoal(g, plan.assets, currentYear));
  const retirement = computeRetirement(plan, cashflow);
  const netWorth = computeNetWorth(plan, cashflow);
  const allocation = compareAllocation(plan, allocationLabels);
  const protection = computeProtection(
    plan,
    goals,
    netWorth,
    cashflow,
    retirement,
  );
  const indicators = computeIndicators(cashflow, contingency, netWorth, goals);

  const requiredMonthlyTotal =
    sum(goals.map((g) => g.requiredMonthly)) +
    (retirement.applicable ? retirement.requiredMonthly : 0);

  return {
    generatedAt: now.toISOString(),
    currentYear,
    cashflow,
    contingency,
    goals,
    retirement,
    netWorth,
    allocation,
    protection,
    indicators,
    totals: {
      totalFutureCost: round(
        sum(goals.map((g) => g.futureCost)) +
          (retirement.applicable ? retirement.corpusRequired : 0),
      ),
      totalGap: round(
        sum(goals.map((g) => g.gap)) +
          (retirement.applicable ? retirement.gap : 0),
      ),
      requiredMonthlyTotal: round(requiredMonthlyTotal),
      affordabilityPct:
        cashflow.uncommittedSurplus > 0
          ? (requiredMonthlyTotal / cashflow.uncommittedSurplus) * 100
          : requiredMonthlyTotal > 0
            ? Infinity
            : 0,
    },
  };
}
