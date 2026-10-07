"use client";

import { useState } from "react";
import { CircleAlert, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COMPANY } from "@/lib/content/company";
import { OtpGate } from "./OtpGate";

/**
 * Shown when someone opens a plan link without the access cookie.
 *
 * The link alone is not enough — see hasPlanAccess in lib/plan/access.ts — so
 * this offers the verification flow again rather than a dead end. The number
 * is masked because this page is reachable by anyone holding the URL, and the
 * whole point of the gate is that holding the URL proves nothing.
 */
export function PlanLocked({
  planId,
  maskedPhone,
}: {
  planId: string;
  maskedPhone: string;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ devCode?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <OtpGate planId={planId} phone={maskedPhone} initialDevCode={sent.devCode} />
    );
  }

  const request = async () => {
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/plan/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setError(result.error ?? "We could not send a code just now.");
      } else {
        setSent({ devCode: result.devCode });
      }
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-line bg-card rounded-card mx-auto max-w-lg border p-8 text-center sm:p-10">
      <span
        aria-hidden
        className="bg-navy/[0.05] text-navy mx-auto grid size-14 place-items-center rounded-full"
      >
        <Lock strokeWidth={1.5} className="size-6" />
      </span>

      <h1 className="font-display text-navy mt-6 text-xl font-semibold sm:text-2xl">
        This plan is private
      </h1>

      <p className="text-body mt-3 text-sm leading-relaxed">
        Plans open only on the device that verified them. We can text a fresh
        code to <strong className="text-navy">{maskedPhone}</strong> — the
        number this plan was created with.
      </p>

      <Button
        type="button"
        size="lg"
        onClick={request}
        disabled={sending}
        aria-busy={sending}
        className="mt-7 w-full sm:w-auto"
      >
        {sending ? (
          <>
            <Loader2 strokeWidth={1.75} aria-hidden className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Text me a code"
        )}
      </Button>

      {error && (
        <p
          role="alert"
          className="text-error mt-5 flex items-start justify-center gap-2 text-sm"
        >
          <CircleAlert strokeWidth={1.75} aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      <p className="text-muted border-line mt-8 border-t pt-6 text-xs leading-relaxed">
        Not your number any more? Email{" "}
        <a
          href={`mailto:${COMPANY.email}?subject=Financial%20plan%20${planId}`}
          className="text-accent-ink link-underline"
        >
          {COMPANY.email}
        </a>{" "}
        quoting <span className="tabular-nums">{planId}</span>.
      </p>
    </div>
  );
}
