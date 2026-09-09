/* ==========================================================================
   Regulatory disclaimer registry.

   Every regulatory string on this site lives here exactly once. Components
   reference them by key, so a typo is a TypeScript error rather than a
   silently-missing legal notice, and a wording change is a one-line edit that
   propagates everywhere.

   DO NOT paraphrase, condense or grammar-fix these strings. Several are
   standard mandated phrasings reproduced verbatim from the source material.
   ========================================================================== */

export interface Disclaimer {
  id: string;
  label: string;
  body: string;
  /** "regulatory" entries also render site-wide in the footer. */
  severity: "standard" | "regulatory";
}

export const DISCLAIMERS = {
  "mf-market-risk": {
    id: "mf-market-risk",
    label: "Mutual fund market risk",
    severity: "regulatory",
    body: "Mutual Fund investments are subject to market risks. Read all scheme related documents carefully before investing.",
  },

  "securities-market-risk": {
    id: "securities-market-risk",
    label: "Securities market risk",
    severity: "regulatory",
    // Verbatim from the source. "market are subject" is the standard mandated
    // phrasing — it reads as a grammatical error but must NOT be corrected.
    body: "Investment in securities market are subject to market risks. Read all related documents carefully before investing.",
  },

  "past-performance": {
    id: "past-performance",
    label: "Past performance",
    severity: "regulatory",
    body: "Past performance is not indicative of future returns.",
  },

  "distributor-role": {
    id: "distributor-role",
    label: "Our role",
    severity: "regulatory",
    body: "Sarvam Associates is a distribution partner, not the manufacturer of these products.",
  },

  "nuvama-facilitation": {
    id: "nuvama-facilitation",
    label: "Nuvama products",
    severity: "regulatory",
    body: "Investment in Nuvama products is facilitated by Sarvam Associates as an authorised distribution partner. Products are offered by Nuvama Wealth Management Ltd. All investments are subject to market risks. Please read all scheme related documents carefully.",
  },

  "platform-facilitation": {
    id: "platform-facilitation",
    label: "How investments are facilitated",
    severity: "regulatory",
    body: "Investments are facilitated by Sarvam Associates through SEBI-registered platforms and partners. All investments are subject to market risks. Please read all scheme-related documents carefully before investing.",
  },

  "indicative-yield": {
    id: "indicative-yield",
    label: "Indicative yields",
    severity: "regulatory",
    body: "Indicative yields. Not a guarantee. Subject to market and credit risk. Consult your advisor.",
  },

  /* --- Product-class specific ------------------------------------------ */

  "pms-eligibility": {
    id: "pms-eligibility",
    label: "PMS eligibility",
    severity: "regulatory",
    body: "Portfolio Management Services carry a regulatory minimum investment of ₹50,00,000. PMS strategies are subject to market risk and returns are not assured. Please read the Disclosure Document and Client Agreement carefully before investing.",
  },

  "aif-eligibility": {
    id: "aif-eligibility",
    label: "AIF eligibility",
    severity: "regulatory",
    body: "Alternative Investment Funds carry a regulatory minimum commitment of ₹1,00,00,000 and are available only to eligible investors. AIFs are illiquid, long-horizon products and are not suitable for every investor. Please read the Private Placement Memorandum carefully before investing.",
  },

  "mld-capital-protection": {
    id: "mld-capital-protection",
    label: "Capital protection on MLDs",
    severity: "regulatory",
    // Scopes the "100% base capital protection" claim. Protection applies only
    // to select structures and remains dependent on issuer credit — it is not a
    // guarantee and must never be presented as one.
    body: "Base capital protection is a feature of select market-linked debenture structures only. It is subject to the issuer meeting its obligations and is not a guarantee. Returns on market-linked debentures are linked to an underlying reference and are not assured.",
  },

  "las-collateral": {
    id: "las-collateral",
    label: "Loan against securities",
    severity: "regulatory",
    body: "Loans against securities are secured against pledged investments. A fall in the value of pledged securities may trigger a margin call requiring additional collateral or partial repayment, and pledged securities may be liquidated to recover dues. Sanction, loan-to-value, interest rate and disbursement timelines are at the lender's discretion and subject to approval.",
  },

  "insurance-irdai": {
    id: "insurance-irdai",
    label: "Insurance products",
    severity: "regulatory",
    body: "Insurance is the subject matter of solicitation. Please read the sales brochure and policy wording carefully for details on benefits, exclusions, limitations, terms and conditions before concluding a sale.",
  },

  "illustration-only": {
    id: "illustration-only",
    label: "Illustration only",
    severity: "standard",
    body: "This calculator is an illustration only. It assumes a constant rate of return, which real investments do not deliver. Actual returns will vary and may be negative. It is not a projection, a promise, or investment advice.",
  },

  "not-investment-advice": {
    id: "not-investment-advice",
    label: "Not investment advice",
    severity: "standard",
    body: "The content on this website is for general information only and does not constitute investment advice or a recommendation to buy or sell any product. Product suitability depends on your individual circumstances. Please speak with an advisor before investing.",
  },
} as const satisfies Record<string, Disclaimer>;

/** Narrow union of valid keys — mistyping one fails the build. */
export type DisclaimerId = keyof typeof DISCLAIMERS;

export const getDisclaimer = (id: DisclaimerId): Disclaimer => DISCLAIMERS[id];

export const getDisclaimers = (ids: readonly DisclaimerId[]): Disclaimer[] =>
  ids.map((id) => DISCLAIMERS[id]);

/** The subset rendered site-wide in the footer. */
export const FOOTER_DISCLAIMER_IDS = [
  "mf-market-risk",
  "securities-market-risk",
  "distributor-role",
  "past-performance",
] as const satisfies readonly DisclaimerId[];
