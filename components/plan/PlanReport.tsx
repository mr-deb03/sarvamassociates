import { Logo } from "@/components/layout/Logo";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { COMPANY, REGISTRATIONS } from "@/lib/content/company";
import {
  ASSET_TYPE_META,
  GOAL_TYPE_META,
  LIABILITY_LABELS,
  MARITAL_LABELS,
  RISK_PROFILE_META,
} from "@/lib/plan/catalog";
import { compact, dateDisplay, percent, phoneDisplay, rupees } from "@/lib/plan/format";
import type { PlanRecord } from "@/lib/plan/store";
import { cn } from "@/lib/utils";
import { GoalIcon } from "./GoalIcon";

/* ==========================================================================
   The plan document.

   A server component, rendered identically on screen and on paper — the print
   rules in app/globals.css restyle this markup rather than replacing it, so
   there is exactly one layout to keep correct. See PrintButton.tsx.

   Every figure here comes from the stored `result` snapshot, never from a
   fresh calculation. Recomputing on each view would mean a plan quietly
   changed between the day it was generated and the day the advisor opened it,
   purely because the calendar moved on.
   ========================================================================== */

export function PlanReport({
  record,
  forAdmin = false,
}: {
  record: PlanRecord;
  /** Adds the contact block and the internal notes the visitor never sees. */
  forAdmin?: boolean;
}) {
  const { input, result } = record;
  const firstName = input.name.split(" ")[0];

  return (
    <article className="plan-report space-y-14 print:space-y-8">
      <ReportHeader record={record} forAdmin={forAdmin} />

      <AtAGlance result={result} firstName={firstName} />

      <Cashflow result={result} />

      <Contingency result={result} />

      <Goals result={result} />

      {result.retirement.applicable && <Retirement result={result} input={input} />}

      <NetWorth result={result} input={input} />

      {result.protection.requested && <Protection result={result} />}

      <Assumptions input={input} />

      <NextSteps />

      <section className="plan-section break-inside-avoid">
        <Disclaimer
          ids={[
            "plan-illustration",
            "plan-assumptions-are-yours",
            "not-investment-advice",
            "distributor-role",
            "mf-market-risk",
          ]}
          variant="panel"
        />
      </section>
    </article>
  );
}

/* ----------------------------------------------------------------- header */

function ReportHeader({
  record,
  forAdmin,
}: {
  record: PlanRecord;
  forAdmin: boolean;
}) {
  const { input } = record;

  return (
    <header className="border-line border-b pb-8">
      {/* Masthead. Hidden on screen because the site header is already above
          it; printed, because a loose page needs to say whose it is. */}
      <div className="mb-8 hidden items-center justify-between print:flex">
        <Logo variant="header" />
        <p className="text-muted text-xs">{COMPANY.email}</p>
      </div>

      <p className="text-eyebrow text-muted uppercase">Financial plan</p>

      <h1 className="font-display text-navy text-display-md mt-3">
        {input.name}
      </h1>

      <dl className="text-muted mt-6 grid gap-x-10 gap-y-2.5 text-xs sm:grid-cols-2 lg:grid-cols-4">
        <HeaderFact label="Prepared" value={dateDisplay(record.createdAt)} />
        <HeaderFact
          label="Risk profile"
          value={
            input.riskProfile
              ? RISK_PROFILE_META[input.riskProfile].label
              : "Not stated"
          }
        />
        <HeaderFact
          label="Retiring at"
          value={`${input.retirementAge}, planning to ${input.lifeExpectancy}`}
        />
        <HeaderFact label="Reference" value={record.id} />

        {forAdmin && (
          <>
            <HeaderFact label="Mobile" value={phoneDisplay(input.phone)} />
            <HeaderFact label="Email" value={input.email} />
            <HeaderFact
              label="Marital status"
              value={
                input.maritalStatus ? MARITAL_LABELS[input.maritalStatus] : "—"
              }
            />
            <HeaderFact
              label="Status"
              value={
                record.status === "verified"
                  ? `Verified ${record.verifiedAt ? dateDisplay(record.verifiedAt) : ""}`
                  : "Not verified"
              }
            />
          </>
        )}
      </dl>
    </header>
  );
}

function HeaderFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted/80 text-[0.6875rem] tracking-[0.08em] uppercase">
        {label}
      </dt>
      <dd className="text-navy mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------- at a glance */

const STATUS_STYLES = {
  good: "border-positive/25 bg-positive/[0.06]",
  watch: "border-accent/30 bg-accent-light/50",
  action: "border-error/25 bg-error/[0.05]",
} as const;

const STATUS_DOT = {
  good: "bg-positive",
  watch: "bg-accent",
  action: "bg-error",
} as const;

function AtAGlance({
  result,
  firstName,
}: {
  result: PlanRecord["result"];
  firstName: string;
}) {
  const monthly = result.totals.requiredMonthlyTotal;
  const spare = result.cashflow.uncommittedSurplus;
  const withinReach = spare > 0 && monthly <= spare;

  return (
    <section className="plan-section">
      <SectionTitle
        eyebrow="At a glance"
        title={`Where you stand today, ${firstName}`}
      />

      <div className="bg-navy grain rounded-card relative isolate mt-8 overflow-hidden p-7 sm:p-9 print:bg-white print:p-0 print:text-current">
        <div className="relative grid gap-8 sm:grid-cols-3">
          <HeadlineFigure
            label="Everything you are planning for, at future cost"
            value={compact(result.totals.totalFutureCost)}
            exact={
              result.retirement.applicable
                ? `${rupees(result.totals.totalFutureCost)}, retirement included`
                : rupees(result.totals.totalFutureCost)
            }
          />
          <HeadlineFigure
            label="Shortfall against current arrangements"
            value={compact(result.totals.totalGap)}
            exact={rupees(result.totals.totalGap)}
          />
          <HeadlineFigure
            label="To close it, invested monthly from now"
            value={rupees(monthly)}
            exact={
              withinReach
                ? `Within the ${rupees(spare)} you have spare`
                : spare > 0
                  ? `More than the ${rupees(spare)} you have spare`
                  : "You have no monthly surplus at present"
            }
          />
        </div>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {result.indicators.map((indicator) => (
          <li
            key={indicator.id}
            className={cn(
              "rounded-card border p-5 break-inside-avoid",
              STATUS_STYLES[indicator.status],
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[indicator.status])}
              />
              <p className="text-muted text-xs tracking-[0.06em] uppercase">
                {indicator.label}
              </p>
            </div>
            <p className="font-display text-navy mt-2 text-lg font-bold tabular-nums">
              {indicator.value}
            </p>
            <p className="text-body mt-2 text-xs leading-relaxed">
              {indicator.note}
            </p>
          </li>
        ))}
      </ul>

      <p className="text-muted mt-5 text-xs leading-relaxed">
        The thresholds behind these five are conventional personal-finance rules
        of thumb, not regulatory standards. They are a way of reading your own
        figures back to you, not a verdict.
      </p>
    </section>
  );
}

function HeadlineFigure({
  label,
  value,
  exact,
}: {
  label: string;
  value: string;
  exact: string;
}) {
  return (
    <div>
      <p className="text-paper/55 text-xs leading-relaxed print:text-[color:var(--color-muted)]">
        {label}
      </p>
      <p className="font-display text-paper mt-2 text-2xl font-bold tabular-nums sm:text-3xl print:text-[color:var(--color-navy)]">
        {value}
      </p>
      <p className="text-paper/45 mt-1 text-xs tabular-nums print:text-[color:var(--color-muted)]">
        {exact}
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- cashflow */

function Cashflow({ result }: { result: PlanRecord["result"] }) {
  const { cashflow } = result;

  return (
    <section className="plan-section break-inside-avoid">
      <SectionTitle
        eyebrow="Money in, money out"
        title="Your month"
        lede="Everything that follows is built on this. If one of these figures is wrong, the plan is wrong with it."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <table className="w-full text-sm">
            <tbody className="divide-line divide-y">
              <MoneyRow label="Total income" value={cashflow.totalIncome} />
              <MoneyRow label="Total expenses" value={-cashflow.totalExpenses} />
              <MoneyRow label="Surplus" value={cashflow.surplus} strong />
              <MoneyRow
                label="Already going into savings"
                value={-cashflow.committedSaving}
              />
              <MoneyRow
                label="Spare each month"
                value={cashflow.uncommittedSurplus}
                strong
              />
            </tbody>
          </table>

          <p className="text-muted mt-4 text-xs leading-relaxed">
            You are putting aside {percent(cashflow.savingsRatePct)} of your
            income, and spending {percent(cashflow.expenseRatioPct)} of it.
          </p>
        </div>

        {cashflow.topExpenses.length > 0 && (
          <div>
            <h3 className="text-navy mb-4 text-sm font-semibold">
              Where the spending goes
            </h3>
            <ul className="space-y-2.5">
              {cashflow.topExpenses.slice(0, 6).map((expense) => (
                <li key={expense.key}>
                  <div className="mb-1 flex items-baseline justify-between gap-4 text-xs">
                    <span className="text-body">{expense.label}</span>
                    <span className="text-navy font-medium tabular-nums">
                      {rupees(expense.amount)}
                    </span>
                  </div>
                  <div className="bg-line h-1 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-navy h-full rounded-full"
                      style={{ width: `${Math.max(2, expense.sharePct)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function MoneyRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <tr>
      <td className={cn("py-3", strong ? "text-navy font-semibold" : "text-body")}>
        {label}
      </td>
      <td
        className={cn(
          "py-3 text-right tabular-nums",
          strong ? "text-navy font-semibold" : "text-body",
          value < 0 && !strong && "text-muted",
        )}
      >
        {rupees(value)}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------ contingency */

function Contingency({ result }: { result: PlanRecord["result"] }) {
  const { contingency } = result;
  const covered = Math.min(100, (contingency.monthsCovered / Math.max(1, contingency.monthsTargeted)) * 100);

  return (
    <section className="plan-section break-inside-avoid">
      <SectionTitle
        eyebrow="First things first"
        title="Your emergency buffer"
        lede="Before anything is invested for a goal, there needs to be money that can be reached on a bad day without selling something at the worst possible moment."
      />

      <div className="border-line rounded-card mt-8 grid gap-6 border p-6 sm:grid-cols-3 sm:p-8">
        <Figure
          label={`${contingency.monthsTargeted} months of expenses`}
          value={rupees(contingency.required)}
        />
        <Figure label="You hold in cash and deposits" value={rupees(contingency.available)} />
        <Figure
          label={contingency.gap > 0 ? "Still to build" : "Buffer complete"}
          value={contingency.gap > 0 ? rupees(contingency.gap) : "—"}
          tone={contingency.gap > 0 ? "action" : "good"}
        />

        <div className="sm:col-span-3">
          <div className="bg-line h-1.5 w-full overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full rounded-full",
                covered >= 100 ? "bg-positive" : "bg-accent",
              )}
              style={{ width: `${Math.max(1, covered)}%` }}
            />
          </div>
          <p className="text-muted mt-2.5 text-xs">
            {contingency.monthsCovered.toFixed(1)} of{" "}
            {contingency.monthsTargeted} months covered. Counts savings balances
            and deposits only — equity can be down exactly when it is needed.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ goals */

function Goals({ result }: { result: PlanRecord["result"] }) {
  if (result.goals.length === 0) return null;

  return (
    <section className="plan-section">
      <SectionTitle
        eyebrow="What you are planning for"
        title="Your goals"
        lede="Each cost is carried forward at the inflation rate you chose for it, and each gap is closed at the return rate you chose for it."
      />

      <ul className="mt-8 space-y-5">
        {result.goals.map((goal) => (
          <li
            key={goal.id}
            className="border-line rounded-card border p-6 break-inside-avoid sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="bg-navy/[0.05] text-navy grid size-11 shrink-0 place-items-center rounded-full"
                >
                  <GoalIcon type={goal.type} className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-navy text-base font-semibold">
                    {goal.label}
                    {goal.subject && (
                      <span className="text-muted font-normal"> — {goal.subject}</span>
                    )}
                  </h3>
                  <p className="text-muted text-xs">
                    {goal.immediate
                      ? "Needed this year"
                      : `${goal.years} ${goal.years === 1 ? "year" : "years"} away · ${goal.targetYear}`}
                    {goal.protect && " · flagged to protect"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-muted text-xs">Funded</p>
                <p
                  className={cn(
                    "font-display text-lg font-bold tabular-nums",
                    goal.fundedPct >= 75
                      ? "text-positive"
                      : goal.fundedPct >= 40
                        ? "text-navy"
                        : "text-error",
                  )}
                >
                  {percent(goal.fundedPct)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-line h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    goal.fundedPct >= 75 ? "bg-positive" : "bg-accent",
                  )}
                  style={{ width: `${Math.max(1, goal.fundedPct)}%` }}
                />
              </div>
            </div>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Figure label="Costs today" value={rupees(goal.currentCost)} />
              <Figure
                label={goal.immediate ? "Cost now" : `Cost in ${goal.targetYear}`}
                value={compact(goal.futureCost)}
                sub={`at ${percent(goal.inflationPct, 1)} a year`}
              />
              <Figure
                label="Current arrangements grow to"
                value={compact(goal.totalProvision)}
              />
              <Figure
                label="Shortfall"
                value={goal.gap > 0 ? compact(goal.gap) : "None"}
                tone={goal.gap > 0 ? "action" : "good"}
              />
            </dl>

            {goal.gap > 0 && (
              <div className="bg-mist rounded-input mt-6 flex flex-wrap items-center justify-between gap-4 p-4">
                <p className="text-body text-xs leading-relaxed">
                  To close this at {percent(goal.returnPct, 1)} a year, you would
                  need to add
                </p>
                <p className="text-navy text-sm font-semibold tabular-nums">
                  {goal.immediate ? (
                    <>{rupees(goal.requiredLumpsum)} now</>
                  ) : (
                    <>
                      {rupees(goal.requiredMonthly)}/month
                      <span className="text-muted font-normal">
                        {" "}
                        or {compact(goal.requiredLumpsum)} as a lump sum today
                      </span>
                    </>
                  )}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------- retirement */

function Retirement({
  result,
  input,
}: {
  result: PlanRecord["result"];
  input: PlanRecord["input"];
}) {
  const { retirement } = result;

  return (
    <section className="plan-section break-inside-avoid">
      <SectionTitle
        eyebrow="The long one"
        title="Retirement"
        lede={`You have ${retirement.yearsToRetirement} years to build a corpus that then has to last ${retirement.yearsInRetirement}.`}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="border-line rounded-card border p-6 sm:p-8">
          <dl className="grid gap-6 sm:grid-cols-2">
            <Figure
              label="Your expenses today"
              value={`${rupees(retirement.monthlyExpenseToday)}/month`}
            />
            <Figure
              label={`The same life at ${retirement.retirementAge}`}
              value={`${rupees(retirement.monthlyExpenseAtRetirement)}/month`}
              sub={`at ${percent(input.planInflation, 1)} inflation`}
            />
            <Figure
              label="Corpus needed at retirement"
              value={compact(retirement.corpusRequired)}
              sub={rupees(retirement.corpusRequired)}
            />
            <Figure
              label="On track from current holdings"
              value={compact(retirement.provision)}
              sub={`${percent(retirement.fundedPct)} of the target`}
            />
          </dl>

          {retirement.gap > 0 && (
            <div className="bg-navy rounded-input mt-7 p-5 print:bg-mist">
              <p className="text-paper/60 text-xs print:text-[color:var(--color-muted)]">
                To close the remaining {compact(retirement.gap)} at{" "}
                {percent(input.planReturnRate, 1)} a year
              </p>
              <p className="font-display text-paper mt-1.5 text-xl font-bold tabular-nums print:text-[color:var(--color-navy)]">
                {rupees(retirement.requiredMonthly)}/month
              </p>
              <p className="text-paper/45 mt-1 text-xs print:text-[color:var(--color-muted)]">
                or {compact(retirement.requiredLumpsum)} invested today
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-navy mb-4 text-sm font-semibold">
            How this was worked out
          </h3>
          <ul className="text-body space-y-3 text-xs leading-relaxed">
            <li>
              Your current monthly expenses are carried forward to age{" "}
              {retirement.retirementAge} at {percent(input.planInflation, 1)} a
              year. The projection assumes you spend the same in real terms
              after retiring as before it — the conservative assumption, and one
              that avoids inventing a reduction we have no basis for.
            </li>
            <li>
              The corpus is what would be needed at retirement to pay that
              rising income for {retirement.yearsInRetirement} years, with the
              remainder earning {percent(input.postRetirementReturn, 1)} and
              inflation still running at {percent(input.planInflation, 1)}.
            </li>
            <li>
              Counted towards it: your PPF, EPF and NPS balances, plus any
              holding you did not earmark against a specific goal.
            </li>
          </ul>

          {retirement.provisionSources.length > 0 && (
            <>
              <h4 className="text-navy mt-6 mb-3 text-xs font-semibold tracking-[0.06em] uppercase">
                Counted towards retirement
              </h4>
              <ul className="divide-line border-line divide-y border-y text-xs">
                {retirement.provisionSources.map((source) => (
                  <li
                    key={source.label}
                    className="flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <span className="text-body">{source.label}</span>
                    <span className="text-navy font-medium tabular-nums">
                      {compact(source.value)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-muted mt-2.5 text-xs">
                Shown at projected value in {new Date().getFullYear() + retirement.yearsToRetirement}.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- net worth */

function NetWorth({
  result,
  input,
}: {
  result: PlanRecord["result"];
  input: PlanRecord["input"];
}) {
  const { netWorth, allocation } = result;
  const hasAssets = netWorth.totalAssets > 0;

  return (
    <section className="plan-section break-inside-avoid">
      <SectionTitle
        eyebrow="Where you are now"
        title="Net worth and mix"
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <dl className="grid gap-5 sm:grid-cols-3">
            <Figure label="Assets" value={compact(netWorth.totalAssets)} />
            <Figure label="Liabilities" value={compact(netWorth.totalLiabilities)} />
            <Figure
              label="Net worth"
              value={compact(netWorth.netWorth)}
              tone={netWorth.netWorth >= 0 ? "good" : "action"}
            />
          </dl>

          {netWorth.assetsByType.length > 0 && (
            <table className="mt-7 w-full text-sm">
              <tbody className="divide-line divide-y">
                {netWorth.assetsByType.map((asset) => (
                  <tr key={asset.type}>
                    <td className="text-body py-2.5">{asset.label}</td>
                    <td className="text-muted py-2.5 text-right text-xs tabular-nums">
                      {percent(asset.sharePct)}
                    </td>
                    <td className="text-navy py-2.5 text-right font-medium tabular-nums">
                      {rupees(asset.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {netWorth.liabilities.length > 0 && (
            <>
              <h3 className="text-navy mt-7 mb-3 text-xs font-semibold tracking-[0.06em] uppercase">
                What you owe
              </h3>
              <table className="w-full text-sm">
                <tbody className="divide-line divide-y">
                  {netWorth.liabilities.map((liability) => (
                    <tr key={liability.id}>
                      <td className="text-body py-2.5">
                        {LIABILITY_LABELS[
                          liability.label as keyof typeof LIABILITY_LABELS
                        ] ?? liability.label}
                      </td>
                      <td className="text-muted py-2.5 text-right text-xs tabular-nums">
                        {liability.emi > 0 ? `${rupees(liability.emi)}/mo` : "—"}
                      </td>
                      <td className="text-navy py-2.5 text-right font-medium tabular-nums">
                        {rupees(liability.outstanding)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-muted mt-3 text-xs">
                EMIs take {percent(netWorth.emiToIncomePct)} of your monthly
                income.
              </p>
            </>
          )}

          {netWorth.unallocatedValue > 0 && (
            <p className="border-line bg-mist text-body rounded-input mt-7 border p-4 text-xs leading-relaxed">
              <strong className="text-navy">
                {rupees(netWorth.unallocatedValue)}
              </strong>{" "}
              of what you hold is not earmarked against any goal. That is not a
              criticism — it is simply capital without a job yet, and it is the
              easiest thing to put to work in a first conversation.
            </p>
          )}
        </div>

        <div>
          <h3 className="text-navy mb-4 text-sm font-semibold">
            Target mix against what you actually hold
          </h3>

          {hasAssets ? (
            <ul className="space-y-4">
              {allocation.map((sleeve) => (
                <li key={sleeve.sleeve}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-4 text-xs">
                    <span className="text-body">{sleeve.label}</span>
                    <span className="text-muted tabular-nums">
                      target {percent(sleeve.targetPct)} · holding{" "}
                      <span className="text-navy font-medium">
                        {percent(sleeve.currentPct)}
                      </span>
                    </span>
                  </div>
                  <div className="bg-line relative h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-navy h-full rounded-full"
                      style={{ width: `${Math.min(100, sleeve.currentPct)}%` }}
                    />
                    <span
                      aria-hidden
                      className="bg-accent absolute top-0 h-full w-0.5"
                      style={{ left: `${Math.min(100, sleeve.targetPct)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-xs leading-relaxed">
              You did not list any holdings, so there is nothing to compare the
              target mix against yet.
            </p>
          )}

          <p className="text-muted mt-5 text-xs leading-relaxed">
            The orange marker is the target you set on step one
            {input.riskProfile
              ? ` after choosing the ${RISK_PROFILE_META[input.riskProfile].label.toLowerCase()} profile`
              : ""}
            . The bar is where your money actually sits today. A gap between the
            two is a conversation, not a problem.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- protection */

function Protection({ result }: { result: PlanRecord["result"] }) {
  const { protection } = result;

  return (
    <section className="plan-section break-inside-avoid">
      <SectionTitle
        eyebrow="If the worst happened"
        title="A protection reference"
        lede="You asked us to include this. It is arithmetic, not a recommendation — three figures added together, each of which you can argue with."
      />

      <div className="border-line rounded-card mt-8 border p-6 sm:p-8">
        <table className="w-full text-sm">
          <tbody className="divide-line divide-y">
            <MoneyRow
              label="Borrowings that would fall to your family"
              value={protection.liabilitiesCover}
            />
            <MoneyRow
              label={
                protection.protectedGoalLabels.length > 0
                  ? `Goals you flagged to protect (${protection.protectedGoalLabels.join(", ")})`
                  : "Goals you flagged to protect"
              }
              value={protection.protectedGoalsCover}
            />
            <MoneyRow
              label="Household running costs to your retirement date"
              value={protection.incomeReplacement}
            />
            <MoneyRow label="Reference total" value={protection.total} strong />
          </tbody>
        </table>

        <p className="text-muted mt-5 text-xs leading-relaxed">
          The third line is your current monthly expenses, multiplied by the
          years to your retirement, at your stated share of household spending.
          It is deliberately not discounted — discounting would make it look
          more precise than it is. Existing cover you already hold is not
          deducted, because the form did not ask for it.
        </p>
      </div>

      <Disclaimer
        ids={["insurance-irdai", "not-investment-advice"]}
        className="mt-6"
      />
    </section>
  );
}

/* ------------------------------------------------------------ assumptions */

function Assumptions({ input }: { input: PlanRecord["input"] }) {
  return (
    <section className="plan-section break-inside-avoid">
      <SectionTitle
        eyebrow="Show your working"
        title="Every assumption behind these numbers"
        lede="All of these were set by you. Change any one and the figures move, often by a lot — which is the single most useful thing to take from this document."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-navy mb-3 text-xs font-semibold tracking-[0.06em] uppercase">
            Plan-level
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-line divide-y">
              <AssumptionRow label="General inflation" value={percent(input.planInflation, 1)} />
              <AssumptionRow
                label="Return before retirement"
                value={percent(input.planReturnRate, 1)}
              />
              <AssumptionRow
                label="Return after retirement"
                value={percent(input.postRetirementReturn, 1)}
              />
              <AssumptionRow
                label="Emergency buffer held"
                value={`${input.contingencyMonths} months`}
              />
              <AssumptionRow
                label="Your share of household income"
                value={percent(input.incomeShareSelf)}
              />
              <AssumptionRow
                label="Your share of household expenses"
                value={percent(input.expenseShareSelf)}
              />
            </tbody>
          </table>
        </div>

        {input.goals.length > 0 && (
          <div>
            <h3 className="text-navy mb-3 text-xs font-semibold tracking-[0.06em] uppercase">
              Per goal
            </h3>
            <table className="w-full text-sm">
              <tbody className="divide-line divide-y">
                {input.goals.map((goal) => (
                  <AssumptionRow
                    key={goal.id}
                    label={`${GOAL_TYPE_META[goal.type].label}${goal.subject ? ` — ${goal.subject}` : ""}`}
                    value={`${percent(goal.inflation, 1)} inflation · ${percent(goal.returnRate, 1)} return`}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {input.assets.length > 0 && (
        <div className="mt-8">
          <h3 className="text-navy mb-3 text-xs font-semibold tracking-[0.06em] uppercase">
            Holdings you told us about
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-line divide-y">
              {input.assets.map((asset) => {
                const goal = input.goals.find((g) => g.id === asset.mappedGoalId);
                return (
                  <tr key={asset.id}>
                    <td className="text-body py-2.5">
                      {asset.label || ASSET_TYPE_META[asset.type].label}
                    </td>
                    <td className="text-muted py-2.5 text-xs">
                      {goal
                        ? `for ${GOAL_TYPE_META[goal.type].label}`
                        : ASSET_TYPE_META[asset.type].mappable
                          ? "unallocated"
                          : "long-term"}
                    </td>
                    <td className="text-navy py-2.5 text-right font-medium tabular-nums">
                      {rupees(asset.value)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AssumptionRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="text-body py-2.5">{label}</td>
      <td className="text-navy py-2.5 text-right font-medium tabular-nums">
        {value}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------ next steps */

function NextSteps() {
  return (
    <section className="plan-section break-inside-avoid">
      <div className="border-line bg-mist rounded-card border p-7 sm:p-9">
        <h2 className="font-display text-navy text-display-sm">
          What this plan cannot do
        </h2>

        <p className="text-body measure-wide mt-4 text-sm leading-relaxed">
          It cannot know your tax position, whether your employer already
          provides cover, what your existing funds actually hold, or how you
          behaved the last time a market fell twenty per cent. All four change
          the answer. What it can do is show you the size of the problem, and
          which part of it is most urgent.
        </p>

        <p className="text-body measure-wide mt-4 text-sm leading-relaxed">
          The next step is a conversation about the gap between this and your
          actual position. It takes about fifteen minutes and costs nothing.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-navy link-underline font-medium"
          >
            {COMPANY.email}
          </a>
          <span className="text-muted">
            {COMPANY.addressLines.join(" · ")}
          </span>
        </div>

        {REGISTRATIONS.hasArn && (
          <p className="text-muted mt-5 text-xs">
            AMFI registration {REGISTRATIONS.arn}
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- shared */

function SectionTitle({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div>
      <p className="text-eyebrow text-muted uppercase">{eyebrow}</p>
      <h2 className="font-display text-navy text-display-sm mt-3">{title}</h2>
      {lede && (
        <p className="text-body measure-wide mt-3 text-sm leading-relaxed">
          {lede}
        </p>
      )}
    </div>
  );
}

function Figure({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "good" | "action";
}) {
  return (
    <div>
      <dt className="text-muted text-xs leading-relaxed">{label}</dt>
      <dd
        className={cn(
          "font-display mt-1.5 text-lg font-bold tabular-nums",
          tone === "good"
            ? "text-positive"
            : tone === "action"
              ? "text-error"
              : "text-navy",
        )}
      >
        {value}
      </dd>
      {sub && <p className="text-muted mt-0.5 text-xs">{sub}</p>}
    </div>
  );
}
