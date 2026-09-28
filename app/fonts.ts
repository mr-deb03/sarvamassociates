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
  subsets: ["latin", "latin-ext"],
  display: "swap",
  // Distinct from the `--font-display` theme token, which composes this with
  // its fallback stack. Naming them the same would be a circular var().
  variable: "--font-montserrat",
  style: ["normal", "italic"],
});

/**
 * Interface face — body copy, labels, forms, tables and every figure.
 *
 * NOTE — Open Sans has no rupee glyph. Not "not in the latin subset": U+20B9
 * is absent from the font entirely (so are ₽ and ₴), confirmed by reading the
 * cmap of Google's full unsubsetted file. Left alone, the browser fell back to
 * Arial for that one character, which CSS.getPlatformFontsForNode exposed as a
 * stray 1-glyph Arial run inside every "₹500/month".
 *
 * The fix is the fallback order on `--font-sans` in globals.css, which names
 * "Open Sans" directly rather than using this variable. `--font-open-sans`
 * expands to `"Open Sans", "Open Sans Fallback"`, and that second family is
 * `local(Arial)` with metric overrides — it has its own ₹, so it swallowed the
 * glyph before any later family could be reached. (`adjustFontFallback: false`
 * does not remove it in this Next version; it was tried.) Montserrat needs
 * `latin-ext` for the same reason — that is the slice U+20B9 lives in.
 *
 * Open Sans earns the body role on other grounds: its digits are uniform-width
 * in the raw metrics (all 0.5718em), so columns and count-up animations stay
 * aligned even before `tabular-nums` applies.
 *
 * Normal only — every italic on the site is inside a display heading, so
 * there is no body italic to load a second file for.
 */
export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});
