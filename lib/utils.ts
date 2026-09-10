import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about our custom font-size utilities.
 *
 * Out of the box it recognises `text-sm`, `text-lg` and friends as font sizes
 * and treats every other `text-*` as a colour. Our scale uses names it has
 * never seen — `text-display-lg`, `text-stat`, `text-eyebrow` — so it files
 * them under colour, and any `text-navy` in the same call silently wins.
 *
 * That is not a hypothetical: it flattened every section heading on the site to
 * body size before it was caught. Registering the names puts them in the
 * font-size group, where they conflict only with each other.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-hero",
            "display-lg",
            "display-md",
            "display-sm",
            "card",
            "body-lg",
            "eyebrow",
            "stat",
            "stat-sm",
          ],
        },
      ],
    },
  },
});

/** Merge conditional class lists, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
