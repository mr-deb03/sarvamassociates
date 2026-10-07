import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand lockup.
 *
 * Two files, same artwork. `sarvam_main.png` is the supplied original, used on
 * light grounds. `sarvam-main-onnavy.png` is derived from it by
 * `scripts/build-brand-assets.mjs`, which recolours the navy to paper — the
 * wordmark is #00387A, exactly the footer's own ground, so the original is
 * literally invisible down there. The orange is untouched in both.
 *
 * `sizes` is deliberately NOT set: with it, next/image emits the full
 * viewport-width candidate list up to 3840w for a 945px source. Omitting it
 * gives a plain 1x/2x srcset off the `width` prop, which is all a fixed-size
 * logo can use.
 *
 * Display size is a CSS class rather than the width/height attributes, so it
 * can step down on narrow screens. The attributes still carry the true aspect
 * ratio, so the box is reserved before the image loads and CLS stays at zero.
 */

const LOGO = {
  light: "/image/sarvam_main.png",
  onNavy: "/image/sarvam-main-onnavy.png",
} as const;

/**
 * 945:190 reduced by its GCD of 5 — the artwork's exact ratio, not an
 * approximation of it.
 *
 * These are only a ratio and a srcset hint; CSS sets the real size. The pair
 * must not coincide with any rendered size, and does not: the rendered heights
 * are 36/44/52, never 38. That matters because next/image warns when exactly
 * one of width/height differs from its attribute, and `w-auto` derives the
 * width from the *served* image — which Next rounds to integers (945×190
 * became 256×51, a 5.0196 ratio rather than 4.9737). A previous 219×44 left
 * height matching at `h-11` while width came back 221, tripping that warning.
 * With 189×38 both always differ, at every breakpoint.
 */
const BASE = { width: 189, height: 38 };

const SIZES = {
  /** Header: steps down at 320–360px, where the hamburger crowds it. */
  header: "h-9 w-auto sm:h-11",
  footer: "h-11 w-auto sm:h-13",
} as const;

export function Logo({
  onDark = false,
  className,
  href = "/",
  variant = "header",
  priority = false,
}: {
  onDark?: boolean;
  className?: string;
  href?: string;
  variant?: keyof typeof SIZES;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-80",
        className,
      )}
      aria-label="Sarvam Associates — home"
    >
      <Image
        src={onDark ? LOGO.onNavy : LOGO.light}
        // Empty on purpose: the link above already carries the accessible
        // name. Repeating it here makes screen readers announce the brand
        // twice for one control.
        alt=""
        width={BASE.width}
        height={BASE.height}
        priority={priority}
        className={SIZES[variant]}
      />
    </Link>
  );
}
