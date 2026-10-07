"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { dateTimeDisplay, phoneDisplay, rupees } from "@/lib/plan/format";
import type { PlanSummary } from "@/lib/plan/store";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Submission list.

   Filtering happens in the browser over the full set rather than on the
   server. For a practice taking tens of enquiries a month that is instant and
   needs no query layer; past a few thousand records it would want paging and a
   server-side search, which is the point at which the file store should have
   become a database anyway.
   ========================================================================== */

type Filter = "all" | "verified" | "pending";

export function PlansTable({ items }: { items: PlanSummary[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return items.filter((item) => {
      if (filter === "verified" && item.status !== "verified") return false;
      if (filter === "pending" && item.status !== "pending-verification") return false;
      if (!needle) return true;

      return (
        item.name.toLowerCase().includes(needle) ||
        item.email.toLowerCase().includes(needle) ||
        item.phone.includes(needle) ||
        item.id.toLowerCase().includes(needle)
      );
    });
  }, [items, query, filter]);

  const verified = items.filter((i) => i.status === "verified").length;

  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total submissions" value={String(items.length)} />
        <Stat label="Verified" value={String(verified)} />
        <Stat
          label="Awaiting verification"
          value={String(items.length - verified)}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden
            strokeWidth={1.75}
            className="text-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
          />
          <label htmlFor="plan-search" className="sr-only">
            Search submissions
          </label>
          <input
            id="plan-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, mobile or reference"
            className="border-line bg-card text-navy focus:border-navy focus:ring-navy/15 w-full rounded-input border py-2.5 pr-4 pl-10 text-sm transition-colors focus:ring-2 focus:outline-none"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by status"
          className="border-line inline-flex rounded-input border p-1"
        >
          {(["all", "verified", "pending"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                "rounded-sm px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === value ? "bg-navy text-paper" : "text-body hover:text-navy",
              )}
            >
              {value}
            </button>
          ))}
        </div>

        {/* A file download from a route handler, not a page navigation.
            next/link would intercept it and hand back JSON in the tab. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/admin/plans/export"
          className="border-line text-navy hover:border-navy/35 hover:bg-navy/[0.04] inline-flex items-center gap-2 rounded-input border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Download strokeWidth={1.75} aria-hidden className="size-4" />
          CSV
        </a>
      </div>

      {visible.length === 0 ? (
        <p className="border-line text-muted rounded-card border border-dashed p-12 text-center text-sm">
          {items.length === 0
            ? "No plans have been submitted yet."
            : "Nothing matches that search."}
        </p>
      ) : (
        <div className="border-line rounded-card overflow-x-auto border">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-line bg-mist border-b">
                <Th>Received</Th>
                <Th>Name</Th>
                <Th>Contact</Th>
                <Th align="right">Income/mo</Th>
                <Th align="right">Goals</Th>
                <Th align="right">Needs/mo</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {visible.map((item) => (
                <tr key={item.id} className="hover:bg-mist/60 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/plans/${item.id}`}
                      className="text-muted hover:text-navy text-xs whitespace-nowrap transition-colors"
                    >
                      {dateTimeDisplay(item.createdAt)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/plans/${item.id}`}
                      className="text-navy link-underline font-medium"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-body block text-xs tabular-nums">
                      {phoneDisplay(item.phone)}
                    </span>
                    <span className="text-muted block text-xs">{item.email}</span>
                  </td>
                  <td className="text-navy px-4 py-3 text-right tabular-nums">
                    {rupees(item.monthlyIncome)}
                  </td>
                  <td className="text-body px-4 py-3 text-right tabular-nums">
                    {item.goalCount}
                  </td>
                  <td className="text-navy px-4 py-3 text-right font-medium tabular-nums">
                    {rupees(item.requiredMonthlyTotal)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={cn(
        "text-muted px-4 py-3 text-xs font-medium tracking-[0.06em] uppercase",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      {children}
    </th>
  );
}

export function StatusChip({ status }: { status: PlanSummary["status"] }) {
  const verified = status === "verified";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        verified
          ? "bg-positive/10 text-positive"
          : "bg-accent-light text-accent-ink",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          verified ? "bg-positive" : "bg-accent",
        )}
      />
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line bg-card rounded-card border p-5">
      <p className="text-muted text-xs tracking-[0.06em] uppercase">{label}</p>
      <p className="font-display text-navy mt-1.5 text-2xl font-bold tabular-nums">
        {value}
      </p>
    </div>
  );
}
