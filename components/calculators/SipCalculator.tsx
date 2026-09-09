"use client";

import { useMemo, useState } from "react";
import { formatInr } from "@/lib/content/display";
import { cn } from "@/lib/utils";

/**
 * SIP and lump-sum illustration (brief §44).
 *
 * Every framing choice here is deliberate. This assumes a constant rate of
 * return, which no real investment delivers — so the output is labelled an
 * illustration throughout, the rate input is called "assumed return" rather
 * than "expected return", and the result panel restates the assumption rather
 * than presenting a number in isolation.
 */

type Mode = "sip" | "lumpsum";

export function SipCalculator() {
  const [mode, setMode] = useState<Mode>("sip");
  const [amount, setAmount] = useState(10_000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const { invested, value } = useMemo(() => {
    const r = rate / 100;

    if (mode === "lumpsum") {
      return {
        invested: amount,
        value: Math.round(amount * Math.pow(1 + r, years)),
      };
    }

    // Future value of an ordinary annuity, compounded monthly.
    const monthlyRate = r / 12;
    const months = years * 12;
    const fv =
      monthlyRate === 0
        ? amount * months
        : amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);

    return { invested: amount * months, value: Math.round(fv) };
  }, [mode, amount, years, rate]);

  const gain = value - invested;

  return (
    <div className="border-line rounded-card border bg-ivory p-6 lg:p-9">
      {/* Mode */}
      <div
        role="group"
        aria-label="Calculation type"
        className="border-line mb-8 inline-flex rounded-input border p-1"
      >
        {(["sip", "lumpsum"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setAmount(m === "sip" ? 10_000 : 500_000);
            }}
            aria-pressed={mode === m}
            className={cn(
              "rounded-sm px-5 py-2 text-sm font-medium transition-colors",
              mode === m
                ? "bg-charcoal text-ivory"
                : "text-body hover:text-charcoal",
            )}
          >
            {m === "sip" ? "Monthly SIP" : "Lump sum"}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Inputs */}
        <div className="space-y-8">
          <Slider
            id="amount"
            label={mode === "sip" ? "Monthly investment" : "Amount invested"}
            value={amount}
            display={formatInr(amount)}
            min={mode === "sip" ? 500 : 10_000}
            max={mode === "sip" ? 200_000 : 20_000_000}
            step={mode === "sip" ? 500 : 10_000}
            onChange={setAmount}
          />

          <Slider
            id="years"
            label="Time horizon"
            value={years}
            display={`${years} year${years === 1 ? "" : "s"}`}
            min={1}
            max={30}
            step={1}
            onChange={setYears}
          />

          <Slider
            id="rate"
            label="Assumed annual return"
            hint="An assumption you choose — not a rate we offer or forecast."
            value={rate}
            display={`${rate}%`}
            min={1}
            max={20}
            step={0.5}
            onChange={setRate}
          />
        </div>

        {/* Output */}
        <div className="bg-charcoal grain relative isolate flex flex-col justify-center overflow-hidden rounded-card p-7 lg:p-8">
          <p className="text-ivory/40 text-xs tracking-[0.12em] uppercase">
            Illustrative value after {years} year{years === 1 ? "" : "s"}
          </p>

          <p className="font-sans text-stat-sm text-ivory tnum mt-3">
            {formatInr(value)}
          </p>

          <dl className="border-ivory/12 mt-7 space-y-3 border-t pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ivory/50 text-sm">You would have invested</dt>
              <dd className="text-ivory text-sm font-semibold tabular-nums">
                {formatInr(invested)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ivory/50 text-sm">Illustrative growth</dt>
              <dd className="text-ivory text-sm font-semibold tnum">
                {formatInr(gain)}
              </dd>
            </div>
          </dl>

          <p className="text-ivory/40 mt-6 text-xs leading-relaxed">
            This assumes a steady {rate}% every year for {years} years. Real
            markets do not behave that way — they rise and fall, sometimes for
            years at a time. Treat this as arithmetic, not a forecast.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  hint,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-charcoal text-sm font-medium">
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-display text-charcoal text-lg font-bold tabular-nums"
        >
          {display}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-charcoal bg-line h-1.5 w-full cursor-pointer appearance-none rounded-full"
      />

      {hint && <p className="text-muted mt-2 text-xs">{hint}</p>}
    </div>
  );
}
