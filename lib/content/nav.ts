import { CATEGORIES } from "./categories";
import { SERVICES, serviceHref } from "./services";

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
    href: "/services",
    links: SERVICES.map((s) => ({
      label: s.name,
      href: serviceHref(s.slug),
      description: s.description,
    })),
    footer: { label: "All CA services", href: "/services" },
  },
];

/*
   Four items is the ceiling, not a preference.

   The desktop nav appears at 1280px and sits beside three dropdown groups and
   the consultation CTA. Adding "Financial plan" as a fifth pushed that CTA 42px
   past the right edge at exactly 1280 — measured, not guessed. FAQ gave up its
   slot for it: it is the deepest-funnel of the four and still sits in the
   footer, on the contact page and in search results.

   Before adding a fifth, re-measure at 1280.
*/
export const NAV_LINKS: NavLink[] = [
  { label: "Financial plan", href: "/financial-plan" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
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
    links: [
      ...SERVICES.map((s) => ({ label: s.name, href: serviceHref(s.slug) })),
      { label: "All services", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Sarvam", href: "/about" },
      { label: "Build a financial plan", href: "/financial-plan" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Calculators", href: "/calculators" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  // No "Legal" column: those three links already sit in the footer's bottom
  // bar, and a sixth column orphans onto its own row in the five-column grid.
];
