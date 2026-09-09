import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark.
 *
 * No raster logo was supplied, so the mark is drawn in CSS — a charcoal plate
 * carrying a serif "S" beside the name. Swapping in a real logo later means
 * replacing the plate span only.
 *
 * The plate is charcoal rather than champagne on purpose: a gold badge in the
 * top-left corner of every page is the single fastest way to turn a restrained
 * palette into a "gold and black" one.
 */
export function Logo({
  onDark = false,
  className,
  href = "/",
}: {
  onDark?: boolean;
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-3", className)}
      aria-label="Sarvam Associates — home"
    >
      <span
        aria-hidden
        className={cn(
          "font-display grid size-10 place-items-center rounded-input text-[1.15rem] leading-none font-semibold",
          "transition-colors duration-300 ease-[var(--ease-editorial)]",
          onDark
            ? "bg-ivory text-charcoal group-hover:bg-sand"
            : "bg-charcoal text-ivory group-hover:bg-forest",
        )}
      >
        S
      </span>

      <span className="flex flex-col gap-1 leading-none">
        <span
          className={cn(
            "font-display text-[1.2rem] leading-none font-semibold tracking-[-0.015em] whitespace-nowrap",
            onDark ? "text-ivory" : "text-charcoal",
          )}
        >
          Sarvam Associates
        </span>
        <span
          className={cn(
            "text-[0.6rem] leading-none tracking-[0.22em] whitespace-nowrap uppercase",
            onDark ? "text-ivory/45" : "text-muted",
          )}
        >
          Tax · Wealth · Protection
        </span>
      </span>
    </Link>
  );
}
