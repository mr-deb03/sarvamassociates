# Sarvam Associates

Marketing and lead-generation site for Sarvam Associates — a chartered
accountancy practice in Bhandup (West), Mumbai, that also distributes
investment products.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion.

```bash
npm run dev      # http://localhost:3000
npm run build    # 44 routes, all prerendered
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

## Design system

Quiet luxury + institutional precision + human advisory. Every token lives in
the `@theme` block in [app/globals.css](app/globals.css); nothing is
hard-coded in a component.

### Palette — and the ratio that matters

| Role | Token | Value |
|---|---|---|
| Page ground (≈70%) | `ivory` | `#F5F1E8` |
| Tinted sections (≈8%) | `sand` | `#E8E1D4` |
| Hairlines | `line` | `#D8D2C5` |
| Dark sections (≈20%) | `charcoal` / `forest` | `#101A19` / `#182625` |
| Paragraph text | `body` | `#2E3A38` (10.6:1 on ivory) |
| Metadata only | `muted` | `#68716E` |
| **Accent (≈2%)** | `champagne` | `#B89B63` |
| Positive / error | `positive` / `error` | `#52705F` / `#A65B55` |

**The 2% is a real budget, not a vibe.** Site-wide there are ~28 champagne
classes, and each one is an accent line, an active state, or a tiny detail:
the hairline before every eyebrow, the nav's active-route underline, the
process timeline's fill, the INDICATIVE chip, focus rings, and the two contact
icons in the footer and closing CTA.

Champagne is explicitly **not** used for buttons, headlines, statistics, icon
plates or card borders. The primary CTA is charcoal-on-ivory (inverted inside
dark sections). If the site can be described as "gold and black", something has
regressed.

Two contrast rules are load-bearing:

- `champagne` measures **2.4:1 on ivory** and must never carry text there. Use
  `champagne-ink` (`#7A6433`, 5.0:1) on light grounds; plain `champagne` is
  fine on dark (6.6:1).
- `muted` is 4.45:1 — below AA for body copy. It is for metadata only.
  Paragraphs and disclaimers use `body`.

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

> **Gotcha worth knowing.** `tailwind-merge` classifies any unfamiliar `text-*`
> as a colour, so `cn("text-display-lg", "text-charcoal")` silently dropped the
> size and flattened every section heading to body text. The custom sizes are
> registered with `extendTailwindMerge` in [lib/utils.ts](lib/utils.ts). Add
> any new `--text-*` token to that list too.

### Rhythm and spacing

Sections use `section-sm` / `section` / `section-lg` (48–160px, fluid), never
raw `py-*`. Width comes from `container-page` (1280px + 64px desktop gutter);
no section invents its own.

Light and dark alternate deliberately —
ivory → sand → ivory → **dark** → ivory → **dark** → ivory → sand → **dark**.
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
3. **CA services link out** to sarvamassociates.com. The source supplies names
   and URLs but no page content, and empty routes are worse than none.

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

- `npm run check` and `npm run build` both exit 0 — 44 routes prerendered, zero
  TypeScript errors, zero lint warnings
- Zero hydration errors
- Zero broken internal links (2,336 hrefs crawled across 39 pages)
- No horizontal scroll at 320 / 375 / 390 / 414 / 768 / 1024 / 1280 / 1440 /
  1920 px
- Header verified at the 1024 and 1280 breakpoints
- Reduced motion: no element remains hidden
- Form: valid submit, `+91`/`0` prefix normalisation, invalid-mobile rejection,
  missing-consent rejection, silent honeypot, rate limit at 5/min
- Claim guard passes; no stale palette hexes remain in source
