import { RISK_META, RISK_SCALE_LENGTH } from "@/lib/content/display";
import type { RiskBand } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Risk band as a pip meter.
 *
 * Pip count derives from the band's position in RISK_BANDS, so adding a band
 * updates every meter, every legend and the filter at once. The bar is
 * decorative; the accessible name carries the actual value.
 */
export function RiskMeter({
  risk,
  onDark = false,
  showLabel = true,
  className,
}: {
  risk: RiskBand;
  onDark?: boolean;
  showLabel?: boolean;
  className?: string;
}) {
  const meta = RISK_META[risk];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="flex items-center gap-[3px]"
        role="img"
        aria-label={`Risk: ${meta.label}, ${meta.level} out of ${RISK_SCALE_LENGTH}`}
      >
        {Array.from({ length: RISK_SCALE_LENGTH }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "h-[3px] w-4 rounded-pill transition-colors",
              i < meta.level
                ? meta.pipClassName
                : onDark
                  ? "bg-ivory/12"
                  : "bg-charcoal/10",
            )}
          />
        ))}
      </div>

      {showLabel && (
        <span
          className={cn(
            "text-xs font-medium",
            onDark ? "text-ivory/60" : "text-muted",
          )}
        >
          {meta.label} risk
        </span>
      )}
    </div>
  );
}
