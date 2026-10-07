"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Permanent delete, behind a two-step confirm.
 *
 * The confirm is inline rather than a window.confirm: a native dialog is easy
 * to dismiss by reflex, and this one cannot be undone.
 */
export function DeletePlanButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/plans/${planId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setError(result.error ?? "That did not work.");
        setBusy(false);
        return;
      }

      router.push("/admin/plans");
      router.refresh();
    } catch {
      setError("We could not reach the server.");
      setBusy(false);
    }
  };

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="text-muted hover:text-error flex items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <Trash2 strokeWidth={1.75} aria-hidden className="size-3.5" />
        Delete this submission
      </button>
    );
  }

  return (
    <div className="border-error/30 bg-error/[0.05] rounded-input border p-3.5">
      <p className="text-error text-xs leading-relaxed">
        This removes the record and the plan permanently. The visitor&rsquo;s
        link will stop working.
      </p>

      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className={cn(
            "bg-error text-paper inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-xs font-medium",
            "transition-opacity hover:opacity-90 disabled:opacity-50",
          )}
        >
          {busy && <Loader2 strokeWidth={1.75} aria-hidden className="size-3 animate-spin" />}
          Yes, delete it
        </button>

        <button
          type="button"
          onClick={() => setArmed(false)}
          disabled={busy}
          className="text-muted hover:text-navy text-xs transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <p role="alert" className="text-error mt-2.5 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
