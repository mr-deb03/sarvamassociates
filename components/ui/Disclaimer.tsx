import { Info, TriangleAlert } from "lucide-react";
import { getDisclaimers, type DisclaimerId } from "@/lib/content/disclaimers";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Disclaimer rendering.

   Deliberate minimum sizes. The source mockups set disclaimers at ~10px at 20%
   opacity on a dark ground, which is unreadable. Nothing here renders below
   `text-xs` (13px in this scale), and every colour pairing clears 4.5:1 —
   which is why disclaimer copy uses `text-body`, never `text-muted`.

   Text always comes from the keyed registry, never a prop, so no caller can
   paraphrase a regulatory string at the call site.
   ========================================================================== */

interface DisclaimerProps {
  ids: readonly DisclaimerId[];
  onDark?: boolean;
  /** "note" is a plain block; "panel" adds a bordered surface and a title. */
  variant?: "note" | "panel";
  className?: string;
}

export function Disclaimer({
  ids,
  onDark = false,
  variant = "note",
  className,
}: DisclaimerProps) {
  const items = getDisclaimers(ids);
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        variant === "panel" &&
          cn(
            "rounded-card border p-6 sm:p-8",
            onDark ? "border-ivory/12 bg-ivory/[0.035]" : "border-line bg-sand",
          ),
        className,
      )}
    >
      {variant === "panel" && (
        <p
          className={cn(
            "text-eyebrow mb-4 flex items-center gap-2.5 uppercase",
            onDark ? "text-ivory/50" : "text-muted",
          )}
        >
          <Info aria-hidden strokeWidth={1.75} className="size-3.5" />
          Important information
        </p>
      )}

      <div className="space-y-3">
        {items.map((d) => (
          <p
            key={d.id}
            className={cn(
              "measure-wide text-xs",
              onDark ? "text-ivory/60" : "text-body/85",
            )}
          >
            {d.body}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   Risks & Considerations.

   Body size, above the CTA, never collapsed by default. The brief is explicit:
   risk information must be visible, not hidden in small print.
   ========================================================================== */

export function RisksBlock({
  risks,
  onDark = false,
  className,
}: {
  risks: readonly string[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border p-8 sm:p-10",
        onDark ? "border-error/25 bg-error/[0.07]" : "border-error/20 bg-error/[0.04]",
        className,
      )}
    >
      <h3
        className={cn(
          "font-display text-display-sm mb-6 flex items-center gap-3",
          onDark ? "text-ivory" : "text-charcoal",
        )}
      >
        <TriangleAlert
          aria-hidden
          strokeWidth={1.75}
          className="text-error size-6 shrink-0"
        />
        Risks &amp; considerations
      </h3>

      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-x-10">
        {risks.map((risk) => (
          <li
            key={risk}
            className={cn(
              "flex gap-3.5 text-sm",
              onDark ? "text-ivory/75" : "text-body",
            )}
          >
            <span
              aria-hidden
              className="bg-error/70 mt-2.5 size-1 shrink-0 rounded-full"
            />
            {risk}
          </li>
        ))}
      </ul>
    </div>
  );
}
