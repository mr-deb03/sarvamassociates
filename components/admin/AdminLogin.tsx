"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Admin sign in.
 *
 * Rendered by the admin layout in place of the panel whenever the session
 * cookie is missing or expired, so there is no separate login route to keep in
 * step and no way to reach a protected page without passing through here.
 */
export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setError(result.error ?? "That did not work.");
        setBusy(false);
        return;
      }

      router.refresh();
    } catch {
      setError("We could not reach the server. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="container-page section">
      <form
        onSubmit={submit}
        className="border-line bg-card rounded-card mx-auto max-w-sm border p-8"
      >
        <span
          aria-hidden
          className="bg-navy/[0.05] text-navy mx-auto grid size-12 place-items-center rounded-full"
        >
          <Lock strokeWidth={1.5} className="size-5" />
        </span>

        <h1 className="font-display text-navy mt-5 text-center text-lg font-semibold">
          Sarvam admin
        </h1>
        <p className="text-muted mt-1.5 text-center text-xs">
          Financial plan submissions
        </p>

        <label htmlFor="password" className="text-navy mt-7 mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full rounded-input border bg-card px-4 py-2.5 text-sm text-navy",
            "focus:ring-navy/15 transition-colors focus:ring-2 focus:outline-none",
            error ? "border-error" : "border-line focus:border-navy",
          )}
        />

        <Button type="submit" size="lg" disabled={busy} aria-busy={busy} className="mt-5 w-full">
          {busy ? (
            <>
              <Loader2 strokeWidth={1.75} aria-hidden className="size-4 animate-spin" />
              Checking…
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        {error && (
          <p role="alert" className="text-error mt-4 flex items-start gap-2 text-xs">
            <CircleAlert strokeWidth={1.75} aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
