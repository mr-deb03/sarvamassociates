# Sarvam Associates

Marketing and lead-generation site for Sarvam Associates — a chartered
accountancy practice in Bhandup (West), Mumbai, that also distributes
investment products.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion.

```bash
npm run dev      # http://localhost:3000
npm run build    # 51 routes
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
| **Real testimonials** | `lib/content/testimonials.ts` | All six entries are `placeholder: true` — the source document heads them "Dummy Reviews". The home page leaves the section out entirely until at least one entry is real. See that file's header for the swap procedure. |
| **Lead delivery** | `SMTP_USER` + `SMTP_PASSWORD` (email, to `LEAD_EMAIL_TO`) and/or `LEAD_WEBHOOK_URL`, consumed by `lib/forms/deliver.ts` | Must be set on the host. With neither, submissions validate and return success but are delivered nowhere. |
| **Signing key** | `PLAN_SECRET` env var | Unset. Signs the plan-access and admin cookies and hashes OTP codes. Development generates a throwaway key per process; **production refuses to serve the planner without it**. Needs ≥32 characters — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| **Admin password** | `ADMIN_PASSWORD` env var | Unset. `/admin` returns "not set up yet" until it is supplied. Minimum 8 characters. |
| **SMS provider** | `SMS_PROVIDER` + credentials | Unset. Verification codes are logged to the terminal in development and **will not send at all in production**, so nobody can open a plan. See `.env.example`. |
| **Database** | `DATABASE_URL` env var | Unset. Without it the planner writes local JSON files, which **cannot work on Vercel, Netlify or Lambda** — those filesystems are read-only and the first submission fails with `EROFS`. Set it to a Postgres connection string the deployment can actually reach; `npm run check:db` tests it. |

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

**Montserrat** for display, **Open Sans** for everything else. Montserrat is
the face the practice already uses on sarvamassociates.com and in the logo
wordmark, so the site's headings and its own mark are now the same typeface.

Both load as variable fonts (no `weight` array), covering the full axis in one
file per style instead of one per weight. Three files ship per page, ~112 KB:
Montserrat normal, Montserrat italic, Open Sans normal. Open Sans normal only —
every italic on the site sits inside a display heading, so there is no body
italic to pay for.

> **Open Sans has no rupee glyph.** Not "missing from the latin subset" —
> U+20B9 is absent from the font entirely (so are ₽ and ₴), confirmed by
> reading the cmap of Google's full unsubsetted file. Left alone the browser
> fell back to Arial for that one character, which `CSS.getPlatformFontsForNode`
> exposed as a stray 1-glyph Arial run inside every "₹500/month".
>
> The fix is the fallback order of `--font-sans`, which names `"Open Sans"`
> **directly** rather than using `var(--font-open-sans)`. That variable expands
> to `"Open Sans", "Open Sans Fallback"`, and the second family is
> `local(Arial)` with metric overrides — it has its own ₹ and swallowed the
> glyph before anything later could be reached. (`adjustFontFallback: false`
> does not remove it in this Next version; it was tried.) Montserrat now sits
> next in the chain, so ₹ lands on the other brand face, and Montserrat carries
> `latin-ext` because that is the slice U+20B9 lives in.
>
> **If you change either face, re-check this.** A body font without ₹ is a real
> hazard on this site — prices are everywhere.

The scale is defined once as Tailwind `--text-*` tokens with line-height,
tracking and weight baked in: `text-display-hero` / `-lg` / `-md` / `-sm`,
`text-card`, `text-body-lg`, `text-eyebrow`, `text-stat` / `-sm`. Use those —
never an ad-hoc `text-[clamp(...)]`.

> **The scale was recut for the new faces, not just repointed.** The previous
> numbers were cut for a high-contrast serif and are actively wrong for a
> geometric sans: Montserrat's x-height is far larger and its forms wider, so
> the old `0.96` hero line-height collides across lines and `-0.035em` runs the
> letters together at 104px. Display weight moved `500 → 700` for the two
> largest steps, because a geometric sans at medium weight reads limp above
> ~60px and 700 is how the brand sets its own headlines. Stat tracking relaxed
> from `-0.045em` to `-0.028em` — Open Sans has noticeably wider digits than
> Manrope. If you swap either face again, these need revisiting.

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

## The financial planner

`/financial-plan` is the site's main lead capture. A visitor maps their income,
expenses, goals and holdings across five steps; the server computes a plan,
stores it, and texts a six-digit code. Entering the code opens the plan, which
they can read on screen or save as a PDF. Every submission lands in `/admin`.

The field set is lifted from the planning worksheet the practice already uses
internally, so a plan generated on the site maps field-for-field onto what the
advisor has on their desk.

### The flow, and where the data is captured

```
step 1  About you          name, DOB, gender, marital status, retirement ages,
                           risk profile, target mix (five editable figures)
step 2  Income & expenses  2 income lines, 11 expense lines, savings already
                           running, emergency buffer, household split
step 3  Goals & liabilities 8 goal types; each carries its own cost, target
                           year, inflation, return, existing saving, step-up
step 4  Assets & mapping   holdings, each optionally earmarked against a goal
step 5  Review & verify    three plan-level assumptions, THEN email and mobile,
                           consent, submit
                              │
                              ▼
                     POST /api/plan ──► record written  (pending-verification)
                              │         OTP issued and texted
                              ▼
                     POST /api/plan/verify ──► status: verified
                                               sa_plan cookie set
                              │
                              ▼
                     /financial-plan/<id>   the plan, and the PDF
```

**Contact details are asked for last, not first.** Nothing on step 1 is a way
of reaching anybody — the date of birth sets the retirement horizon, marital
status frames the household split. The email and mobile are collected on step 5,
where the visitor has already spent ten minutes on their own figures and the
number buys them the result. Asking up front would have been worse for
conversion and a worse bargain. Step 1 says so in as many words, because a
visitor who has just landed wants to know it before they start typing.

**The record is written before the code is entered, deliberately.** The visitor
has already pressed a button under a consent line naming Sarvam Associates, so
the enquiry is complete at that moment. Verification gates sight of the
*result*, not capture of the enquiry — an abandoned verification still reaches
the practice, flagged `pending-verification` so nobody mistakes an unconfirmed
number for one that answered.

That is the "indirect data collection" the planner is for, and it only works
honestly if the trade is visible. It is: step 5 states where the details go
before the submit button, and `plan-data-handling` in the disclaimer registry
restates it on the page.

### What is never asked for

No PAN, no Aadhaar, no bank or folio details, no account numbers. The practice's
own worksheet opens with a "Search Client / PAN" box because it is an internal
tool looking up an existing client; a public form asking an unauthenticated
visitor for the same thing is a different proposition, and brief §26 forbids it.
`lib/plan/catalog.ts` records the omission at the point where it would otherwise
have been added.

### The arithmetic

`lib/plan/calc.ts` — pure functions, no React, no I/O. Compound arithmetic over
the figures the visitor typed, at the rates the visitor chose, and nothing more.

| | |
|---|---|
| Goal cost | `currentCost × (1 + inflation)^years` |
| Existing provision | lump sum, stepped SIP and earmarked holdings, each compounded to the target year |
| Required contribution | FV-annuity solve on the shortfall, plus the lump-sum equivalent |
| Retirement corpus | present value at retirement of an inflation-rising income, discounted at the **real** rate — `(1+nominal)/(1+inflation) − 1` — as an annuity due |
| Indicators | five named checks against stated thresholds, not one score |

Three deliberate choices:

- **Retirement assumes expenses continue at today's level in real terms.** The
  conventional 70–80% replacement ratio would have been invented; the
  conservative assumption needs no source and the report states it.
- **Returns and inflation are the visitor's own.** The seeds — 6% inflation
  (top of the RBI tolerance band), 10% return (a round number below long-run
  equity and above long-run debt) — are labelled as starting points everywhere
  they appear, and the plan prints every one of them back in the assumptions
  section.
- **No single score.** Five indicators with named thresholds, because a score
  out of a hundred compresses unrelated facts into something that reads as a
  verdict.

The engine is checked against the practice's own worksheet in
`scripts/verify-plan-math.mjs` — wired into `npm run check` — with 20
assertions, including the two totals the worksheet computes itself (₹35,000 family income, ₹13,000 expenses from the
same eleven lines).

### Compliance

The planner produces a document that looks professionally prepared, so the
caveat has to be unmissable rather than buried. Three registry entries carry it:

| Key | Appears |
|---|---|
| `plan-illustration` | the wizard, the plan, every printed page |
| `plan-assumptions-are-yours` | the plan, the assumptions section |
| `plan-data-handling` | the wizard, before submit |

The protection section renders only when the visitor ticks the box, shows its
three input lines openly, is labelled a reference rather than a recommendation,
and carries the IRDAI solicitation notice.

### The PDF

A print stylesheet, not a server-side renderer. `PrintButton` calls
`window.print()`; the rules at the foot of `app/globals.css` restyle the plan
page itself, so the PDF is the document the visitor is already looking at —
same typography, same figures, selectable text.

The decisive argument is the ₹ glyph. It is absent from Open Sans and has
already caused trouble on this site; going through the browser's own print
pipeline means the plan uses the fonts the page has already loaded, with no
second font-embedding problem to solve. Verified: 9 A4 pages, correct margins,
backgrounds preserved, reveal-on-scroll sections forced visible (they would
otherwise never fire on paper, and disclaimers sit inside them — a compliance
rule, not a cosmetic one).

If a server-rendered PDF is ever needed, point headless Chrome at the same
route rather than building a second layout.

### Storage

`lib/plan/store.ts` defines a `PlanStore` port with two adapters, chosen by one
rule and no flag:

| `DATABASE_URL` | Adapter |
|---|---|
| set | **Postgres** (`store-postgres.ts`) — plain `pg` against any connection string |
| blank | **Local files** — one JSON per submission in `.data/plans`, gitignored |

The Postgres table is created on first use; a plan form is not worth a
migration step. One row per submission: the whole record in a `jsonb` column —
byte-for-byte what the file adapter writes to disk — with the fields the admin
list needs lifted into real columns beside it. The record format is therefore
identical across both adapters, and the list view is one indexed query rather
than a read of every submission.

The Postgres adapter does one thing the file store cannot: `update()` runs
inside a transaction with `SELECT … FOR UPDATE`. That matters because the OTP
attempt counter lives on the record, and two wrong codes arriving together
would otherwise each read the same count and write back the same increment —
a free guess for anyone who double-submits.

`npm run check:db` connects, creates the table and counts rows, with an
explanatory message for each of the usual failures (wrong password, missing
database, firewall, self-signed certificate).

### Hosting — the thing that actually bit

**The first Vercel deployment failed on every submission**, showing the visitor
"We could not reach the server. Check your connection and try again."

Three faults in a row:

1. `process.cwd()` on Vercel is `/var/task`, which is **read-only**. The file
   store's `mkdir` threw `EROFS`.
2. The route handler had no catch, so Next returned **500 with an empty body**.
3. Every client did `await response.json()` *inside* the try. An empty body
   fails to parse, the catch fires, and the visitor is told to check their
   internet — while the real fault is a server-side exception nobody has been
   shown.

All three are fixed. `lib/plan/post-json.ts` now owns every browser-to-API
call: the fetch is the only thing inside the try, the body is read as text and
parsed defensively, and a server fault is reported as a server fault, naming
the status so it can be quoted in an email. Route handlers that fail return
JSON with an actionable message, never an empty 500.

**A database on your own machine is not reachable from a cloud host.**
`localhost` inside a Vercel function means Vercel's server, not yours. Pick
one:

| | |
|---|---|
| Hosted Postgres | Neon, Supabase, Railway. Change `DATABASE_URL`, nothing else. |
| Your Postgres, exposed | A TCP tunnel. Doable — see the next section for what it really costs. |
| Host the app beside the database | A VPS, Render, Railway, or your own server. The file store also works here. |

`assertDurableStorage()` logs a specific warning in production when a
serverless host is detected with no `DATABASE_URL`, instead of waiting for the
first submission to fail.

`vercel.json` pins functions to **`sin1` (Singapore)**, and it must match
whichever region the database is in. Vercel defaults to Washington, which is
the wrong side of the planet for this audience.

Singapore rather than Mumbai (`bom1`) because Neon has no Indian region, and
**co-locating the function with the database beats co-locating it with the
visitor**. A page render makes several database round trips but only one
response to the browser, so 50ms between function and database is paid many
times over while 50ms between Mumbai and Singapore is paid once. Static pages
are served from the CDN edge regardless and are unaffected either way.

If the database ends up somewhere else, change this to match it.

### Running the live site against Postgres on your own machine

It can be done, and the code supports it — `DATABASE_URL` is just a connection
string. What follows is what it actually costs, because the setup looks
cheaper than it is.

**Three things have to be true at once:**

1. The machine is powered on, awake and online whenever the website is. A
   Windows laptop that sleeps takes the planner down with it.
2. The database has a stable address reachable from the public internet.
3. Postgres is configured to accept remote, TLS-encrypted connections.

#### Getting a public address

| Method | Works behind CGNAT | Cost | Notes |
|---|---|---|---|
| **ngrok TCP** — `ngrok tcp 5432` | yes | free tier gives a random address that changes on every restart; a reserved address needs a paid plan | simplest to try |
| **Reverse SSH tunnel to a small VPS** | yes | ~$4/month | stable address you control; the VPS forwards a port back down the tunnel |
| **Router port-forward + dynamic DNS** | **no** | free | needs a real public IP. Most Indian home broadband is behind CGNAT, which makes this impossible |

**Cloudflare Tunnel and Tailscale do not help here**, which is worth saying
because they are the first two suggestions anyone offers. Both need a client
daemon at the *consuming* end — `cloudflared access tcp`, or a tailnet member —
and a Vercel function cannot run either. Neither gives you a plain
`postgres://` address a serverless function can dial.

#### What it costs

- **Latency.** Every query crosses the internet to a home connection, and
  opening a Postgres connection is several round trips before any query runs.
  Serverless opens connections often. Pages will feel slower, and that is not
  something tuning fixes. `vercel.json` pins functions to `bom1` (Mumbai) to
  make the hop as short as it can be.
- **Availability.** The site is only as reliable as that machine and that
  broadband line.
- **Exposure.** Vercel's egress IPs are not static on Hobby or Pro, so **you
  cannot restrict the database by IP**. It is open to the whole internet with a
  password and TLS as the only defence, and it will be found by scanners within
  hours of going up.

#### If you do it anyway

Give the app its own role rather than using `postgres`:

```sql
CREATE DATABASE sarvam;
CREATE ROLE sarvam_app LOGIN PASSWORD '<long random string>';
GRANT CONNECT ON DATABASE sarvam TO sarvam_app;
\c sarvam
GRANT USAGE, CREATE ON SCHEMA public TO sarvam_app;
```

`CREATE` on the schema is needed because the adapter creates its own table on
first use.

In `postgresql.conf` (Windows: `C:\Program Files\PostgreSQL\18\data\`):

```
listen_addresses = '*'
ssl = on
```

In `pg_hba.conf` — `hostssl`, not `host`, so an unencrypted connection is
refused outright:

```
hostssl  sarvam  sarvam_app  0.0.0.0/0  scram-sha-256
```

Then `Restart-Service postgresql-x64-18`, start the tunnel, and set:

```
DATABASE_URL=postgresql://sarvam_app:PASSWORD@<public-host>:<port>/sarvam?sslmode=require
```

**One wrinkle on certificates.** Postgres's default certificate is self-signed
and will not match the tunnel's public hostname, so verification fails and you
need `DATABASE_SSL_NO_VERIFY=true`. That keeps the traffic encrypted but stops
authenticating the server, which means the connection is no longer protected
against interception at the tunnel's edge. The honest fix is a certificate
issued for the public hostname; the honest alternative is not to route client
financial data over a tunnel you cannot verify.

#### The recommendation

Use hosted Postgres for the live site and keep the local one for development.
It is the same `DATABASE_URL` variable and no code change — set the local
string in `.env.local`, the hosted one in Vercel, and `npm run check:db` tests
whichever machine you run it on. Neon and Supabase free tiers are far larger
than this site will need, and the site stops depending on a PC being awake.

#### When the connection drops

It will, and the code is built for it rather than against it:

- A submission returns **HTTP 503 with a readable message**, never an empty 500.
- A visitor opening their plan link gets a short "we cannot open your plan just
  now, it has not been lost" page.
- `/admin/plans` renders a diagnostic panel naming the host it tried, the exact
  error, and the usual causes — instead of an empty table. That last part
  matters more than it sounds: an earlier version showed "No plans have been
  submitted yet" during an outage, because Node's `AggregateError` carries an
  empty `message` and the falsy check fell through. A practice would have read
  that as a quiet week. `describeStoreError()` in `lib/plan/store.ts` exists
  for exactly that, and the call sites test `!== null`.

**These rows hold personal financial data.** Back them up, keep the data
directory off any public path, and restrict database access to the service
account.

### Admin

`/admin` — one shared password, which is the right weight for one office. List,
search, filter, CSV export, full plan view, permanent delete.

**A trap worth knowing about.** The session check started life in
`app/admin/layout.tsx`, rendering a sign-in form in place of `children`. That is
not a security boundary: a layout does not stop its page from running. Next
renders the page segment regardless, so the page fetched every submission and
serialised the lot — names, mobile numbers, incomes — into the flight payload of
a response whose visible content was a password box. The HTML said "sign in";
the bytes underneath held the data. It was caught by diffing a signed-out
response, not by reading the code.

The gate now sits on the data instead, in `lib/plan/admin-data.ts`:

```ts
export async function adminStore(): Promise<PlanStore | null> {
  return (await isAdmin()) ? getStore() : null;
}
```

Nullable, so authorisation is not something a new admin page has to remember —
it is something TypeScript will not let it skip. **Admin pages must not call
`getStore()` directly.**

### Access control

| | |
|---|---|
| Plan id | 12 random bytes, base64url — unguessable |
| `sa_plan` cookie | HMAC-signed, httpOnly, names one plan id, 7 days |
| `sa_admin` cookie | HMAC-signed, httpOnly, `sameSite: strict`, 8 hours |
| OTP | stored as an HMAC keyed with the plan id, never in the clear; cleared on success |
| Brute force | 5 guesses per code, 3 resends per plan, 45s cooldown, plus per-IP limits |
| Admin login | 5 attempts per IP per 15 minutes; one message for wrong and unset alike |

A leaked link is not enough on its own: the id in the URL and the signed cookie
must agree, so a plan pasted into a group chat opens the locked screen. Admin
routes return **404, not 401**, when signed out, so an unauthenticated caller
cannot use them to discover whether a reference exists.

Generated plans are `noindex, nofollow, nocache` and `Disallow`ed in
`robots.txt`; `/financial-plan` itself stays indexable.

### SMS

`lib/plan/sms.ts` — one function, four providers: `msg91` (India, needs a
DLT-approved template containing `##OTP##`), `twilio`, `webhook`, `console`.

Unconfigured, development logs the code to the terminal and shows it on the
verification screen, so the whole flow is testable without an SMS account.
**Production refuses to pretend**: an unconfigured provider returns a failure
rather than silently dropping the message, because a visitor waiting for a code
that was never sent is worse than an honest error.

---

## Withdrawn: loans against securities

The practice no longer offers lending against a portfolio, so the whole line is
gone: three products (Loan Against Mutual Funds / Shares / PMS & Bonds), the
Smart Liquidity category, `/financial-solutions`, its navigation group and
footer column, the "Loan against securities" option on the consultation form,
the "Access liquidity" goal in the product finder, and the `las-collateral`
disclaimer.

Two things followed that are worth knowing:

**The `domain` field went with it.** It existed only to route one category to
`/financial-solutions` instead of `/investments`. With that category gone every
remaining one is an investment, so the field said nothing and a dozen
`c.domain === "investment"` filters were just noise. `Category.domain`, the
`Domain` type and `getProductsByDomain()` are all removed.

**Ten redirects, not four.** The four withdrawn URLs were live on this site and
are in its sitemap history, so they 301 to `/investments`. But six entries in
the legacy WordPress map — `/service/business-loan`, `/service/home-loan`,
`/service/loan-against-property` and the financing-consultation pages — already
pointed at `/financial-solutions`, and deleting it would have turned six
working redirects into 404s. Those now go to `/contact`: someone searching
"Sarvam business loan" wants to ask a person, and a catalogue of mutual funds
is not an answer to that.

What stayed: the planner still asks what a client owes. A home loan or a car
loan is the client's own liability, and net worth, the EMI-burden indicator and
the protection figure are all computed from it.

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

### A trap worth knowing about

The mobile menu panel is **portalled to `document.body`**, and that is
load-bearing rather than tidiness.

Once the page scrolls, `HeaderShell` applies `backdrop-blur-xl`. An element
with a `backdrop-filter` becomes the containing block for every
`position: fixed` descendant — so with the panel nested inside `<header>`, its
`fixed inset-0` resolved against the 80px-tall header instead of the viewport.
The menu opened into an 80px strip, which read as "the menu stopped working
after scrolling".

The same applies to `filter`, `transform`, `perspective`, `contain: paint` and
`will-change`. If you ever add one of those to an ancestor, anything `fixed`
inside it will silently start positioning against that ancestor.

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
app/                 routes; static except /api/*, /admin/* and a generated plan
  financial-plan/    the planner, and /[id] for a generated plan
  admin/             submissions list and detail, behind one password
components/
  ui/                primitives — Button, Chip, Disclaimer, RiskMeter, Faq…
  sections/          homepage sections
  products/          ProductCard, ProductFinder
  forms/             ConsultationForm (3 steps, RHF + zod)
  plan/              the 5-step wizard, the OTP gate, the plan document
  admin/             login, submissions table, delete
  layout/            Header, Footer, nav
  motion/            Reveal (server) + RevealObserver (one IO for the page)
lib/content/         all content as typed data — never inline in JSX
lib/forms/           consultation schema + delivery
lib/plan/            planner domain — catalog, schema, calc, store, otp,
                     sms, crypto, access, admin-data
scripts/             the claim guard, brand assets, plan-math verification
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

- `npm run check` and `npm run build` both exit 0 — 51 routes, zero
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

**Financial planner**

- Plan arithmetic checked against the practice's own worksheet — 20 assertions,
  including the two totals the worksheet computes itself. Runs as part of
  `npm run check`, so a change to the formulas has to answer for itself
- Full flow end to end: submit → record stored `pending-verification` → wrong
  code counted down → correct code → `sa_plan` cookie → plan renders
- Gate holds: an unverified plan URL shows the locked screen and leaks nothing
  but a masked mobile number
- **Admin leak found and closed** — the signed-out `/admin/plans` response
  carried every submission in its flight payload while displaying a password
  box. Re-verified: zero occurrences of any name, number, email or figure
- Admin routes return 404 rather than 401 when signed out
- PDF: 9 A4 pages, correct geometry, backgrounds preserved, revealed sections
  forced visible
- Header re-measured after adding a nav item — the CTA overflowed by 42px at
  exactly 1280px, so `FAQ` gave up its slot; now clears at every width from
  320 to 1920
- No horizontal scroll on the wizard or the plan at 390 or 1280; console clean
- **Postgres adapter exercised end to end in production mode** against a real
  Postgres 18: table auto-created, submission stored, OTP dispatched through a
  live HTTP SMS provider, wrong code counted down, correct code verified, plan
  rendered from the database, admin list and CSV export served from it, and the
  OTP hash confirmed cleared from the row on success
- The Vercel failure reproduced locally (unwritable data directory) and
  re-tested after the fix: HTTP 503 with an actionable JSON message instead of
  an empty 500 reported as a network error
