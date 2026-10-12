import type { NextConfig } from "next";

/*
   Addresses from the WordPress site this one replaces, taken from its Yoast
   sitemap and navigation on the day of the switch. Search results, bookmarks
   and links on other sites still point at them, so each is sent to the page
   that now covers the same subject rather than left to 404.

   First match wins: the named service pages must stay above the catch-all for
   their section. Where the new site has no equivalent — the registration and
   accounting services, the theme's demo shop and case studies — the visitor
   lands on the nearest listing instead.
*/
const LEGACY_REDIRECTS: ReadonlyArray<readonly [source: string, destination: string]> = [
  /* ------------------------------------------------------------- pages */
  ["/home", "/"],
  ["/home-1", "/"],
  ["/home-3", "/"],
  ["/home-4", "/"],
  ["/sample-page", "/"],
  ["/blogs", "/"],
  ["/testimonials", "/"],
  ["/kala-my-creation-winners", "/"],
  ["/contact-us", "/contact"],
  ["/career", "/contact"],
  ["/how-it-work", "/how-it-works"],
  ["/company-profile-2", "/about"],
  ["/our-team", "/about"],
  ["/our-team-2", "/about"],
  ["/services-with-image", "/services"],
  ["/insights-and-advisory", "/services"],

  /* ---------------------------------------------------------- services */
  ["/service/direct-tax-consulting", "/services/direct-tax-consulting"],
  ["/service/business-corporate-return-filling", "/services/direct-tax-consulting"],
  ["/service/tds-return-filling", "/services/direct-tax-consulting"],
  ["/service/epf-returns", "/services/direct-tax-consulting"],
  ["/service/indirect-taxation", "/services/gst-indirect-taxation"],
  ["/service/audit-assurance", "/services/audit-assurance"],
  ["/service/internal-audit", "/services/audit-assurance"],
  ["/service/statutory-audit", "/services/audit-assurance"],
  ["/service/management-audit", "/services/audit-assurance"],
  ["/service/due-diligence-audit", "/services/audit-assurance"],
  ["/service/tax-audit", "/services/audit-assurance"],
  ["/service/insurance-solutions", "/services/insurance-solutions"],
  ["/service/insurance-advising-2", "/services/insurance-solutions"],
  ["/service/general-motor-fire-marine", "/services/insurance-solutions"],
  ["/service/term-insurance", "/products/term-life-insurance"],
  ["/service/mediclaim-or-health-insurance", "/products/health-insurance"],
  ["/service/financial-planning-2", "/financial-plan"],
  ["/service/mutual-funds", "/products/diversified-mutual-funds"],
  ["/service/wealth-management", "/investments/wealth-creation"],
  ["/service/portfolio-management-and-review", "/investments/pms"],
  ["/service/investment-advisory", "/investments"],
  ["/service/investment-consulting", "/investments"],
  ["/service/financial-advisory", "/investments"],
  ["/service/business-loan", "/financial-solutions"],
  ["/service/home-loan", "/financial-solutions"],
  ["/service/loan-against-property", "/financial-solutions"],
  ["/service/financing-consultation", "/financial-solutions"],
  ["/service/financing-consultation-2", "/financial-solutions"],
  ["/service/financing-consultation-3", "/financial-solutions"],
  ["/service/:slug*", "/services"],

  ["/service_cat/direct-tax-consulting", "/services/direct-tax-consulting"],
  ["/service_cat/indirect-taxation", "/services/gst-indirect-taxation"],
  ["/service_cat/audit-and-assurance", "/services/audit-assurance"],
  ["/service_cat/insurance-advising", "/services/insurance-solutions"],
  ["/service_cat/investment-consulting", "/investments"],
  ["/service_cat/financing-consultation", "/financial-solutions"],
  ["/service_cat/:slug*", "/services"],

  /* ------------------------------------ theme demo content, never real */
  ["/cases-studies-2-columns", "/"],
  ["/cases-studies-3-columns", "/"],
  ["/cases-studies-style-2", "/"],
  ["/portfolio/:slug*", "/"],
  ["/Categories/:slug*", "/"],
  ["/shop", "/"],
  ["/cart", "/"],
  ["/checkout", "/"],
  ["/my-account/:path*", "/"],
  ["/product/:slug*", "/"],
  ["/product-category/:slug*", "/"],
  ["/product-tag/:slug*", "/"],

  /* Search engines keep fetching the old sitemap address until told otherwise. */
  ["/sitemap_index.xml", "/sitemap.xml"],
];

const nextConfig: NextConfig = {
  /*
     `pg` resolves optional native bindings and dialect modules at runtime, so
     bundling it produces require() calls the bundler cannot follow. Keeping it
     external hands it to Node untouched, which is what it expects.
  */
  serverExternalPackages: ["pg"],

  redirects: () =>
    LEGACY_REDIRECTS.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    })),
};

export default nextConfig;
