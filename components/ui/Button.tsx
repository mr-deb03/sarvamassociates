import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Button — deliberately a SERVER component.

   Hover, press and focus are CSS transitions. Making this a client component
   for a micro-interaction would ship JS and create a hydration island on every
   CTA on the site, for an effect CSS does natively.

   Champagne is NOT a button colour. The primary CTA is deep charcoal on ivory;
   inverting to ivory-on-charcoal inside dark sections. Gold buttons would blow
   the 2% accent budget on their own.
   ========================================================================== */

type Variant =
  /** Charcoal on light grounds. The site's main CTA. */
  | "primary"
  /** Ivory on dark grounds — the primary, inverted. */
  | "primaryOnDark"
  /** Bordered, transparent. Light grounds. */
  | "secondary"
  /** Bordered, transparent. Dark grounds. */
  | "secondaryOnDark"
  /** Text + arrow only. */
  | "tertiary"
  | "tertiaryOnDark";

type Size = "sm" | "md" | "lg";

const BASE =
  "group inline-flex items-center justify-center gap-2 font-sans font-medium " +
  "tracking-[0.015em] whitespace-nowrap " +
  "transition-[background-color,color,border-color,transform,opacity] " +
  "duration-300 ease-[var(--ease-editorial)] " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45";

const SOLID = "rounded-pill";

const VARIANTS: Record<Variant, string> = {
  primary: `${SOLID} bg-charcoal text-ivory hover:bg-forest`,
  primaryOnDark: `${SOLID} bg-ivory text-charcoal hover:bg-sand`,
  secondary: `${SOLID} border border-line bg-transparent text-charcoal hover:border-charcoal/35 hover:bg-charcoal/[0.04]`,
  secondaryOnDark: `${SOLID} border border-ivory/20 bg-transparent text-ivory/85 hover:border-ivory/45 hover:text-ivory`,
  tertiary:
    "text-charcoal hover:text-champagne-ink px-0 underline-offset-[6px] hover:underline",
  tertiaryOnDark:
    "text-ivory/80 hover:text-champagne px-0 underline-offset-[6px] hover:underline",
};

/** Heights follow the 48–56px CTA spec; sm is for dense contexts only. */
const SIZES: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-sm",
  lg: "h-14 px-8 text-base",
};

const TEXT_SIZES: Record<Size, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

const isTertiary = (v: Variant) => v === "tertiary" || v === "tertiaryOnDark";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Right arrow that slides on hover. */
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsLink = CommonProps & { href: string; external?: boolean };
type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children">;

function classesFor(variant: Variant, size: Size, className?: string) {
  return cn(
    BASE,
    VARIANTS[variant],
    isTertiary(variant) ? TEXT_SIZES[size] : SIZES[size],
    className,
  );
}

function inner(children: ReactNode, withArrow?: boolean) {
  return (
    <>
      {children}
      {withArrow && (
        <ArrowRight
          aria-hidden
          strokeWidth={1.75}
          className="size-4 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:translate-x-1"
        />
      )}
    </>
  );
}

export function ButtonLink({
  href,
  external,
  variant = "primary",
  size = "md",
  withArrow,
  className,
  children,
}: ButtonAsLink) {
  const classes = classesFor(variant, size, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner(children, withArrow)}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner(children, withArrow)}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  withArrow,
  className,
  children,
  ...rest
}: ButtonAsButton) {
  return (
    <button {...rest} className={classesFor(variant, size, className)}>
      {inner(children, withArrow)}
    </button>
  );
}
