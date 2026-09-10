# Sarvam Associates

Marketing and lead-generation site for Sarvam Associates — a chartered
accountancy practice in Bhandup (West), Mumbai, that also distributes
investment products.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion.

```bash
npm run dev      # http://localhost:3000
npm run build    # 49 routes, all prerendered
npm run check    # claim guard + typecheck + lint  ← run before every commit
```

---

## ⚠️ Required before launch

The site builds and runs without these, but must not go live until they are
supplied. Each is a single constant.

| What | Where | Current state |
|---|---|---|
| **AMFI ARN number** | `REGISTRATIONS.arn` in `lib/content/company.ts` | `"ARN-XXXXXX"`. AMFI requires the ARN on distributor marketing material. `hasArn` is false while it contains `XXXXXX`, and every surface that would print it renders nothing rather than showing a placeholder to the public. |
| **Phone number** | `COMPANY.phone` in `lib/content/company.ts` | `null`. **No phone number appears in any source document.** Contact surfaces render email-only and the LocalBusiness JSON-LD omits `telephone` rather than inventing one. |
| **Real testimonials** | `lib/content/testimonials.ts` | All six entries are `placeholder: true` — the source document heads them "Dummy Reviews". A visible notice tells readers they are illustrative. See that file's header for the swap procedure. |
| **Lead delivery** | `LEAD_WEBHOOK_URL` env var, consumed by `lib/forms/deliver.ts` | Unset. Submissions validate and return success but are delivered nowhere. |

---

## Brand assets

Both supplied PNGs live untouched in `public/image/`. Everything else there is
derived by `npm run build:assets`
([scripts/build-brand-assets.mjs](scripts/build-brand-assets.mjs)), so it is
reproducible — re-run it if either original is replaced.

| File | Origin | Used for |
|---|---|---|
| `sarvam_logo.png` | supplied | source for the icons |
| `sarvam_main.png` | supplied | header logo |
| `icon-512.png` | derived | favicon |
| `apple-icon.png` | derived | iOS home screen |
| `sarvam-main-onnavy.png` | derived | footer logo |

Three things the derivation handles:

- **The icon original is 3157×2481 and 119 KB** — not square, and far too heavy
  for a tab icon. Underneath the transparent padding the mark is a true
  2063×2063 square, so it trims cleanly and resizes to 512.
- **iOS composites transparent icons onto black**, which would bury the navy
  half of the mark, so `apple-icon` is flattened onto paper.
- **The wordmark is `#00387A` — the footer's own ground.** The supplied logo is
  invisible there. The reversed version recolours navy to paper by a hue test
  (navy has B>R, orange has R>B), which catches every anti-aliased edge pixel
  and leaves the orange alone. Alpha is preserved, so edges stay clean.

  It is generated, not official. If you have a proper reversed logo, drop it in
  as `sarvam-main-onnavy.png` and it takes over with no code change.

The logo renders through `next/image` with no `sizes` attribute — a fixed-size
logo only needs a 1x/2x srcset, and setting `sizes` makes Next emit candidates
up to 3840w for a 945px source. Served as webp; both logos together are 8 KB.

---

## Design system

Every token lives in the `@theme` block in
[app/globals.css](app/globals.css); nothing is hard-coded in a component.

### Palette — taken from the live brand

The colours are the brand's own, extracted from the rendered stylesheet at
**sarvamassociates.com**, whose theme declares `--navy #00387a`,
`--navy2 #002d63`, `--gold #f26522`, `--text #1a2e4a`, `--muted #4a6a8f`,
`--border #dde8f5`, `--bg #f4f8ff`, `--card #ffffff`.

Two of those names mislead: `--gold` is a vivid **orange**, and `--green` is
aliased to the same value. The token here is called `accent`, after what it
does rather than what the source calls it.

| Role | Token | Value |
|---|---|---|
| Page ground | `paper` | `#F4F8FF` |
| Card surfaces | `card` | `#FFFFFF` |
| Alternating sections | `mist` | `#E5EEF6` |
| Hairlines | `line` | `#DDE8F5` |
| Dark sections | `navy` / `navy-deep` | `#00387A` / `#002D63` |
| Paragraph text | `body` | `#1A2E4A` (12.9:1 on paper) |
| Metadata | `muted` | `#4A6A8F` (5.3:1 — AA, unlike the previous palette) |
| **Accent** | `accent` | `#F26522` |
| Accent as text | `accent-ink` | `#A63C09` |
| Accent on dark | `accent-light` | `#FDE8D8` |
| Positive / error | `positive` / `error` | `#1B6B52` / `#B3261E` |

`positive` and `error` are the only invented values — the source theme has no
distinct success or error colour, and the reds in its stylesheet are
WooCommerce defaults rather than brand.

### The accent is a budget, not a mood

Site-wide there are ~28 accent classes, and each is an accent line, an active
state, or a small detail: the hairline before every eyebrow, the nav's
active-route underline, the process timeline's fill, the INDICATIVE chip, focus
rings, and the contact icons in the footer and closing CTA.

Orange is deliberately **not** used for buttons, headlines, statistics or card
borders. The primary CTA is navy-on-paper, inverted inside dark sections. The
live site does use orange CTAs, but white-on-`#F26522` is **3.15:1** — below AA
— so that one allocation was not copied. If you want the orange button back,
`accent` background with `navy` text measures 5.2:1 and is the accessible way
to get it.

Three contrast rules are load-bearing, all of them measured against the ground
each colour actually lands on:

- `accent` is **2.96:1 on paper** — below AA and below even the 3:1 large-text
  floor. It must never carry text on a light ground. Use `accent-ink`.
- `accent-ink` is checked against the *composited chip tint* (4.7:1), not
  against flat paper (6.0:1). The 14% accent wash behind a chip darkens the
  ground enough to matter; an earlier value passed on paper and failed in the
  chip.
- On navy, plain `accent` is 3.6:1 — fine for icons, not for words. Text on
  navy uses `paper` or `accent-light`.

### Type

**Cormorant Garamond** for display, **Manrope** for everything else — including
every rupee figure, because Cormorant's ₹ coverage is unreliable and a missing
glyph falls back silently mid-word.

The scale is defined once as Tailwind `--text-*` tokens with line-height,
tracking and weight baked in: `text-display-hero` / `-lg` / `-md` / `-sm`,
`text-card`, `text-body-lg`, `text-eyebrow`, `text-stat` / `-sm`. Use those —
never an ad-hoc `text-[clamp(...)]`.

Statistics are Manrope 700, tight and tabular; the serif is for statements, not
figures.

The live site uses **Montserrat** throughout. That was left in place rather than
copied — the brief that set this typography was explicit and separate from the
colour request. Switching is a two-line change in
[app/fonts.ts](app/fonts.ts) if you want the sites to match on type as well.

> **Gotcha worth knowing.** `tailwind-merge` classifies any unfamiliar `text-*`
> as a colour, so `cn("text-display-lg", "text-navy")` silently dropped the
> size and flattened every section heading to body text. The custom sizes are
> registered with `extendTailwindMerge` in [lib/utils.ts](lib/utils.ts). Add
> any new `--text-*` token to that list too.

### Rhythm and spacing

Sections use `section-sm` / `section` / `section-lg` (48–160px, fluid), never
raw `py-*`. Width comes from `container-page` (1280px + 64px desktop gutter);
no section invents its own.

Light and dark alternate deliberately —
paper → mist → paper → **navy** → paper → **navy** → paper → mist → **navy**.
Dark sections are reserved for institutional access, the process, the closing
CTA and the footer.

Radii are capped and named: `rounded-input` 10px, `rounded-card` 14px,
`rounded-panel` 24px, `rounded-pill` for CTAs.

---

## Compliance architecture

This is the part that most distinguishes the codebase from a generic marketing
site, and it is structural rather than cosmetic.

### 1. One disclaimer registry

Every regulatory string lives exactly once in `lib/content/disclaimers.ts` and
is referenced by key. A typo is a TypeScript error, not a silently-missing
legal notice.

Some strings are reproduced **verbatim** and must not be "corrected" —
`securities-market-risk` reads "Investment in securities market **are**
subject to market risks" because that is the standard mandated phrasing.

### 2. Risk disclosure is guaranteed by the type system

```ts
risks: [string, ...string[]]   // non-empty tuple
```

A `Product` cannot be added without stating its risks. `lib/content/index.ts`
additionally asserts at module load — so during `next build` — that every
product has risks, at least one disclaimer, and ≥3 benefits. A content mistake
fails the build.

### 3. The claim guard

`npm run check:claims` scans user-facing source (comments stripped) for wording
that must never ship: guaranteed/assured returns, "risk-free", "100% safe",
"without the risk", "instant disbursement", "SEBI Registered Investment
Advisor", "capital guarantee". It is a regression guard — the corrections below
are easy to undo during a copy edit.

### 4. Reveals degrade to visible

Scroll animations are CSS-first (`globals.css`), not JS-first. Content is
visible by default; the hidden state applies only under `html.js`, which the
bootstrap script in `app/layout.tsx` sets — and a 2.5s failsafe removes again
if hydration never happens. A JS-first reveal would make every below-the-fold
section, disclaimers included, invisible to anyone whose JavaScript is slow or
blocked. On a site with mandatory risk disclosure that is not acceptable.

### 5. Disclaimers are legible

Nothing renders below `text-xs` (12px), and every pairing clears 4.5:1. The
source mockups set disclaimers at ~10px on navy at 20% opacity.

---

## Source material and decisions

Source files are preserved in `_source/` and excluded from the build.

| File | Role |
|---|---|
| `Sarvam Landing page.docx` | **Authoritative.** A screenshot-annotated revision brief (modified Aug 2026) against the two HTML mockups — rewritten hero, pillars, process steps, product boxes and stats. |
| `sarvam-wealth.html` | Homepage content baseline |
| `investment-products.html` | Product catalogue — every minimum and category traces here |

### Decisions taken

1. **Nuvama is retained**, overriding the revision document, which removed every
   Nuvama reference in five places. Sarvam is presented strictly as
   *distributor*; Nuvama Wealth Management Ltd as *manufacturer*. The homepage
   "Who does what" panel states this explicitly. The document's other copy
   rewrites still apply — they are independent of the partner question.
2. **AMFI-registered distributor.** All "SEBI Registered Investment Advisor"
   wording is removed sitewide; an entity cannot generally be both a
   fee-charging RIA and a commission-earning distributor, and no RIA number
   exists in any source.
3. **CA services are real pages on this site** — `/services` plus four detail
   routes. Their copy is Sarvam's own, taken from the service pages on
   sarvamassociates.com (including the five audit sub-pages) and rewritten for
   hierarchy and readability. Nothing about them is invented. All four now
   resolve internally; no nav, footer or homepage link leaves the site.

### Two omissions on the CA service pages

Both are cases where the source copy is Sarvam's own but has aged, and
republishing it as current would be worse than leaving it out. Both are marked
in [lib/content/services.ts](lib/content/services.ts).

| Omitted | Why |
|---|---|
| GST thresholds of **₹20 lakh / ₹10 lakh**, and **"GSTR 1, 2, 3"** as the three monthly returns | GSTR-2 and GSTR-3 were suspended, and the goods threshold has since risen in most states. Registration triggers are described qualitatively instead, with a visible note that current limits are confirmed per client. |
| Turnaround commitments on the direct-tax page | The source publishes contradictory SLAs across its packages — queries answered "within a week" in one tier and "within 24 hrs" in another. Reproducing either would create a commitment the practice may not have set deliberately. Turnaround is agreed per engagement. |

The list of cases where GST registration is compulsory regardless of turnover
**is** reproduced — inter-state supply, casual taxable persons, reverse charge,
non-residents, e-commerce, TDS deductors and the rest are all still accurate.

### Claims corrected from source

Each correction preserves the original in a code comment, so any is a one-line
revert.

| Source claim | Problem | Ships as |
|---|---|---|
| "Ab FD se zyada kamao — **without the risk**" | Absolute risk-free claim, contradicted by every disclaimer on the same page. The revision doc annotated the copy beneath it and left this untouched — unreviewed, not deliberate. | "…**without the guesswork**" |
| "**No commissions** driving our advice" | Incompatible with the distributor model, whose revenue *is* trail commission. | "No product pushed to hit a target. We tell you how we're paid…" |
| "…debentures — with **your base investment protected**" | States universally what is true only of select principal-protected MLDs, and remains issuer-credit dependent. | "…**base capital protection available on select offerings**" |
| "**Instant** disbursement" | Sanction is at the lender's discretion. | "**Quick** disbursement… subject to approval" |
| "**₹1Cr+** assets guided" | ~₹20k per investor across "500+ investors", beside a ₹1L Cr+ figure on the same page. | **Dropped** |
| "FD 7–9% vs equity 12–18%" | FD figure contradicts the catalogue (6.5–7.5%); equity figure unsourced. | **Dropped** — one comparison table, from the catalogue |

---

## Architecture

```
app/                 routes; all static except /api/consultation
components/
  ui/                primitives — Button, Chip, Disclaimer, RiskMeter, Faq…
  sections/          homepage sections
  products/          ProductCard, ProductFinder
  forms/             ConsultationForm (3 steps, RHF + zod)
  layout/            Header, Footer, nav
  motion/            Reveal (server) + RevealObserver (one IO for the page)
lib/content/         all content as typed data — never inline in JSX
lib/forms/           schema + delivery
scripts/             the claim guard
```

**Server-first.** Only genuine interactivity is `"use client"`: nav state, the
form, the product filter, the reveal observer, and the three decorative motion
pieces. `Button` and `Faq` are deliberately server components — hover states
are CSS, and the FAQ uses native `<details>` (free a11y, Ctrl+F finds collapsed
answers, zero JS).

**Content is data.** Products carry machine values (`risk: "high"`,
`minInvestment: { amount: 5000000 }`) and every user-facing string derives from
the maps in `lib/content/display.ts`. That is what lets one stored field drive
both a card and the filter without the two ever drifting.

---

## Verified

- `npm run check` and `npm run build` both exit 0 — 49 routes prerendered, zero
  TypeScript errors, zero lint warnings
- Zero hydration errors
- Zero broken internal links (3,295 hrefs crawled across 44 pages)
- No horizontal scroll at 320 / 375 / 390 / 414 / 768 / 1024 / 1280 / 1440 /
  1920 px
- Header verified at the 1024 and 1280 breakpoints
- Reduced motion: no element remains hidden
- Form: valid submit, `+91`/`0` prefix normalisation, invalid-mobile rejection,
  missing-consent rejection, silent honeypot, rate limit at 5/min
- Claim guard passes; no stale palette hexes remain in source
