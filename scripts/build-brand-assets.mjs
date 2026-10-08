/**
 * Derive the shipping brand assets from the two supplied PNGs.
 *
 * The originals are kept in public/image/ untouched. Everything generated here
 * is derived, and re-running this script reproduces it exactly.
 *
 *   icon-512.png            square favicon — the mark trimmed of its transparent
 *                           padding (it is a true 2063x2063 square underneath)
 *                           and resized. The original is 3157x2481 and 119 KB,
 *                           which no browser should be asked to fetch for a tab
 *                           icon.
 *   apple-icon.png          180x180 on an opaque paper ground. iOS composites
 *                           transparent icons onto black, which would bury the
 *                           navy half of the mark.
 *   sarvam-main-onnavy.png  the horizontal lockup with its navy recoloured to
 *                           paper, for the navy footer. The wordmark is
 *                           #00387A — the same navy as the footer ground — so
 *                           the supplied file is literally invisible there.
 *
 * The recolour is a hue test, not a fixed-colour match: the mark contains only
 * navy (#00387A, B>R) and orange (#F26522, R>B), so splitting on that keeps the
 * orange untouched and catches every anti-aliased navy edge pixel. Alpha is
 * preserved byte for byte, so edges stay smooth on any background.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

/*
   sharp is loaded dynamically, and deliberately not declared as a dependency.

   It is ~30MB of platform binaries needed by this one script, which runs only
   when the logo changes — the assets it produces are committed, so a normal
   install and build never touch it. Declaring it would put that download in
   front of every `npm install` for nothing.

   A static `import` would have resolved anyway today, because Next hoists its
   own copy of sharp for image optimization. That is luck, not a contract: the
   day Next stops bundling it, a static import fails at parse time with a
   module-not-found trace. This fails with a sentence instead.
*/
let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error(
    "\nThis script needs sharp, which is not a dependency of this project.\n" +
      "It is only required when regenerating brand assets:\n\n" +
      "  npm install --no-save sharp\n" +
      "  npm run build:assets\n",
  );
  process.exit(1);
}

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "image");

/*
   The square mark lives beside this script, NOT in public/.

   It is a build input and nothing serves it, but while it sat in public/image
   every deploy shipped 122KB of it to the CDN and anyone could fetch
   /image/sarvam_logo.png. The horizontal lockup below stays in public/ because
   the site genuinely renders it.
*/
const SRC = join(import.meta.dirname, "brand");
mkdirSync(OUT, { recursive: true });

const PAPER = [0xf4, 0xf8, 0xff]; // --color-paper

/* ----------------------------------------------------------------- favicon */

const mark = sharp(join(SRC, "sarvam_logo.png")).trim();

await mark
  .clone()
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(join(OUT, "icon-512.png"));

await mark
  .clone()
  .resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    background: { r: PAPER[0], g: PAPER[1], b: PAPER[2], alpha: 1 },
  })
  .flatten({ background: { r: PAPER[0], g: PAPER[1], b: PAPER[2] } })
  .png({ compressionLevel: 9 })
  .toFile(join(OUT, "apple-icon.png"));

/* --------------------------------------------------- reversed lockup */

const src = join(OUT, "sarvam_main.png");
const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });

let swapped = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] === 0) continue; // fully transparent — leave it
  // Navy family: blue channel above red. Orange is the inverse.
  if (data[i + 2] > data[i]) {
    data[i] = PAPER[0];
    data[i + 1] = PAPER[1];
    data[i + 2] = PAPER[2];
    swapped++;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: info.channels },
})
  .png({ compressionLevel: 9 })
  .toFile(join(OUT, "sarvam-main-onnavy.png"));

console.log(`recoloured ${swapped.toLocaleString()} navy pixels -> paper`);
console.log("wrote icon-512.png, apple-icon.png, sarvam-main-onnavy.png");
