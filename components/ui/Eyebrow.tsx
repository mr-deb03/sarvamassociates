import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small uppercase label above a heading.
 *
 * The accent hairline in front of it is the accent's main job across the whole
 * site — a quiet detail rather than a headline colour. The label text itself is
 * deliberately NOT accent: the brand orange measures 2.96:1 on paper, far below
 * AA, and putting it on dozens of labels would spend the accent budget on the
 * least important text on the page.
 */
export function Eyebrow({
  children,
  onDark = false,
  centered = false,
  className,
}: {
  children: ReactNode;
  onDark?: boolean;
  centered?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-eyebrow flex items-center gap-3.5 uppercase",
        centered && "justify-center",
        onDark ? "text-paper/55" : "text-muted",
        className,
      )}
    >
      <span aria-hidden className="accent-rule shrink-0" />
      {children}
    </p>
  );
}
