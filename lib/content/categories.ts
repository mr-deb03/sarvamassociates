import type { Category } from "./types";

/* ==========================================================================
   The seven solution categories, in the order the source catalogue presents
   them. Six sit under /investments; "smart-liquidity" is lending rather than
   investing, so it lives under /financial-solutions (brief §21).
   ========================================================================== */

export const CATEGORIES: Category[] = [
  {
    slug: "goal-based-investing",
    domain: "investment",
    index: 1,
    name: "Goal-Based Investing",
    shortName: "Goal-Based",
    tagline: "Every goal deserves its own plan.",
    description:
      "Personalised investment strategies aligned with your future financial goals. Whether it's your child's education, a dream home, or a secure retirement — each goal gets its own timeline, its own risk level, and its own plan.",
    icon: "Target",
    goals: ["grow-wealth", "plan-retirement"],
    seo: {
      title: "Goal-Based Investing — SIPs, Mutual Funds & Retirement Planning",
      description:
        "Build a plan around your actual goals. SIPs from ₹500/month, curated mutual funds and retirement planning, guided by Sarvam Associates in Mumbai.",
    },
  },
  {
    slug: "wealth-creation",
    domain: "investment",
    index: 2,
    name: "Wealth Creation Portfolios",
    shortName: "Wealth Creation",
    tagline: "Built for the long horizon.",
    description:
      "Diversified, growth-oriented portfolios designed for long-term wealth generation — for investors building a meaningful corpus over five to ten years and beyond.",
    icon: "TrendingUp",
    goals: ["grow-wealth"],
    seo: {
      title: "Wealth Creation Portfolios — Equity & Multi-Asset Investing",
      description:
        "Diversified equity and multi-asset portfolios for long-term wealth creation, reviewed quarterly by Sarvam Associates.",
    },
  },
  {
    slug: "pms",
    domain: "investment",
    index: 3,
    name: "Portfolio Management Services",
    shortName: "PMS",
    tagline: "Your portfolio, individually held.",
    description:
      "Professionally managed, high-conviction strategies for sophisticated investors. Unlike a mutual fund, the stocks are held directly in your own demat account. Regulatory minimum ₹50,00,000.",
    icon: "Gem",
    goals: ["grow-wealth"],
    seo: {
      title: "Portfolio Management Services (PMS) — Minimum ₹50 Lakh",
      description:
        "Professionally managed PMS strategies with direct stock ownership in your own demat account. Regulatory minimum ₹50,00,000. Guided by Sarvam Associates.",
    },
  },
  {
    slug: "aif",
    domain: "investment",
    index: 4,
    name: "Alternative Investment Funds",
    shortName: "AIF",
    tagline: "Beyond the public markets.",
    description:
      "Access to private, structured and institutional strategies outside traditional markets. For eligible investors seeking diversification. Illiquid and long-horizon by design — regulatory minimum ₹1,00,00,000.",
    icon: "Landmark",
    goals: ["grow-wealth"],
    seo: {
      title: "Alternative Investment Funds (AIF) — Category I, II & III",
      description:
        "SEBI-regulated Category I, II and III AIFs for eligible investors. Private equity, structured credit and long-short strategies. Minimum ₹1,00,00,000.",
    },
  },
  {
    slug: "stable-income",
    domain: "investment",
    index: 5,
    name: "Stable Income Solutions",
    shortName: "Stable Income",
    tagline: "Income, with the risk you choose.",
    description:
      "Income-oriented strategies focused on stability and capital preservation — debt funds, bonds and market-linked debentures, with the tax efficiency and liquidity a fixed deposit cannot offer.",
    icon: "ShieldCheck",
    goals: ["generate-income", "reduce-tax"],
    seo: {
      title: "Stable Income — Debt Funds, Bonds & Market-Linked Debentures",
      description:
        "Debt mutual funds, corporate and G-Sec bonds, and structured fixed income. Income-oriented strategies with clearly stated risk. Sarvam Associates, Mumbai.",
    },
  },
  {
    slug: "wealth-protection",
    domain: "investment",
    index: 6,
    name: "Wealth Protection Planning",
    shortName: "Protection",
    tagline: "Growth means nothing unprotected.",
    description:
      "Protection strategies that secure your family and the wealth you have already built. One health emergency can undo years of compounding — protection belongs inside the plan, not beside it.",
    icon: "HeartPulse",
    goals: ["protect-wealth"],
    seo: {
      title: "Wealth Protection — Term, Health & Family Insurance Planning",
      description:
        "Term life, health, family and business protection planning integrated with your wealth plan. Advised by Sarvam Associates, Mumbai.",
    },
  },
  {
    slug: "smart-liquidity",
    domain: "financial-solution",
    index: 7,
    name: "Smart Liquidity Solutions",
    shortName: "Liquidity",
    tagline: "Need cash? Don't sell your investments.",
    description:
      "Borrow against the portfolio you already own. A loan against securities releases liquidity while your investments stay invested — used by HNIs to manage cash flow without breaking a long-term plan.",
    icon: "Zap",
    goals: ["access-liquidity"],
    seo: {
      title: "Loan Against Securities — Mutual Funds, Shares, PMS & Bonds",
      description:
        "Unlock liquidity from your portfolio without selling. Loans against mutual funds, shares, PMS and bonds, arranged through Sarvam Associates, Mumbai.",
    },
  },
];

export const getCategory = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => c.slug === slug);

export const INVESTMENT_CATEGORIES = CATEGORIES.filter(
  (c) => c.domain === "investment",
);

export const FINANCIAL_SOLUTION_CATEGORIES = CATEGORIES.filter(
  (c) => c.domain === "financial-solution",
);
