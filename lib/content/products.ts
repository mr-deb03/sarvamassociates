import type { Product } from "./types";

/* ==========================================================================
   Product catalogue.

   Every figure here traces to a line in the source material (chiefly
   _source/investment-products.html). Nothing is invented. Where the source
   overstated a claim, the correction is applied and the original preserved in
   a comment so the change is auditable and reversible.

   `risks` is a non-empty tuple by type. A product literally cannot be added
   without stating its risks.
   ========================================================================== */

export const PRODUCTS: Product[] = [
  /* ====================================================================
     01 — GOAL-BASED INVESTING
     ==================================================================== */
  {
    slug: "systematic-investment-plan",
    category: "goal-based-investing",
    badge: "SIP",
    name: "Systematic Investment Plan",
    summary:
      "Build wealth steadily with disciplined monthly investments, so compounding does the heavy lifting over time.",
    overview: [
      "A Systematic Investment Plan is simply a standing instruction: a fixed amount moves from your bank account into a chosen mutual fund on the same date every month.",
      "Because you invest the same rupee amount regardless of price, you buy more units when markets fall and fewer when they rise. Over a long horizon this removes the need to time the market — which is the single hardest thing for any investor to do well.",
      "It is the most common starting point for a first-time investor, and it stays useful at every level of wealth.",
    ],
    minInvestment: { amount: 500, cadence: "monthly", label: "₹500/month" },
    risk: "moderately-high",
    liquidity: "high",
    goals: ["grow-wealth", "plan-retirement"],
    benefits: [
      "Start small — ₹500 a month is enough to begin.",
      "Removes market timing from the decision entirely.",
      "Auto-debit means the discipline is automatic, not a monthly act of willpower.",
      "Open-ended funds can be paused, increased or redeemed without penalty.",
      "Long horizons let compounding do most of the work.",
    ],
    audience: [
      "First-time investors who want to start without a large lump sum",
      "Salaried professionals investing a fixed share of monthly income",
      "Parents building toward a specific, dated goal such as education",
      "Anyone who has tried to time the market and would rather not",
    ],
    risks: [
      "Returns are not fixed or assured. Equity SIPs can and do show losses over short periods.",
      "A SIP reduces timing risk but does not remove market risk — a falling market lowers the value of units already bought.",
      "Stopping a SIP during a market decline converts a paper loss into a realised one, which is the most common way investors lose money in SIPs.",
      "Equity funds need a long horizon. Money you may need within three years generally does not belong in one.",
      "Exit loads and capital gains tax apply on redemption depending on the fund and holding period.",
    ],
    details: [
      { label: "Minimum", value: "₹500 per month" },
      { label: "Suggested horizon", value: "5 years or more" },
      { label: "Liquidity", value: "Open-ended — redeem any business day" },
      { label: "Lock-in", value: "None (except ELSS, 3 years)" },
    ],
    howItWorks: [
      {
        title: "Understand",
        description:
          "We map the goal, the date you need the money, and how much volatility you can genuinely live with.",
      },
      {
        title: "Select",
        description:
          "We shortlist funds that fit that horizon and risk level, and explain why each one is on the list.",
      },
      {
        title: "Start",
        description:
          "Digital KYC and a bank mandate. The first instalment is usually debited within days.",
      },
      {
        title: "Review",
        description:
          "We check progress against the goal, not against last quarter's chart, and rebalance annually.",
      },
    ],
    disclaimerIds: ["mf-market-risk", "past-performance", "distributor-role"],
    faqs: [
      {
        question: "What happens if I miss a month?",
        answer:
          "Nothing punitive. The bank may levy a mandate-failure charge, but the SIP itself continues and the missed instalment is simply not invested. Repeated misses will affect your goal, so tell us early if the amount needs reducing.",
      },
      {
        question: "Can I stop or change the amount later?",
        answer:
          "Yes. Open-ended SIPs can be paused, increased, reduced or stopped at any time without penalty from the fund. ELSS funds are the exception — each instalment is locked in for three years from its own investment date.",
      },
      {
        question: "Is a SIP safer than investing a lump sum?",
        answer:
          "It spreads your entry across many price points, which reduces the risk of investing everything at a peak. It does not make the underlying fund any less volatile. A SIP into an equity fund is still an equity investment.",
      },
    ],
    seo: {
      title: "Start a SIP from ₹500/month",
      description:
        "Systematic Investment Plans starting at ₹500 a month, matched to your goal and horizon by an advisor who knows your full financial picture.",
    },
  },
  {
    slug: "diversified-mutual-funds",
    category: "goal-based-investing",
    badge: "Mutual Funds",
    name: "Diversified Mutual Funds",
    summary:
      "A curated basket of equity, hybrid and debt funds selected for your risk appetite and time horizon.",
    overview: [
      "Rather than picking a fund from a list of several thousand, we build a small, deliberate set that covers the ground your plan actually needs — growth, stability and a cash buffer.",
      "Selection considers the fund's mandate, how long the manager has run it, cost, and how it behaves when markets fall. The last of those matters more than most investors expect.",
    ],
    minInvestment: { amount: 1000, cadence: "one-time", label: "₹1,000" },
    risk: "moderate",
    liquidity: "high",
    goals: ["grow-wealth", "generate-income"],
    benefits: [
      "Professional management and diversification from a small starting amount.",
      "A mix of equity, hybrid and debt matched to your horizon rather than to a sales target.",
      "Open-ended funds redeem in a few business days.",
      "Tax treatment differs by fund type, and we plan for it before you invest rather than in March.",
    ],
    audience: [
      "Investors who want diversification without researching individual funds",
      "Anyone consolidating scattered, inherited or forgotten holdings",
      "Investors with several goals on different timelines",
    ],
    risks: [
      "All mutual funds carry market risk. Returns vary and can be negative.",
      "Debt funds are not risk-free — they carry both credit risk and interest-rate risk, and can fall in value.",
      "Diversification reduces the impact of any one holding failing; it does not protect against a broad market decline.",
      "Exit loads may apply on redemption within a defined period.",
      "Gains are taxable, with treatment depending on fund category and holding period.",
    ],
    details: [
      { label: "Minimum", value: "₹1,000 lump sum" },
      { label: "Fund types", value: "Equity, hybrid and debt" },
      { label: "Liquidity", value: "Open-ended — redeem any business day" },
    ],
    disclaimerIds: ["mf-market-risk", "past-performance", "distributor-role"],
    seo: {
      title: "Diversified Mutual Funds — curated for your horizon",
      description:
        "A curated basket of equity, hybrid and debt mutual funds selected for your risk appetite and time horizon. From ₹1,000.",
    },
  },
  {
    slug: "retirement-planning",
    category: "goal-based-investing",
    badge: "Retirement",
    name: "Retirement Planning",
    summary:
      "NPS, long-duration equity funds and annuity products structured so you don't outlive your money.",
    overview: [
      "Retirement planning is really two problems. The first is accumulating enough. The second — the one most plans ignore — is drawing it down over two or three decades without running out.",
      "We work backward from the income you will need, adjust for inflation, and build toward that number using NPS, long-duration equity, and annuity products where a guaranteed income floor genuinely helps.",
    ],
    minInvestment: { amount: 500, cadence: "monthly", label: "₹500/month" },
    risk: "moderate",
    liquidity: "locked-in",
    goals: ["plan-retirement", "reduce-tax"],
    benefits: [
      "Planned against a target monthly income, not an arbitrary corpus figure.",
      "NPS contributions carry their own tax deduction over and above Section 80C.",
      "Long horizons make equity exposure appropriate for longer than most people assume.",
      "The drawdown phase is planned before you reach it, not improvised afterwards.",
    ],
    audience: [
      "Salaried professionals with 15+ years to retirement",
      "Business owners with no employer pension of any kind",
      "Anyone within ten years of retiring who has not modelled the drawdown",
    ],
    risks: [
      "NPS is substantially locked in until 60, with only limited partial withdrawals permitted for specified purposes.",
      "A portion of the NPS corpus must be annuitised at exit; annuity rates available at that time are unknown today.",
      "Annuity income is taxable as income in the year received.",
      "Equity allocations remain subject to market risk, including in the years immediately before retirement.",
      "Inflation is the central risk to any retirement plan and can erode purchasing power even when nominal returns look adequate.",
    ],
    details: [
      { label: "Minimum", value: "₹500 per month" },
      { label: "Instruments", value: "NPS, long-duration equity, annuity" },
      { label: "Liquidity", value: "Largely locked in until retirement" },
    ],
    disclaimerIds: [
      "mf-market-risk",
      "past-performance",
      "insurance-irdai",
      "distributor-role",
    ],
    seo: {
      title: "Retirement Planning — NPS, equity and annuity",
      description:
        "Retirement planning built backward from the income you'll need. NPS, long-duration equity and annuity products, planned through the drawdown phase.",
    },
  },

  /* ====================================================================
     02 — WEALTH CREATION
     ==================================================================== */
  {
    slug: "equity-mutual-funds",
    category: "wealth-creation",
    badge: "Equity",
    name: "Equity Mutual Funds",
    summary:
      "Large-cap, mid-cap, flexi-cap and sectoral funds — exposure to India's growth through professionally managed portfolios.",
    overview: [
      "Equity funds pool money to buy shares in listed companies. What separates them is mandate: a large-cap fund buys established businesses, a mid-cap fund buys smaller and more volatile ones, a flexi-cap fund moves between them.",
      "Most portfolios need only a few of these. We favour a small number of well-understood funds over a long list that quietly holds the same twenty stocks several times over.",
    ],
    minInvestment: { amount: 5000, cadence: "one-time", label: "₹5,000" },
    risk: "high",
    liquidity: "high",
    goals: ["grow-wealth"],
    benefits: [
      "Historically the most effective long-horizon hedge against inflation available to retail investors.",
      "Professional research and execution at retail ticket sizes.",
      "Fund mandates let you choose your exact position on the risk scale.",
      "Fully liquid — no lock-in outside ELSS.",
    ],
    audience: [
      "Investors with a horizon of seven years or more",
      "Anyone whose savings sit entirely in deposits and are losing ground to inflation",
      "Investors who can watch a portfolio fall 30% and not sell",
    ],
    risks: [
      "Equity funds are high risk. Falls of 30–50% have occurred in past market cycles and will occur again.",
      "Sectoral and thematic funds concentrate risk deliberately and can underperform for many years at a stretch.",
      "Mid- and small-cap funds are materially more volatile than large-cap funds and can be harder to exit in a stressed market.",
      "There is no assured return and no capital protection of any kind.",
      "Capital gains tax applies on redemption.",
    ],
    details: [
      { label: "Minimum", value: "₹5,000" },
      { label: "Suggested horizon", value: "7 years or more" },
      { label: "Risk", value: "High — capital loss possible" },
    ],
    disclaimerIds: ["mf-market-risk", "past-performance", "distributor-role"],
    seo: {
      title: "Equity Mutual Funds — large-cap, mid-cap and flexi-cap",
      description:
        "Professionally managed equity mutual funds across large-cap, mid-cap, flexi-cap and sectoral mandates. From ₹5,000. Subject to market risk.",
    },
  },
  {
    slug: "multi-asset-funds",
    category: "wealth-creation",
    badge: "Multi-Asset",
    name: "Multi-Asset Funds",
    summary:
      "Balanced allocation across equity, debt, accent and international assets for a smoother ride.",
    overview: [
      "A multi-asset fund holds several asset classes at once, and rebalances between them inside the fund. When equity falls, accent or debt often does not, and the blend cushions the fall.",
      "The trade-off is symmetrical and worth stating plainly: the same blend that softens the falls also caps the rises. These funds are chosen for a steadier path, not a higher destination.",
    ],
    minInvestment: { amount: 5000, cadence: "one-time", label: "₹5,000" },
    risk: "moderately-high",
    liquidity: "high",
    goals: ["grow-wealth", "generate-income"],
    benefits: [
      "Diversification across asset classes inside a single fund.",
      "Rebalancing happens internally — no action needed from you and no tax event on each switch.",
      "Historically shallower drawdowns than a pure equity fund.",
      "A reasonable entry point for investors uneasy with full equity exposure.",
    ],
    audience: [
      "Investors who want equity participation with less severe falls",
      "First-time investors stepping beyond deposits",
      "Anyone who has previously sold in a panic during a market decline",
    ],
    risks: [
      "Still subject to market risk. A multi-asset fund can fall in value.",
      "Diversification limits upside as well as downside — these funds typically lag pure equity in strong bull markets.",
      "Gold and international allocations carry their own price and currency risk.",
      "Taxation depends on the fund's actual equity allocation and can change if that allocation shifts.",
    ],
    details: [
      { label: "Minimum", value: "₹5,000" },
      { label: "Assets", value: "Equity, debt, accent, international" },
      { label: "Rebalancing", value: "Managed inside the fund" },
    ],
    disclaimerIds: ["mf-market-risk", "past-performance", "distributor-role"],
    seo: {
      title: "Multi-Asset Funds — equity, debt, accent and international",
      description:
        "Multi-asset funds blending equity, debt, accent and international exposure for a steadier path. From ₹5,000. Subject to market risk.",
    },
  },
  {
    slug: "curated-growth-portfolio",
    category: "wealth-creation",
    badge: "Growth Portfolio",
    name: "Curated Growth Portfolio",
    summary:
      "A Sarvam-curated basket of five to seven high-conviction equity funds, reviewed quarterly.",
    overview: [
      "Our advisors maintain a model portfolio of five to seven equity funds, reviewed every quarter against market conditions and research.",
      "This is not a separate product with its own structure — you hold the underlying funds directly in your own folios. What you get is the selection, the weights, and the discipline of a quarterly review.",
    ],
    minInvestment: { amount: 50000, cadence: "one-time", label: "₹50,000" },
    risk: "high",
    liquidity: "high",
    goals: ["grow-wealth"],
    benefits: [
      "A considered shortlist rather than a fund supermarket.",
      "Reviewed quarterly, with changes explained rather than simply executed.",
      "You hold the underlying funds directly — no additional product wrapper or layer of fees.",
      "Built for the specific client base we actually advise, not a generic model.",
    ],
    audience: [
      "Investors with ₹50,000 or more to deploy into equity",
      "Anyone who wants an active view without moving to PMS ticket sizes",
      "Investors who would rather delegate fund selection entirely",
    ],
    risks: [
      "A concentrated basket of equity funds is high risk and can fall sharply.",
      "Concentration cuts both ways — fewer funds means a poor call has a larger effect.",
      "Quarterly changes can trigger capital gains tax and exit loads.",
      "Past selections are no guide to future ones. There is no assured return.",
    ],
    details: [
      { label: "Minimum", value: "₹50,000" },
      { label: "Holdings", value: "5–7 equity funds" },
      { label: "Review", value: "Quarterly" },
    ],
    disclaimerIds: [
      "mf-market-risk",
      "past-performance",
      "not-investment-advice",
      "distributor-role",
    ],
    seo: {
      title: "Curated Growth Portfolio — 5–7 funds, reviewed quarterly",
      description:
        "A Sarvam-curated basket of five to seven high-conviction equity funds, reviewed quarterly. From ₹50,000. Subject to market risk.",
    },
  },

  /* ====================================================================
     03 — PMS
     ==================================================================== */
  {
    slug: "pms-multicap-growth",
    category: "pms",
    badge: "Multicap",
    name: "Multicap Growth Strategy",
    summary:
      "A high-conviction portfolio across large, mid and small caps, held directly in your own demat account.",
    overview: [
      "A Portfolio Management Service differs from a mutual fund in one structural way that matters: the shares are bought in your name and held in your own demat account. You own the stocks, not units in a pool.",
      "That brings real advantages — full transparency into every holding, and capital gains computed on your individual transactions rather than shared across a fund. It also brings a higher minimum, higher fees, and concentration risk, because a high-conviction portfolio deliberately holds far fewer stocks than a diversified fund.",
      "The Multicap Growth Strategy invests across large, mid and small capitalisations, managed by the manufacturer's equity research team. Sarvam's role is to establish whether the strategy genuinely fits your profile, and to manage the relationship thereafter.",
    ],
    minInvestment: { amount: 5000000, cadence: "one-time", label: "₹50 Lakh" },
    risk: "very-high",
    liquidity: "moderate",
    goals: ["grow-wealth"],
    benefits: [
      "Direct stock ownership in your own demat account, with complete visibility of every holding.",
      "Capital gains computed on your individual transactions rather than pooled.",
      "High-conviction positions, unconstrained by the diversification rules that bind mutual funds.",
      "Regulated by SEBI, with a mandated disclosure document and client agreement.",
      "Matched to your profile by an advisor who also knows your tax position.",
    ],
    audience: [
      "Investors able to commit ₹50,00,000 or more to a single equity strategy",
      "Investors who already hold diversified mutual funds and want a concentrated allocation alongside",
      "Business owners and professionals comfortable with substantial volatility",
      "Investors who want holding-level transparency rather than a monthly factsheet",
    ],
    risks: [
      "Very high risk. A concentrated equity portfolio can fall far more sharply than a diversified fund.",
      "Concentration is the strategy, and it is also the risk — a small number of poor calls has an outsized effect.",
      "Mid- and small-cap holdings can become difficult to exit in a stressed market.",
      "PMS fee structures are higher than mutual funds and may include a performance fee. Fees reduce returns whether or not the strategy performs.",
      "Returns are not assured and past performance of any strategy is no indication of future results.",
      "The regulatory minimum of ₹50,00,000 means this is not an appropriate first equity investment.",
    ],
    details: [
      { label: "Minimum investment", value: "₹50,00,000 (regulatory)" },
      { label: "Holding structure", value: "Direct — your own demat account" },
      { label: "Regulation", value: "SEBI-regulated PMS" },
      { label: "Suggested horizon", value: "5 years or more" },
      { label: "Risk", value: "Very high" },
      { label: "Liquidity", value: "Redeemable, subject to strategy terms" },
    ],
    howItWorks: [
      {
        title: "Understand",
        description:
          "We review your existing portfolio, tax position and horizon, and establish whether a PMS allocation is appropriate at all.",
      },
      {
        title: "Evaluate",
        description:
          "We walk through the strategy's mandate, concentration, fee structure and disclosure document — including how it has behaved in falling markets.",
      },
      {
        title: "Apply",
        description:
          "Demat and PMS account opening, KYC, the client agreement, and the power of attorney the structure requires.",
      },
      {
        title: "Review",
        description:
          "Portfolio conversations at agreed intervals, with holding-level reporting and tax-aware planning around your other investments.",
      },
    ],
    disclaimerIds: [
      "pms-eligibility",
      "securities-market-risk",
      "past-performance",
      "nuvama-facilitation",
      "distributor-role",
    ],
    faqs: [
      {
        question: "How is PMS actually different from a mutual fund?",
        answer:
          "In a mutual fund your money is pooled and you own units. In a PMS the shares are bought in your name and sit in your own demat account. You see every holding and every transaction, and your capital gains are computed on your own trades rather than shared across a pool.",
      },
      {
        question: "Why is the minimum ₹50 lakh?",
        answer:
          "It is a SEBI regulatory minimum for Portfolio Management Services, not a figure set by us or by the manufacturer. It cannot be waived or reduced.",
      },
      {
        question: "Is PMS riskier than a mutual fund?",
        answer:
          "Generally yes. A high-conviction PMS holds far fewer stocks than a diversified equity fund, so both gains and losses are amplified. It should be considered as an addition to a diversified portfolio, not a replacement for one.",
      },
      {
        question: "What does Sarvam do, and what does the manufacturer do?",
        answer:
          "The strategy is managed by the product manufacturer's investment team — they make every buy and sell decision. Sarvam Associates is the authorised distribution partner: we assess suitability, handle onboarding, and manage your relationship and reviews. We do not manage the portfolio.",
      },
    ],
    seo: {
      title: "PMS Multicap Growth Strategy — minimum ₹50 lakh",
      description:
        "A high-conviction multicap PMS strategy with direct stock ownership in your own demat account. SEBI regulatory minimum ₹50,00,000. Very high risk.",
    },
  },
  {
    slug: "pms-quality-compounders",
    category: "pms",
    badge: "Quality",
    name: "Quality & Compounders",
    summary:
      "Businesses with durable competitive advantages, held patiently. Built for long-term investors.",
    overview: [
      "This strategy concentrates on businesses with strong balance sheets, consistent returns on capital, and a defensible position in their market — the kind of company that compounds quietly over a decade.",
      "It typically trails the market in sharp speculative rallies and holds up better in falls. Suitability depends far more on your patience than on your risk appetite.",
    ],
    minInvestment: { amount: 5000000, cadence: "one-time", label: "₹50 Lakh" },
    risk: "high",
    liquidity: "moderate",
    goals: ["grow-wealth"],
    benefits: [
      "Focus on balance-sheet quality and durable competitive position.",
      "Typically lower portfolio turnover, which means lower transaction costs and fewer taxable events.",
      "Direct stock ownership with full holding-level transparency.",
      "Historically steadier behaviour in falling markets than momentum-led strategies.",
    ],
    audience: [
      "Investors with a horizon of seven years or more",
      "Investors who value a shallower drawdown over a faster climb",
      "HNIs diversifying across more than one PMS style",
    ],
    risks: [
      "High risk. Concentrated equity exposure with no capital protection.",
      "Quality strategies can underperform for extended periods, particularly in speculative rallies.",
      "Quality businesses often trade at high valuations, and a de-rating can hurt even when the business performs well.",
      "PMS fees are higher than mutual funds and reduce returns regardless of performance.",
      "Requires the ₹50,00,000 regulatory minimum.",
    ],
    details: [
      { label: "Minimum investment", value: "₹50,00,000 (regulatory)" },
      { label: "Style", value: "Quality, low turnover" },
      { label: "Suggested horizon", value: "7 years or more" },
      { label: "Risk", value: "High" },
    ],
    disclaimerIds: [
      "pms-eligibility",
      "securities-market-risk",
      "past-performance",
      "nuvama-facilitation",
      "distributor-role",
    ],
    seo: {
      title: "PMS Quality & Compounders — minimum ₹50 lakh",
      description:
        "A PMS strategy focused on businesses with durable competitive advantages, held patiently. SEBI minimum ₹50,00,000. High risk.",
    },
  },
  {
    slug: "pms-bespoke-portfolio",
    category: "pms",
    badge: "Custom",
    name: "Bespoke Portfolio",
    summary:
      "Custom-built portfolios for investors with specific tax, sector or ESG requirements.",
    overview: [
      "Some investors need a portfolio built around a constraint rather than a market view — an existing concentrated holding, a sector they cannot own for professional reasons, a particular tax position, or an ESG mandate.",
      "A bespoke mandate accommodates those constraints directly, at a higher minimum.",
    ],
    minInvestment: { amount: 10000000, cadence: "one-time", label: "₹1 Crore" },
    risk: "very-high",
    liquidity: "moderate",
    goals: ["grow-wealth"],
    benefits: [
      "Built around your actual constraints, not a standard model.",
      "Sector, stock or ESG exclusions can be specified up front.",
      "Coordinated with your existing holdings and tax position.",
      "Direct ownership with full transparency.",
    ],
    audience: [
      "Investors with ₹1,00,00,000 or more to allocate",
      "Promoters and executives with holdings or restrictions they must work around",
      "Families coordinating across several portfolios",
      "Investors with a specific ESG or exclusion mandate",
    ],
    risks: [
      "Very high risk. Customisation does not reduce market risk.",
      "Exclusions narrow the investable universe, which can increase concentration and cause the portfolio to diverge sharply from the broad market.",
      "Bespoke mandates typically carry higher fees.",
      "Requires a ₹1,00,00,000 minimum.",
      "No assured return and no capital protection.",
    ],
    details: [
      { label: "Minimum investment", value: "₹1,00,00,000" },
      { label: "Structure", value: "Custom mandate" },
      { label: "Risk", value: "Very high" },
    ],
    disclaimerIds: [
      "pms-eligibility",
      "securities-market-risk",
      "past-performance",
      "nuvama-facilitation",
      "distributor-role",
    ],
    seo: {
      title: "Bespoke PMS Portfolio — from ₹1 crore",
      description:
        "Custom-built PMS mandates for investors with specific tax, sector or ESG requirements. From ₹1,00,00,000. Very high risk.",
    },
  },

  /* ====================================================================
     04 — AIF
     ==================================================================== */
  {
    slug: "aif-category-i",
    category: "aif",
    badge: "Cat I AIF",
    name: "Venture Capital & SME Funds",
    summary:
      "Early-stage startups and growth-stage SMEs through SEBI-registered Category I AIFs.",
    overview: [
      "Category I AIFs invest in areas the regulator considers socially or economically desirable — venture capital, SMEs, infrastructure and social ventures.",
      "These are long-dated, illiquid commitments. Capital is drawn down over time as the fund finds deals, and returns, if any, arrive years later when holdings are sold. A total loss of the commitment is a real possibility.",
    ],
    minInvestment: { amount: 10000000, cadence: "one-time", label: "₹1 Crore" },
    risk: "very-high",
    liquidity: "locked-in",
    goals: ["grow-wealth"],
    benefits: [
      "Access to private, early-stage companies unavailable on public markets.",
      "Returns are driven by company outcomes rather than market sentiment.",
      "Managed and diligenced by a professional investment team.",
      "SEBI-registered structure with a mandated private placement memorandum.",
    ],
    audience: [
      "Eligible investors able to commit ₹1,00,00,000",
      "Investors with a substantial existing portfolio for whom this is a small allocation",
      "Investors who can lock capital away for eight to ten years",
      "Investors who genuinely accept the possibility of losing the entire commitment",
    ],
    risks: [
      "Very high risk. Early-stage investing carries a real possibility of total capital loss.",
      "Illiquid and locked in, typically for eight to ten years. There is no practical exit before the fund winds down.",
      "Capital is drawn down over time, so you must hold the committed amount available.",
      "Valuations between drawdown and exit are estimates, not realisable prices.",
      "Returns depend on a small number of successful exits, which may not materialise.",
      "AIF fee structures are complex and typically include both management and performance fees.",
    ],
    details: [
      { label: "Minimum commitment", value: "₹1,00,00,000 (regulatory)" },
      { label: "Category", value: "SEBI Category I AIF" },
      { label: "Typical tenure", value: "8–10 years" },
      { label: "Liquidity", value: "Locked in — no early exit" },
      { label: "Risk", value: "Very high, including total loss" },
    ],
    disclaimerIds: [
      "aif-eligibility",
      "securities-market-risk",
      "past-performance",
      "nuvama-facilitation",
      "distributor-role",
    ],
    seo: {
      title: "Category I AIF — venture capital and SME funds",
      description:
        "SEBI-registered Category I AIFs investing in early-stage startups and growth-stage SMEs. Minimum ₹1,00,00,000. Very high risk, illiquid.",
    },
  },
  {
    slug: "aif-category-ii",
    category: "aif",
    badge: "Cat II AIF",
    name: "Private Equity & Debt",
    summary:
      "Private equity, real estate debt and structured credit not available on public markets.",
    overview: [
      "Category II is the broadest AIF class — private equity funds, real estate debt, structured credit and similar strategies that use neither leverage nor the concessions granted to Category I.",
      "Debt-oriented Category II funds can produce contracted income streams, but they are still private, illiquid instruments whose returns depend entirely on borrowers meeting their obligations.",
    ],
    minInvestment: { amount: 10000000, cadence: "one-time", label: "₹1 Crore" },
    risk: "high",
    liquidity: "locked-in",
    goals: ["grow-wealth", "generate-income"],
    benefits: [
      "Exposure to private companies and credit unavailable to public-market investors.",
      "Debt-oriented strategies can generate contracted income.",
      "Returns are less directly correlated with daily equity market movement.",
      "Professional origination and diligence.",
    ],
    audience: [
      "Eligible investors able to commit ₹1,00,00,000",
      "HNIs diversifying beyond listed equity and bonds",
      "Investors seeking private credit income who accept illiquidity",
    ],
    risks: [
      "High risk with real possibility of capital loss.",
      "Illiquid and locked in for the fund's life — typically five to eight years.",
      "Private credit carries concentrated borrower default risk. A single default can materially affect returns.",
      "Real estate strategies are exposed to property cycles and project execution risk.",
      "Interim valuations are estimates and may not be realisable.",
      "Returns are not assured.",
    ],
    details: [
      { label: "Minimum commitment", value: "₹1,00,00,000 (regulatory)" },
      { label: "Category", value: "SEBI Category II AIF" },
      { label: "Typical tenure", value: "5–8 years" },
      { label: "Liquidity", value: "Locked in" },
      { label: "Risk", value: "High" },
    ],
    disclaimerIds: [
      "aif-eligibility",
      "securities-market-risk",
      "past-performance",
      "nuvama-facilitation",
      "distributor-role",
    ],
    seo: {
      title: "Category II AIF — private equity and structured credit",
      description:
        "SEBI-registered Category II AIFs across private equity, real estate debt and structured credit. Minimum ₹1,00,00,000. High risk, illiquid.",
    },
  },
  {
    slug: "aif-category-iii",
    category: "aif",
    badge: "Cat III AIF",
    name: "Long-Short & Quant Strategies",
    summary:
      "Hedge-fund-style strategies using derivatives, long-short equity and quantitative models.",
    overview: [
      "Category III AIFs may use leverage and derivatives, and pursue absolute-return strategies — long-short equity, quantitative models, and arbitrage.",
      "These strategies aim to make money in both rising and falling markets. When the model works, correlation with the market is low. When it does not, leverage magnifies the loss.",
    ],
    minInvestment: { amount: 10000000, cadence: "one-time", label: "₹1 Crore" },
    risk: "very-high",
    liquidity: "low",
    goals: ["grow-wealth"],
    benefits: [
      "Strategies designed to seek returns independent of market direction.",
      "Low correlation to a long-only equity portfolio when the strategy performs.",
      "Systematic, rules-based execution in quantitative mandates.",
      "May offer periodic redemption windows, unlike Category I and II.",
    ],
    audience: [
      "Sophisticated investors who understand derivatives and leverage",
      "Eligible investors able to commit ₹1,00,00,000",
      "Investors seeking diversification away from long-only equity",
    ],
    risks: [
      "Very high risk. Leverage magnifies losses as well as gains.",
      "Derivative strategies can lose money rapidly and in ways that are difficult to anticipate.",
      "Quantitative models are built on historical relationships that can break down without warning.",
      "Category III AIFs are taxed at the fund level, which materially affects net returns.",
      "Liquidity is limited to defined redemption windows, if offered at all.",
      "Strategy complexity makes performance difficult to attribute or predict.",
    ],
    details: [
      { label: "Minimum commitment", value: "₹1,00,00,000 (regulatory)" },
      { label: "Category", value: "SEBI Category III AIF" },
      { label: "Leverage", value: "Permitted — magnifies gains and losses" },
      { label: "Liquidity", value: "Limited redemption windows" },
      { label: "Risk", value: "Very high" },
    ],
    disclaimerIds: [
      "aif-eligibility",
      "securities-market-risk",
      "past-performance",
      "nuvama-facilitation",
      "distributor-role",
    ],
    seo: {
      title: "Category III AIF — long-short and quantitative strategies",
      description:
        "SEBI-registered Category III AIFs using derivatives, long-short equity and quantitative models. Minimum ₹1,00,00,000. Very high risk.",
    },
  },

  /* ====================================================================
     05 — STABLE INCOME
     ==================================================================== */
  {
    slug: "debt-mutual-funds",
    category: "stable-income",
    badge: "Debt Funds",
    name: "Debt Mutual Funds",
    summary:
      "Liquid, ultra-short, short-duration and corporate bond funds for investors who need stability with access.",
    overview: [
      "Debt funds lend money — to governments, banks and companies — and pass the interest through to you. They range from liquid funds holding near-cash instruments to corporate bond funds taking meaningful credit exposure.",
      "The practical advantage over a fixed deposit is access and flexibility: no fixed tenure, no premature-withdrawal penalty, redemption in a business day or two. The trade-off is that the value moves, and unlike an FD the return is not contracted in advance.",
    ],
    minInvestment: { amount: 1000, cadence: "one-time", label: "₹1,000" },
    risk: "moderately-low",
    liquidity: "high",
    goals: ["generate-income", "reduce-tax"],
    benefits: [
      "No fixed tenure and no premature-withdrawal penalty.",
      "Redemption typically within one to two business days.",
      "A range of durations lets you match the fund to when you actually need the money.",
      "Professional credit research behind every holding.",
    ],
    audience: [
      "Investors parking money for six months to three years",
      "Anyone building an emergency fund beyond a savings account",
      "Investors who want the debt portion of a portfolio managed properly",
    ],
    risks: [
      "Debt funds are not fixed deposits. Returns are not assured and the value can fall.",
      "Credit risk: if a borrower defaults, the fund's value falls. This has happened in Indian debt funds and caused real investor losses.",
      "Interest-rate risk: when rates rise, existing bond prices fall, and longer-duration funds fall further.",
      "In a stressed market, some debt funds have restricted or suspended redemptions.",
      "Taxation of debt fund gains has changed in recent years and depends on your holding period and applicable rules at the time.",
    ],
    details: [
      { label: "Minimum", value: "₹1,000" },
      { label: "Types", value: "Liquid, ultra-short, short-duration, corporate" },
      { label: "Liquidity", value: "Typically 1–2 business days" },
      { label: "Risk", value: "Moderately low — not risk-free" },
    ],
    disclaimerIds: ["mf-market-risk", "past-performance", "distributor-role"],
    seo: {
      title: "Debt Mutual Funds — liquid, short-duration and corporate bond",
      description:
        "Debt mutual funds for stability with access. No fixed tenure, no withdrawal penalty. From ₹1,000. Subject to credit and interest-rate risk.",
    },
  },
  {
    slug: "corporate-and-gsec-bonds",
    category: "stable-income",
    badge: "Bonds",
    name: "Corporate & G-Sec Bonds",
    summary:
      "Direct bond investments with fixed coupon payments — PSU bonds, NCDs and government securities.",
    overview: [
      "Buying a bond directly means lending to the issuer yourself. You receive a fixed coupon at set intervals and your principal back at maturity, provided the issuer pays.",
      "Government securities carry sovereign risk, which in rupee terms is the lowest available. Corporate bonds and NCDs pay more precisely because they carry more risk — the extra yield is compensation for the possibility that the issuer does not pay.",
    ],
    minInvestment: { amount: 10000, cadence: "one-time", label: "₹10,000" },
    risk: "moderate",
    liquidity: "low",
    goals: ["generate-income"],
    benefits: [
      "Coupon and maturity date are known when you buy.",
      "G-Secs carry sovereign risk — the lowest credit risk available in rupees.",
      "Predictable payment dates make cash-flow planning straightforward.",
      "Holdings are rated and vetted before they are offered.",
    ],
    audience: [
      "Investors wanting contracted income on known dates",
      "Retirees planning around specific cash-flow needs",
      "Investors comfortable holding to maturity",
    ],
    risks: [
      "Credit risk. If the issuer defaults, you can lose coupon payments and principal. A credit rating is an opinion, not a guarantee, and ratings are downgraded.",
      "Interest-rate risk. If rates rise after you buy, the market price of your bond falls — which matters if you need to sell before maturity.",
      "Liquidity risk. The Indian retail secondary bond market is thin; selling before maturity may be difficult or require accepting a discount.",
      "Coupon income is taxable as income at your slab rate.",
      "Higher-yielding bonds carry proportionally higher credit risk. Yield is compensation for risk, not a free lunch.",
    ],
    details: [
      { label: "Minimum", value: "₹10,000" },
      { label: "Instruments", value: "PSU bonds, NCDs, government securities" },
      { label: "Income", value: "Fixed coupon, taxed at slab rate" },
      { label: "Liquidity", value: "Low — thin secondary market" },
    ],
    disclaimerIds: [
      "securities-market-risk",
      "indicative-yield",
      "distributor-role",
    ],
    seo: {
      title: "Corporate & G-Sec Bonds — fixed coupon investments",
      description:
        "Direct bond investments with fixed coupons — PSU bonds, NCDs and government securities. From ₹10,000. Subject to credit and interest-rate risk.",
    },
  },
  {
    slug: "structured-fixed-income",
    category: "stable-income",
    badge: "Fixed Income",
    name: "Structured Fixed Income & MLDs",
    summary:
      "Market-linked debentures and structured products with defined payoffs. Base capital protection available on select offerings.",
    overview: [
      "A market-linked debenture is a bond whose return is tied to the performance of an underlying reference — an index, for example — rather than to a fixed coupon.",
      "Some MLD structures include base capital protection, meaning the structure is designed to return your principal at maturity even if the reference performs poorly. This is important to understand precisely: that protection depends on the issuer being able to pay. It is a feature of the structure, not a guarantee, and it does not survive an issuer default.",
      // SOURCE CORRECTION. The revision document's Box 5 copy read:
      //   "...market-linked debentures — better than FD returns, with your base
      //    investment protected."
      // Stated flatly, that asserts capital protection across debt funds, bonds
      // and MLDs alike, which is false. The same document's own Numbers card
      // scopes it to "select offerings". Scoped wording used throughout.
    ],
    minInvestment: { amount: 1000000, cadence: "one-time", label: "₹10 Lakh" },
    risk: "moderately-high",
    liquidity: "low",
    goals: ["generate-income"],
    benefits: [
      "A defined payoff structure known before you invest.",
      "Base capital protection available on select structures, subject to issuer credit.",
      "Return potential above a comparable fixed deposit, with correspondingly different risk.",
      "Structures can be matched to a specific horizon.",
    ],
    audience: [
      "Investors able to commit ₹10,00,000 or more",
      "Investors who can hold to maturity",
      "Investors seeking a defined payoff rather than open-ended market exposure",
    ],
    risks: [
      "Capital protection, where offered, depends entirely on the issuer meeting its obligations. If the issuer defaults, protection fails.",
      "Returns are linked to an underlying reference and are not assured. A poor reference outcome can mean returns of zero.",
      "Indicative yields are illustrations of how the structure behaves, not forecasts and not promises.",
      "MLDs are illiquid. Exiting before maturity may be difficult or require accepting a significant discount.",
      "Payoff structures are complex. Do not invest in one you cannot explain back in your own words.",
      "Tax treatment of market-linked debentures has changed in recent years and should be confirmed before investing.",
    ],
    details: [
      { label: "Minimum", value: "₹10,00,000" },
      {
        label: "Indicative return range",
        value: "8.5–12%",
        indicative: true,
      },
      {
        label: "Base capital protection",
        value: "Select structures only, subject to issuer credit",
      },
      { label: "Liquidity", value: "Low — designed to be held to maturity" },
    ],
    disclaimerIds: [
      "mld-capital-protection",
      "indicative-yield",
      "securities-market-risk",
      "nuvama-facilitation",
      "distributor-role",
    ],
    faqs: [
      {
        question: "Does 100% base capital protection mean my money is safe?",
        answer:
          "It means the structure is designed to return your principal at maturity even if the underlying reference performs poorly. It does not protect you if the issuer fails to pay. Protection is a feature of the structure and depends on issuer credit — it is not a guarantee and it is not the same as a deposit.",
      },
      {
        question: "Where does the 8.5–12% figure come from?",
        answer:
          "It is an indicative range describing how these structures are designed to behave across different outcomes. It is not a forecast, not a promise, and not a range you should expect to receive. Actual returns depend on the underlying reference and could be lower, including zero.",
      },
    ],
    seo: {
      title: "Structured Fixed Income & Market-Linked Debentures",
      description:
        "Market-linked debentures with defined payoffs and base capital protection on select structures, subject to issuer credit. From ₹10,00,000.",
    },
  },

  /* ====================================================================
     06 — WEALTH PROTECTION
     ==================================================================== */
  {
    slug: "term-life-insurance",
    category: "wealth-protection",
    badge: "Life",
    name: "Life Insurance & Term Plans",
    summary:
      "High-coverage pure term plans that protect your family's financial future, compared across providers.",
    overview: [
      "A pure term plan is the cheapest way to buy a large death benefit. It has no maturity value, and that is precisely why the cover costs so little.",
      "We compare across providers on coverage-to-premium, claim settlement record and policy wording — the exclusions matter as much as the premium.",
    ],
    minInvestment: null,
    risk: "low",
    liquidity: "locked-in",
    goals: ["protect-wealth"],
    benefits: [
      "The largest possible cover for the smallest possible premium.",
      "Compared across providers rather than sold from one.",
      "Premiums are typically eligible for deduction under prevailing tax rules.",
      "Cover sized against your family's actual liabilities and income needs.",
    ],
    audience: [
      "Anyone whose family depends on their income",
      "Borrowers with a home loan or business debt",
      "Parents with dependent children",
      "Business owners whose family would inherit business liabilities",
    ],
    risks: [
      "A pure term plan has no maturity or surrender value. If you outlive the term, nothing is paid back — this is the intended design.",
      "Claims can be rejected for non-disclosure. Declare medical history, smoking and existing conditions completely and accurately.",
      "Most policies exclude death by suicide within the first year and may have other exclusions.",
      "Cover lapses if premiums are not paid.",
      "Premiums rise with age and health, so deferring the purchase costs money.",
    ],
    details: [
      { label: "Type", value: "Pure protection — no maturity value" },
      { label: "Comparison", value: "Across multiple providers" },
    ],
    disclaimerIds: ["insurance-irdai", "distributor-role"],
    seo: {
      title: "Term Life Insurance — compared across providers",
      description:
        "High-coverage pure term life plans compared across providers on premium, claim record and policy wording. Advised by Sarvam Associates, Mumbai.",
    },
  },
  {
    slug: "health-insurance",
    category: "wealth-protection",
    badge: "Health",
    name: "Health & Mediclaim",
    summary:
      "Comprehensive health cover for individuals and families, including super top-up and critical illness.",
    overview: [
      "Health cover is the protection that most often prevents a portfolio being liquidated at the worst possible moment. A single hospitalisation can undo years of careful investing.",
      "We structure a base policy with a super top-up above it, which is usually far cheaper than buying a single large policy for the same total cover.",
    ],
    minInvestment: null,
    risk: "low",
    liquidity: "locked-in",
    goals: ["protect-wealth"],
    benefits: [
      "Protects the portfolio from being sold to fund a medical emergency.",
      "Base plus super top-up typically costs less than one large policy.",
      "Critical illness riders provide a lump sum on diagnosis.",
      "Family floater and corporate group options available.",
    ],
    audience: [
      "Families without adequate employer cover",
      "Anyone relying solely on an employer policy that ends with the job",
      "Individuals with a family history of specific conditions",
      "Business owners covering themselves and their staff",
    ],
    risks: [
      "Pre-existing conditions carry waiting periods, commonly two to four years, during which related claims are not paid.",
      "Specific illnesses and treatments may have their own waiting periods.",
      "Room-rent limits, co-payment clauses and sub-limits can substantially reduce what is actually reimbursed.",
      "Claims can be rejected for non-disclosure of medical history.",
      "Premiums rise with age and after claims, and are not fixed for life.",
      "Super top-up policies pay only above a deductible, which you must fund yourself.",
    ],
    details: [
      { label: "Structure", value: "Base policy plus super top-up" },
      { label: "Options", value: "Individual, family floater, group" },
    ],
    disclaimerIds: ["insurance-irdai", "distributor-role"],
    seo: {
      title: "Health Insurance & Mediclaim — base and super top-up",
      description:
        "Comprehensive health cover structured as base plus super top-up, with critical illness riders. Advised by Sarvam Associates, Mumbai.",
    },
  },
  {
    slug: "family-protection-plans",
    category: "wealth-protection",
    badge: "Family",
    name: "Family Protection Plans",
    summary:
      "ULIPs, savings plans and child plans that combine insurance with long-term goals.",
    overview: [
      "These products bundle insurance with an investment component, aimed at a dated family goal such as education or marriage.",
      "We are deliberately careful here. For most families, a term plan plus a separate mutual fund achieves the same two objectives at lower cost and with far better flexibility. Bundled products make sense in specific situations — a defined goal, a need for enforced discipline, or a particular tax position — and we will tell you plainly when they do not apply to you.",
    ],
    minInvestment: null,
    risk: "moderate",
    liquidity: "locked-in",
    goals: ["protect-wealth", "grow-wealth"],
    benefits: [
      "Insurance and a dated savings goal addressed in one instrument.",
      "Enforced discipline through committed periodic premiums.",
      "Waiver-of-premium riders can keep a child's plan funded if the parent dies.",
      "May carry tax benefits under prevailing rules.",
    ],
    audience: [
      "Parents saving toward a specific, dated goal",
      "Families wanting the plan to continue if the earning parent dies",
      "Investors who value committed structure over flexibility",
    ],
    risks: [
      "ULIP returns are market-linked and not assured. The fund value can fall.",
      "Lock-in is typically five years, and surrendering early can return materially less than you paid in.",
      "Bundled products carry mortality, allocation, administration and fund management charges that reduce returns, and these are harder to compare than a mutual fund's expense ratio.",
      "The insurance cover in a bundled product is usually far lower than a pure term plan for the same outlay.",
      "Stopping premiums mid-term can lapse the policy and forfeit benefits.",
      "For most families a term plan plus a mutual fund is cheaper and more flexible than a bundled plan.",
    ],
    details: [
      { label: "Types", value: "ULIP, savings plans, child plans" },
      { label: "Typical lock-in", value: "5 years" },
    ],
    disclaimerIds: [
      "insurance-irdai",
      "mf-market-risk",
      "past-performance",
      "distributor-role",
    ],
    seo: {
      title: "Family Protection Plans — ULIPs, savings and child plans",
      description:
        "ULIPs, savings and child plans combining insurance with dated family goals — with an honest comparison against term plus mutual fund.",
    },
  },
  {
    slug: "business-asset-insurance",
    category: "wealth-protection",
    badge: "Business",
    name: "Business & Asset Insurance",
    summary:
      "Keyman insurance, shop and property cover, and vehicle policies for business owners and professionals.",
    overview: [
      "For a business owner, personal and business finances are rarely separable. A fire, a liability claim or the loss of a key person can reach straight through to personal wealth.",
      "We cover the business side — keyman, property, shop and vehicle — alongside the personal plan, because we already have visibility of both.",
    ],
    minInvestment: null,
    risk: "low",
    liquidity: "locked-in",
    goals: ["protect-wealth"],
    benefits: [
      "Keyman cover protects the business against the loss of a critical person.",
      "Property and shop cover protects the asset base that generates income.",
      "Premiums may be deductible as a business expense under prevailing rules.",
      "Coordinated with the personal plan by an advisor who sees both.",
    ],
    audience: [
      "Business owners with premises, stock or equipment",
      "Partnerships dependent on one or two key individuals",
      "Professionals with practice assets or liability exposure",
    ],
    risks: [
      "Policies contain specific exclusions — flood, earthquake, business interruption and others may require separate cover or endorsements.",
      "Under-insuring an asset can trigger an average clause, reducing the payout proportionally even on a partial loss.",
      "Keyman insurance proceeds and premium deductibility have specific tax treatment that should be confirmed before purchase.",
      "Claims require documentation and valuation; poor records materially delay or reduce settlement.",
    ],
    details: [
      { label: "Types", value: "Keyman, shop, property, vehicle" },
      { label: "For", value: "Business owners and professionals" },
    ],
    disclaimerIds: ["insurance-irdai", "distributor-role"],
    seo: {
      title: "Business & Asset Insurance — keyman, shop and property",
      description:
        "Keyman insurance, shop and property cover and vehicle policies for business owners, coordinated with the personal wealth plan.",
    },
  },

  /* ====================================================================
     07 — SMART LIQUIDITY (financial solutions)
     ==================================================================== */
  {
    slug: "loan-against-mutual-funds",
    category: "smart-liquidity",
    badge: "LAS — Mutual Funds",
    name: "Loan Against Mutual Funds",
    summary:
      "Pledge your mutual fund units for a line of credit. Interest is charged only on what you actually use.",
    overview: [
      "Selling investments to raise cash has two costs that are easy to overlook: you crystallise capital gains tax, and you step out of the market — often at exactly the wrong moment.",
      "A loan against mutual funds avoids both. You pledge your units as collateral and receive an overdraft-style limit against them. The units stay in your name, stay invested, and continue to participate in the market. You draw only what you need, and interest accrues only on the drawn amount.",
      "This is genuinely useful for short-term, defined needs — a business working-capital gap, a tax payment, a bridging requirement before a receivable lands. It is a poor substitute for a long-term loan, and it is not free money.",
    ],
    minInvestment: { amount: 100000, cadence: "one-time", label: "₹1 Lakh" },
    risk: "moderately-high",
    liquidity: "high",
    goals: ["access-liquidity"],
    benefits: [
      "Your investments stay invested and keep compounding.",
      "No capital gains event, because nothing is sold.",
      "Interest accrues only on the amount you actually draw, not the sanctioned limit.",
      "Typically faster than an unsecured loan, because the pledge is the security.",
      "Repay and redraw within the limit as your cash flow allows.",
    ],
    audience: [
      "Business owners bridging a short-term working-capital gap",
      "Investors facing a tax or one-off payment who would rather not sell",
      "Anyone with a receivable arriving on a known future date",
      "Investors with a substantial portfolio and a temporary liquidity need",
    ],
    risks: [
      "Your investments are pledged. If you default, the lender can sell them to recover the outstanding amount.",
      "A fall in the value of pledged units can trigger a margin call, requiring you to add collateral or repay part of the loan at short notice — and market falls and cash-flow pressure often arrive together.",
      "Interest accrues whether or not the underlying investment performs. If the portfolio returns less than the interest rate, you are worse off than if you had sold.",
      "Loan-to-value, interest rate, sanction and disbursement timelines are entirely at the lender's discretion and subject to approval.",
      "Pledged units cannot be redeemed, switched or transferred until the pledge is released.",
      "Borrowing against investments to invest further magnifies both gains and losses and is rarely appropriate.",
    ],
    details: [
      { label: "From", value: "₹1,00,000" },
      { label: "Collateral", value: "Mutual fund units, pledged and held in your name" },
      { label: "Interest", value: "Charged only on the amount drawn" },
      {
        label: "Indicative interest range",
        value: "8–12% p.a.",
        indicative: true,
      },
      { label: "Typical loan-to-value", value: "Up to 80% of eligible portfolio value" },
      { label: "Disbursement", value: "Subject to approval and pledge confirmation" },
    ],
    howItWorks: [
      {
        title: "Understand",
        description:
          "We look at what the money is actually for and how it will be repaid. If selling a holding is genuinely the better answer, we say so.",
      },
      {
        title: "Evaluate",
        description:
          "We assess which of your holdings are eligible for pledge, the likely loan-to-value, and the indicative rate.",
      },
      {
        title: "Apply",
        description:
          "Pledge request, lender documentation and sanction. Disbursement follows pledge confirmation and lender approval.",
      },
      {
        title: "Review",
        description:
          "We track the pledged value against the drawn amount so a margin call is anticipated rather than a surprise.",
      },
    ],
    disclaimerIds: [
      "las-collateral",
      "indicative-yield",
      "mf-market-risk",
      "distributor-role",
    ],
    faqs: [
      {
        question: "Do I stay invested while the loan is outstanding?",
        answer:
          "Yes. The units remain in your name and continue to participate in the market. They are pledged, which means you cannot redeem, switch or transfer them until the pledge is released, but the investment itself continues.",
      },
      {
        question: "What is a margin call, and what happens if I get one?",
        answer:
          "If the value of your pledged units falls far enough relative to what you have drawn, the lender can require you to pledge more units or repay part of the loan, usually at short notice. If you cannot, the lender may sell the pledged units to recover its dues. This is the main risk of the product and it tends to arise precisely when markets are falling.",
      },
      {
        question: "How quickly is the money disbursed?",
        answer:
          "It is generally faster than an unsecured loan because the pledge provides the security. We do not promise a timeline: sanction and disbursement are at the lender's discretion and follow approval and pledge confirmation.",
      },
      {
        question: "Is this cheaper than just selling my investments?",
        answer:
          "Sometimes. You avoid capital gains tax and stay invested, but you pay interest. If your portfolio returns less than the interest rate over the period, selling would have been cheaper. For a short, defined need it usually works out well; as a long-term borrowing it usually does not.",
      },
    ],
    seo: {
      title: "Loan Against Mutual Funds — liquidity without selling",
      description:
        "Pledge mutual fund units for an overdraft-style credit line from ₹1,00,000. Stay invested, avoid a capital gains event, pay interest only on what you draw.",
    },
  },
  {
    slug: "loan-against-shares",
    category: "smart-liquidity",
    badge: "LAS — Equity",
    name: "Loan Against Shares",
    summary:
      "Secured credit against your equity portfolio. Keep ownership, keep dividends, get liquidity.",
    overview: [
      "The mechanism matches a loan against mutual funds, with shares as the collateral instead of fund units. You keep ownership, you keep voting rights, and dividends continue to reach you.",
      "Because individual shares are more volatile than a diversified fund, lenders apply a lower loan-to-value and margin calls arrive sooner. Concentrated single-stock holdings are treated most conservatively of all.",
    ],
    minInvestment: { amount: 500000, cadence: "one-time", label: "₹5 Lakh" },
    risk: "high",
    liquidity: "high",
    goals: ["access-liquidity"],
    benefits: [
      "Retain ownership, voting rights and dividend income.",
      "No capital gains event, because nothing is sold.",
      "Interest charged only on the drawn amount.",
      "Useful where a holding is deliberately being held long term.",
    ],
    audience: [
      "Investors with a substantial listed equity portfolio",
      "Promoters and long-term holders unwilling to sell a position",
      "Business owners with a short-term liquidity requirement",
    ],
    risks: [
      "Shares are more volatile than diversified funds, so margin calls are triggered more readily and loan-to-value ratios are lower.",
      "A concentrated single-stock position is treated conservatively and can be sharply repriced by the lender.",
      "On default, the lender can sell your pledged shares, potentially at a market low.",
      "Lenders maintain an approved-securities list; not every share is eligible, and a security can be removed from the list.",
      "Interest accrues regardless of how the shares perform.",
      "Sanction, rate and disbursement are at the lender's discretion and subject to approval.",
    ],
    details: [
      { label: "From", value: "₹5,00,000" },
      { label: "Collateral", value: "Listed shares from the lender's approved list" },
      { label: "Retained", value: "Ownership, voting rights and dividends" },
      {
        label: "Indicative interest range",
        value: "8–12% p.a.",
        indicative: true,
      },
      { label: "Disbursement", value: "Subject to approval and pledge confirmation" },
    ],
    disclaimerIds: [
      "las-collateral",
      "indicative-yield",
      "securities-market-risk",
      "distributor-role",
    ],
    seo: {
      title: "Loan Against Shares — liquidity from your equity portfolio",
      description:
        "Secured credit against listed shares from ₹5,00,000. Keep ownership, voting rights and dividends. Subject to margin calls and lender approval.",
    },
  },
  {
    slug: "loan-against-pms-bonds",
    category: "smart-liquidity",
    badge: "LAS — Bonds/PMS",
    name: "Loan Against PMS & Bonds",
    summary:
      "For investors with significant PMS or bond holdings — working capital without exiting a premium strategy.",
    overview: [
      "Exiting a PMS mandate or a held-to-maturity bond position to raise cash is expensive. You may crystallise gains, break a strategy mid-cycle, or sell a bond into a thin secondary market at a discount.",
      "Borrowing against those holdings avoids all three. Because the collateral is more complex to value and less liquid than a mutual fund unit, the minimum is higher and assessment takes longer.",
    ],
    minInvestment: { amount: 5000000, cadence: "one-time", label: "₹50 Lakh" },
    risk: "high",
    liquidity: "moderate",
    goals: ["access-liquidity"],
    benefits: [
      "A PMS strategy continues uninterrupted through its cycle.",
      "Avoids selling bonds into a thin secondary market at a discount.",
      "No capital gains event.",
      "Sized for substantial working-capital requirements.",
    ],
    audience: [
      "Investors with PMS mandates or significant bond portfolios",
      "HNIs with a large, time-bound working-capital need",
      "Business owners with substantial holdings they intend to keep",
    ],
    risks: [
      "PMS and bond collateral is less liquid and harder to value, so lenders apply lower loan-to-value ratios and take longer to assess.",
      "A fall in the value of pledged holdings can trigger a margin call.",
      "On default, the lender can liquidate the pledged PMS holdings or bonds, potentially at unfavourable prices given thin markets.",
      "Not every PMS strategy or bond is acceptable as collateral, and eligibility is entirely at the lender's discretion.",
      "Interest accrues regardless of how the underlying holdings perform.",
      "Sanction, rate and disbursement are at the lender's discretion and subject to approval.",
    ],
    details: [
      { label: "From", value: "₹50,00,000" },
      { label: "Collateral", value: "PMS holdings and bonds, subject to eligibility" },
      {
        label: "Indicative interest range",
        value: "8–12% p.a.",
        indicative: true,
      },
      { label: "Assessment", value: "Longer than for mutual fund collateral" },
      { label: "Disbursement", value: "Subject to approval and pledge confirmation" },
    ],
    disclaimerIds: [
      "las-collateral",
      "indicative-yield",
      "securities-market-risk",
      "pms-eligibility",
      "distributor-role",
    ],
    seo: {
      title: "Loan Against PMS & Bonds — from ₹50 lakh",
      description:
        "Working capital against PMS mandates and bond holdings from ₹50,00,000, without exiting the strategy. Subject to margin calls and lender approval.",
    },
  },
];
