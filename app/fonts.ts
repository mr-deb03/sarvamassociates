import { Cormorant_Garamond, Manrope } from "next/font/google";

/**
 * Display face — the editorial voice.
 *
 * Weights are deliberately restricted to 400/500/600. Cormorant offers 300 and
 * lighter, but at the hero's 60–104px those weights go spindly and read as
 * fashion-editorial rather than financial-editorial. 500 is the primary
 * display weight; 600 is for emphasis only.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  // Distinct from the `--font-display` theme token, which composes this with
  // its fallback stack. Naming them the same would be a circular var().
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

/**
 * Interface face — the precise digital layer underneath the serif.
 *
 * This is also the face for every rupee figure on the site. Cormorant's ₹
 * coverage is unreliable and a missing glyph falls back silently mid-word, so
 * `₹50 Lakh`, `₹1 Crore` and `₹500/month` all render in Manrope.
 */
export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});
