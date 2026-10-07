"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COMPANY } from "@/lib/content/company";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Verification gate.

   Stands between a submitted plan and the plan itself. The record is already
   stored by the time this renders — see the note in app/api/plan/route.ts —
   so nothing is lost if the visitor walks away here. What they lose is sight
   of the result, which is the trade the gate exists to make.

   `autoComplete="one-time-code"` is load-bearing on iOS and Android: it is
   what puts the code in the keyboard strip, and it turns a thirty-second
   app-switch into a single tap.
   ========================================================================== */

const RESEND_COOLDOWN_SECONDS = 45;

export function OtpGate({
  planId,
  phone,
  initialDevCode,
  otpFailed,
}: {
  planId: string;
  phone: string;
  /** Development only — see lib/plan/sms.ts. */
  initialDevCode?: string;
  /** Set when the record saved but the SMS could not be sent. */
  otpFailed?: string;
}) {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "verifying" | "resending" | "done">(
    "idle",
  );
  const [error, setError] = useState<string | null>(otpFailed ?? null);
  const [notice, setNotice] = useState<string | null>(null);
  const [devCode, setDevCode] = useState(initialDevCode);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submit = async (value: string) => {
    setState("verifying");
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/plan/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, code: value }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setError(result.error ?? "That did not work. Please try again.");
        setState("idle");
        setCode("");
        inputRef.current?.focus();
        return;
      }

      setState("done");
      // refresh() first, so the router cache cannot serve a render from before
      // the access cookie existed. The cookie itself is already in place: the
      // browser applies Set-Cookie when the response headers arrive, which is
      // before the body above resolves.
      router.refresh();
      router.push(`/financial-plan/${planId}`);
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
      setState("idle");
    }
  };

  const resend = async () => {
    setState("resending");
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/plan/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setError(result.error ?? "We could not send another code just now.");
      } else {
        setNotice("A new code is on its way.");
        setDevCode(result.devCode);
        setCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setState("idle");
    }
  };

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    // Submitting on the sixth digit saves a tap, and the keyboard strip fills
    // all six at once anyway.
    if (digits.length === 6 && state === "idle") void submit(digits);
  };

  const busy = state === "verifying" || state === "done";

  return (
    <div className="border-line bg-card rounded-card border p-6 text-center sm:p-10">
      <span
        aria-hidden
        className="bg-navy/[0.05] text-navy mx-auto grid size-14 place-items-center rounded-full"
      >
        <Smartphone strokeWidth={1.5} className="size-6" />
      </span>

      <h2 className="font-display text-navy mt-6 text-xl font-semibold sm:text-2xl">
        Your plan is ready
      </h2>

      <p className="text-body mx-auto mt-3 max-w-md text-sm leading-relaxed">
        We have texted a six-digit code to{" "}
        <strong className="text-navy">{formatPhone(phone)}</strong>. Enter it to
        open your plan.
      </p>

      {devCode && (
        <p className="border-accent/30 bg-accent-light text-accent-ink mx-auto mt-5 max-w-sm rounded-input border p-3 text-xs">
          <strong>Development mode.</strong> No SMS provider is configured, so
          the code is <strong className="tabular-nums">{devCode}</strong>. This
          never appears in production.
        </p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (code.length === 6) void submit(code);
        }}
        className="mx-auto mt-8 max-w-xs"
      >
        <label htmlFor="otp" className="sr-only">
          Six-digit verification code
        </label>
        <input
          ref={inputRef}
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          disabled={busy}
          onChange={(event) => handleChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "otp-error" : undefined}
          placeholder="------"
          className={cn(
            "w-full rounded-input border bg-card py-4 text-center font-semibold tabular-nums",
            "text-2xl tracking-[0.5em] indent-[0.5em] text-navy",
            "placeholder:text-line focus:ring-navy/15 transition-colors focus:ring-2 focus:outline-none",
            "disabled:opacity-60",
            error ? "border-error" : "border-line focus:border-navy",
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={busy || code.length !== 6}
          aria-busy={busy}
          className="mt-5 w-full"
        >
          {busy ? (
            <>
              <Loader2 strokeWidth={1.75} aria-hidden className="size-4 animate-spin" />
              {state === "done" ? "Opening your plan…" : "Checking…"}
            </>
          ) : (
            "Open my plan"
          )}
        </Button>
      </form>

      {error && (
        <p
          id="otp-error"
          role="alert"
          className="text-error mx-auto mt-5 flex max-w-sm items-start justify-center gap-2 text-sm"
        >
          <CircleAlert strokeWidth={1.75} aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {notice && (
        <p role="status" className="text-positive mt-5 text-sm">
          {notice}
        </p>
      )}

      <div className="border-line mt-8 border-t pt-6">
        {cooldown > 0 ? (
          <p className="text-muted text-xs tabular-nums">
            Did not get it? You can ask for another in {cooldown}s.
          </p>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={state === "resending"}
            className="text-navy hover:text-accent-ink text-sm font-medium transition-colors disabled:opacity-50"
          >
            {state === "resending" ? "Sending…" : "Send me another code"}
          </button>
        )}

        <p className="text-muted mt-3 text-xs leading-relaxed">
          Stuck? Email{" "}
          <a
            href={`mailto:${COMPANY.email}?subject=Financial%20plan%20${planId}`}
            className="text-accent-ink link-underline"
          >
            {COMPANY.email}
          </a>{" "}
          and we will send your plan across directly.
        </p>
      </div>
    </div>
  );
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : phone;
}
