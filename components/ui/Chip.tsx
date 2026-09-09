import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "indicative" | "positive" | "error";

const TONES: Record<Tone, { light: string; dark: string }> = {
  neutral: {
    light: "bg-charcoal/[0.055] text-muted",
    dark: "bg-ivory/[0.08] text-ivory/65",
  },
  /**
   * The one place champagne carries text. On ivory it uses the darkened
   * champagne-ink (5.0:1); on dark grounds plain champagne is 6.6:1.
   * Reserved for figures the source itself qualifies as indicative.
   */
  indicative: {
    light: "bg-champagne/[0.14] text-champagne-ink",
    dark: "bg-champagne/15 text-champagne",
  },
  positive: {
    light: "bg-positive/10 text-positive",
    dark: "bg-positive/15 text-positive",
  },
  error: {
    light: "bg-error/10 text-error",
    dark: "bg-error/15 text-error",
  },
};

/**
 * Small label.
 *
 * The "indicative" tone is load-bearing rather than decorative: any figure the
 * source qualifies as indicative must carry it, so a return range can never be
 * mistaken for a promise.
 */
export function Chip({
  children,
  tone = "neutral",
  onDark = false,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-eyebrow inline-flex items-center rounded-pill px-3 py-1.5 uppercase",
        onDark ? TONES[tone].dark : TONES[tone].light,
        className,
      )}
    >
      {children}
    </span>
  );
}
