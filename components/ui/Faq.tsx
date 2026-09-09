import { Plus } from "lucide-react";
import type { Faq as FaqType } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * FAQ list built on native <details>/<summary>.
 *
 * Deliberately not a JS accordion. Native disclosure gives correct ARIA
 * semantics for free, stays a server component, ships zero JavaScript, and —
 * the one users actually notice — lets Ctrl+F find text inside collapsed
 * answers.
 */
export function FaqList({
  faqs,
  onDark = false,
  className,
}: {
  faqs: readonly FaqType[];
  onDark?: boolean;
  className?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <div
      className={cn(
        "border-t",
        onDark ? "divide-ivory/10 border-ivory/10 divide-y" : "divide-line border-line divide-y",
        className,
      )}
    >
      {faqs.map((faq) => (
        <details key={faq.question} className="group">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-start justify-between gap-8 py-6",
              "[&::-webkit-details-marker]:hidden",
              "transition-colors duration-300",
              onDark ? "text-ivory hover:text-champagne" : "text-charcoal hover:text-champagne-ink",
            )}
          >
            <span className="font-display text-display-sm">{faq.question}</span>
            <Plus
              aria-hidden
              strokeWidth={1.5}
              className={cn(
                "mt-1.5 size-5 shrink-0 transition-transform duration-400 ease-[var(--ease-editorial)]",
                "group-open:rotate-45",
                onDark ? "text-ivory/45" : "text-muted",
              )}
            />
          </summary>

          <p
            className={cn(
              "measure-wide pb-7 text-base",
              onDark ? "text-ivory/65" : "text-body",
            )}
          >
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
