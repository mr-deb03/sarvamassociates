import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  /** Heading text. Always set in the display serif. */
  title: ReactNode;
  lede?: ReactNode;
  /** Document outline level — chosen independently of visual size. */
  as?: "h1" | "h2" | "h3";
  /** Visual size, from the display scale. */
  size?: "lg" | "md" | "sm";
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  /** Sits opposite the header on wide screens — usually a CTA. */
  action?: ReactNode;
}

const SIZES = {
  lg: "text-display-lg",
  md: "text-display-md",
  sm: "text-display-sm",
} as const;

export function SectionHeader({
  eyebrow,
  title,
  lede,
  as: Heading = "h2",
  size = "lg",
  align = "left",
  onDark = false,
  className,
  action,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-8",
        action && "md:flex-row md:items-end md:justify-between md:gap-12",
        className,
      )}
    >
      <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
        {eyebrow && (
          <Eyebrow onDark={onDark} centered={centered} className="mb-6">
            {eyebrow}
          </Eyebrow>
        )}

        <Heading
          className={cn(
            "font-display",
            SIZES[size],
            onDark ? "text-paper" : "text-navy",
          )}
        >
          {title}
        </Heading>

        {lede && (
          <p
            className={cn(
              "text-body-lg measure-wide mt-7",
              centered && "mx-auto",
              onDark ? "text-paper/65" : "text-body",
            )}
          >
            {lede}
          </p>
        )}
      </div>

      {action && (
        <div className={cn("shrink-0", centered && "mx-auto")}>{action}</div>
      )}
    </div>
  );
}
