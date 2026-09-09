import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small uppercase label above a heading.
 *
 * The champagne hairline in front of it is the accent's main job across the
 * whole site — a quiet detail rather than a headline colour. The label text
 * itself is deliberately NOT champagne: at #B89B63 it measures 2.4:1 on ivory,
 * far below AA, and putting the accent on dozens of labels would blow the 2%
 * budget on its own.
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
        onDark ? "text-ivory/55" : "text-muted",
        className,
      )}
    >
      <span aria-hidden className="accent-rule shrink-0" />
      {children}
    </p>
  );
}
