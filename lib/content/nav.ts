import { CATEGORIES } from "./categories";
import { SERVICES } from "./homepage";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  /** Landing page for the group. The group label itself links here. */
  href: string;
  links: NavLink[];
  /** Shown at the foot of the dropdown panel. */
  footer?: { label: string; href: string };
}

const investmentCategories = CATEGORIES.filter(
  (c) => c.domain === "investment",
);
const liquidityCategories = CATEGORIES.filter(
  (c) => c.domain === "financial-solution",
);

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Investments",
    href: "/investments",
    links: investmentCategories.map((c) => ({
      label: c.name,
      href: `/investments/${c.slug}`,
      description: c.tagline,
    })),
    footer: { label: "Compare all solutions", href: "/investments" },
  },
  {
    label: "Financial Solutions",
    href: "/financial-solutions",
    links: liquidityCategories.flatMap(() => [
      {
        label: "Loan Against Mutual Funds",
        href: "/products/loan-against-mutual-funds",
        description: "Liquidity without selling your units",
      },
      {
        label: "Loan Against Shares",
        href: "/products/loan-against-shares",
        description: "Keep ownership, dividends and voting rights",
      },
      {
        label: "Loan Against PMS & Bonds",
        href: "/products/loan-against-pms-bonds",
        description: "Working capital without exiting a strategy",
      },
    ]),
    footer: { label: "How lending against a portfolio works", href: "/financial-solutions" },
  },
  {
    label: "Services",
    href: "/#services",
    links: SERVICES.map((s) => ({
      label: s.name,
      href: s.href,
      description: s.description,
      external: s.external,
    })),
  },
];

export const NAV_LINKS: NavLink[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Investments",
    links: investmentCategories.map((c) => ({
      label: c.shortName,
      href: `/investments/${c.slug}`,
    })),
  },
  {
    title: "Financial Solutions",
    links: [
      { label: "Loan Against Mutual Funds", href: "/products/loan-against-mutual-funds" },
      { label: "Loan Against Shares", href: "/products/loan-against-shares" },
      { label: "Loan Against PMS & Bonds", href: "/products/loan-against-pms-bonds" },
      { label: "How it works", href: "/financial-solutions" },
    ],
  },
  {
    title: "CA Services",
    links: SERVICES.map((s) => ({
      label: s.name,
      href: s.href,
      external: s.external,
    })),
  },
  {
    title: "Company",
    links: [
      { label: "About Sarvam", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Calculators", href: "/calculators" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  // No "Legal" column: those three links already sit in the footer's bottom
  // bar, and a sixth column orphans onto its own row in the five-column grid.
];
