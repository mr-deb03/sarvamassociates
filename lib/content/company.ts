/* ==========================================================================
   Company facts — the single source for NAP (name / address / phone).

   The footer, the contact page and the JSON-LD LocalBusiness node all read
   from here, so the three can never disagree. NAP consistency is the single
   highest-leverage local-SEO factor for a Bhandup practice competing on
   "CA near me", and three hand-typed copies of an address always drift.
   ========================================================================== */

export const COMPANY = {
  name: "Sarvam Associates",
  /** Sub-brand used for the wealth arm in the source material. */
  wealthBrand: "Sarvam Wealth",
  legalName: "Sarvam Associates",

  tagline: "Tax, compliance and wealth — under one roof.",
  foundedYearsAgo: 15,

  email: "info@sarvamassociates.com",

  /**
   * NOT PRESENT IN ANY SOURCE FILE.
   *
   * All three source documents give only the email address. Brief §25 requires
   * a phone number in the consultation section, and JSON-LD LocalBusiness wants
   * `telephone`. Until this is supplied, contact surfaces render email-only and
   * the schema node omits `telephone` rather than inventing one.
   */
  phone: null as string | null,

  address: {
    line1: "1/2, Om Shiv Premises",
    line2: "J.M. Road",
    locality: "Bhandup (West)",
    city: "Mumbai",
    region: "Maharashtra",
    postalCode: "400078",
    country: "IN",
  },

  /** Formatted once, reused everywhere. */
  get addressLines(): string[] {
    const a = this.address;
    return [
      `${a.line1}, ${a.line2}`,
      `${a.locality}, ${a.city} — ${a.postalCode}`,
    ];
  },

  socials: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/SarvamAssociates/",
      icon: "Facebook",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/Sarvam.Associates/",
      icon: "Instagram",
    },
    {
      name: "LinkedIn",
      // Handle reproduced verbatim from the source. NOTE the transposition in
      // the client's own slug: "assoicates", not "associates". This is the live
      // URL so it must not be "corrected" here, but it is worth them fixing on
      // LinkedIn — a wrong sameAs breaks search-entity reconciliation.
      href: "https://www.linkedin.com/company/sarvam-assoicates/",
      icon: "Linkedin",
    },
  ],

  /** The existing practice site the CA services link out to. */
  legacySite: "https://sarvamassociates.com",
} as const;

/* ==========================================================================
   Regulatory identity

   The user confirmed Sarvam operates as an AMFI-registered mutual fund
   DISTRIBUTOR. All "SEBI Registered Investment Advisor" wording that appeared
   in the source mockups has been removed site-wide: an entity cannot generally
   be both a fee-charging RIA and a commission-earning distributor, and no RIA
   registration number exists in any source document.
   ========================================================================== */

export const REGISTRATIONS = {
  /**
   * REQUIRED BEFORE LAUNCH — currently a placeholder.
   *
   * AMFI requires the ARN to appear on distributor marketing material. It is
   * absent from all three source files. `hasArn` below is false while this
   * remains a placeholder, and every surface that would print it renders
   * nothing rather than printing "ARN-XXXXXX" to the public.
   */
  arn: "ARN-XXXXXX",

  /** Guards public rendering of the ARN until a real value is supplied. */
  get hasArn(): boolean {
    return !this.arn.includes("XXXXXX");
  },

  /** How Sarvam describes its own role. Used in the footer and product pages. */
  roleStatement:
    "Sarvam Associates is an AMFI-registered mutual fund distributor and an authorised distribution partner of Nuvama Wealth Management Ltd.",
} as const;

/* ==========================================================================
   Institutional partner

   Retained per the user's decision, overriding the August 2026 revision
   document (which removed every Nuvama reference in five places).

   The distinction below is the compliance-critical part: Nuvama MANUFACTURES
   and issues the products; Sarvam DISTRIBUTES them. The site must never blur
   the two, and figures belonging to Nuvama's platform are labelled as such
   wherever they appear.
   ========================================================================== */

export const PARTNER = {
  name: "Nuvama Wealth",
  legalName: "Nuvama Wealth Management Ltd",
  role: "Product manufacturer and platform",
  sarvamRole: "Authorised distribution partner",
  description:
    "One of India's leading wealth management platforms, trusted by HNIs and institutions.",
} as const;

export type Company = typeof COMPANY;
