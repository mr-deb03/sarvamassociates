import { Montserrat, Open_Sans } from "next/font/google";

/**
 * Display face — headings, the hero, pull quotes.
 *
 * Montserrat is the face the practice already uses on sarvamassociates.com, so
 * the two sites now agree on type as well as colour.
 *
 * Loaded as a variable font (no `weight` array), which covers the whole
 * 100–900 axis in a single file instead of one per weight. Italic is a second
 * file and is genuinely used: the hero's Hinglish line and both pull quotes
 * set it against the roman.
 */
export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  // Distinct from the `--font-display` theme token, which composes this with
  // its fallback stack. Naming them the same would be a circular var().
  variable: "--font-montserrat",
  style: ["normal", "italic"],
});

/**
 * Interface face — body copy, labels, forms, tables and every figure.
 *
 * Also the face for every rupee value on the site. That rule predates this
 * change (it existed because Cormorant's ₹ coverage was unreliable) and still
 * holds: all ₹ amounts render through `font-sans`, and Open Sans covers U+20B9
 * and supports tabular figures, which the stat counters depend on.
 *
 * Normal only — every italic on the site is inside a display heading, so
 * there is no body italic to load a second file for.
 */
export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});
