import type { DisclaimerId } from "./disclaimers";

/* ==========================================================================
   CA services.

   Content is Sarvam's own, taken from the service pages on
   sarvamassociates.com (including the five audit sub-pages) and rewritten for
   hierarchy and readability. Nothing here is invented.

   Two deliberate omissions, both on the GST page:

   1. The source states registration thresholds of ₹20 lakh / ₹10 lakh and
      describes GSTR-1, 2 and 3 as the three monthly returns. Both are now out
      of date — GSTR-2 and GSTR-3 were suspended, and the goods threshold rose
      in most states. Republishing stale statutory figures as current would be
      worse than omitting them, so registration triggers are described
      qualitatively and the page says plainly that current limits are confirmed
      per client.
   2. The direct-tax page publishes turnaround commitments that contradict each
      other between packages (queries answered "within a week" in one tier and
      "within 24 hrs" in another). Neither is reproduced; turnaround is agreed
      per engagement instead.

   Both are flagged in the README.
   ========================================================================== */

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceBlock {
  heading: string;
  body?: string[];
  bullets?: string[];
  steps?: ServiceStep[];
  /** Rendered as a set-apart note rather than body copy. */
  note?: string;
}

export interface Service {
  slug: string;
  name: string;
  /** Compact label for nav, footer and breadcrumbs. */
  shortName: string;
  /** One line, used on cards and in the nav dropdown. */
  description: string;
  icon: string;
  eyebrow: string;
  lede: string;
  intro: string[];
  blocks: ServiceBlock[];
  whoItsFor: string[];
  disclaimerIds: readonly DisclaimerId[];
  seo: { title: string; description: string };
}

export const SERVICES: Service[] = [
  /* ---------------------------------------------------------------- tax */
  {
    slug: "direct-tax-consulting",
    name: "Direct Tax Consulting",
    shortName: "Direct Tax",
    description:
      "Income tax planning, return filing, assessments and representation for individuals and businesses.",
    icon: "Receipt",
    eyebrow: "CA Services",
    lede: "Direct tax planning is a year-on-year process, not a March scramble — using the exemptions and deductions actually available to you, and keeping the deduction and filing machinery running on time.",
    intro: [
      "Direct tax consulting enables individuals and businesses to use available exemptions and deductions to reduce tax liability, and to plan legal investments in tax-saving instruments. It works best as a continuous process rather than a year-end exercise.",
      "Sarvam Associates provides tax planning consultation covering capital gains, income computation, tax liability and related advisory — for individuals and for corporates.",
    ],
    blocks: [
      {
        heading: "Planning and advisory",
        bullets: [
          "Income tax planning for individuals and corporates",
          "Review of taxation responsibilities",
          "Advance tax computation",
          "Taxation of financial instruments — equity shares, bonds and mutual funds",
          "Advisory support with updates on amendments, circulars, notifications and judgments",
        ],
      },
      {
        heading: "TDS — deduction, deposit and returns",
        body: [
          "TDS is tax deducted at source: tax is withheld from specified payments and deposited with the government periodically. Deducting requires a TAN, and entities holding a TAN must file quarterly TDS returns.",
          "If your organisation has received a notice from the TDS department, we handle that too — including for clients with substantial demands raised against them.",
        ],
        bullets: [
          "Verifying vendor payments for correct tax deduction",
          "Computing monthly TDS and reconciling TDS due against TDS deducted",
          "Preparing and depositing monthly challans within statutory timelines",
          "Filing quarterly e-TDS returns",
          "Annual income tax and professional tax returns",
        ],
        steps: [
          {
            title: "Document collection",
            description:
              "We collect the information and documents needed to prepare the return for your business.",
          },
          {
            title: "Return preparation",
            description:
              "We compute your TDS payments and prepare the return for your review and approval.",
          },
          {
            title: "Return filing",
            description:
              "Once you have verified and approved it, we file the return with the Income Tax department.",
          },
        ],
      },
      {
        heading: "Income tax return filing",
        body: [
          "Send us the documents and our team takes care of the rest. Your draft return comes back to you with a checklist; nothing is filed until you confirm it over email.",
        ],
        bullets: [
          "Salary income, including multiple Form 16s from different employers",
          "Income from house property",
          "Capital gains from property and shares",
          "Income from business or partnership firms",
          "Income from other sources — dividend, bank interest and similar",
          "Pension and agricultural income",
          "Clubbing of income — spouse, minor child and similar cases",
          "Verification of return data against the Form 26AS record, so mismatches do not become notices",
        ],
      },
      {
        heading: "EPF returns",
        body: [
          "Every employer with 20 or more employees must register with the Employees Provident Fund Corporation, and registered entities must then file EPF returns. Returns are due half-yearly.",
          "We compute EPF payments, prepare and file the return, and keep the business compliant with EPF regulation.",
        ],
      },
      {
        heading: "NRI and foreign income",
        body: [
          "For NRIs, residents with foreign income and foreign citizens, the first question is usually residential status — and everything else follows from it.",
        ],
        bullets: [
          "Determination of your residential status in India",
          "Compliance with the Income-tax Act, 1961",
          "Application for a Permanent Account Number (PAN)",
          "Filing of the India tax return",
          "Advising on suitable tax-saving investments",
        ],
      },
    ],
    whoItsFor: [
      "Salaried individuals, including those with more than one Form 16",
      "Business owners and partnership firms",
      "Organisations with TDS obligations, or facing a TDS notice",
      "Employers with 20 or more employees",
      "NRIs, foreign citizens and residents with income outside India",
    ],
    disclaimerIds: ["not-investment-advice"],
    seo: {
      title: "Direct Tax Consulting — Income Tax, TDS & EPF | Sarvam Associates",
      description:
        "Income tax planning and return filing, TDS computation and quarterly returns, EPF returns and NRI taxation, from a Mumbai practice of 15+ years.",
    },
  },

  /* ---------------------------------------------------------------- gst */
  {
    slug: "gst-indirect-taxation",
    name: "GST & Indirect Taxation",
    shortName: "GST",
    description:
      "Registration, monthly and annual returns, reconciliation and advisory on indirect tax.",
    icon: "FileSpreadsheet",
    eyebrow: "CA Services",
    lede: "One tax at the end of the supply chain instead of a stack of them along the way — provided the registration, invoicing and returns behind it are all in order.",
    intro: [
      "Goods and Services Tax, put simply, means that instead of paying tax at every level in the form of VAT, excise duty, sales tax, customs, luxury tax and service tax, a single tax is paid at the end of the supply chain.",
      "Multiple input taxes used to be paid at every stage of build-up, each one an interaction with the tax authorities. GST replaces that with value added at each stage and a final tax paid by the customer to the last dealer in the chain.",
    ],
    blocks: [
      {
        heading: "Registration",
        body: [
          "To supply goods and products in India, GST registration is mandatory. Registration also unlocks input credit through the chain, which is where most of the benefit sits.",
        ],
        steps: [
          {
            title: "Arrange the documents",
            description:
              "Everything on the checklist has to be ready before an application goes in.",
          },
          {
            title: "File and await response",
            description:
              "The application and supporting documents are filed, and a response is typically awaited for at least three days.",
          },
          {
            title: "Registration and compliance",
            description:
              "Once approved, the registration certificate is granted, and periodic returns are filed from then on.",
          },
        ],
      },
      {
        heading: "When registration is compulsory",
        body: [
          "Registration is turnover-driven, but a number of cases require it regardless of how small the turnover is:",
        ],
        bullets: [
          "Anyone making an inter-state taxable supply",
          "Casual taxable persons making a taxable supply",
          "Persons required to pay tax under reverse charge",
          "Non-resident taxable persons making a taxable supply",
          "Anyone providing online information or database access from outside India",
          "Agents supplying goods or services on behalf of someone else",
          "Input service distributors",
          "Sellers on e-commerce platforms, and the e-commerce operators themselves",
          "Persons required to deduct TDS, including government departments",
          "Anything else notified by the government from time to time",
        ],
        note: "Turnover thresholds differ by state, and by whether you supply goods or services — and they have changed more than once. We confirm the limit that currently applies to you rather than working from a number on a web page.",
      },
      {
        heading: "Exemptions",
        body: [
          "There are two cases where registration is not required at all, whatever the turnover: suppliers of goods or services that are exempt from tax or cannot be taxed, and agriculturists supplying produce cultivated on their own land, whether they cultivate it themselves or employ others to.",
        ],
      },
      {
        heading: "Compliance after registration",
        body: [
          "There are a great many compliances under GST, and the penalties for getting them wrong are high. Three matter most:",
        ],
        bullets: [
          "Invoices must be uploaded to the GSTN and reference numbers generated before the supply is made",
          "Periodic returns must be filed against those uploaded invoices",
          "An annual return must be filed as well",
        ],
        note: "Return forms and filing frequencies under GST have been revised repeatedly since rollout. We work to the forms in force for your registration type at the time of filing.",
      },
    ],
    whoItsFor: [
      "Businesses at or approaching the registration threshold",
      "Sellers on e-commerce platforms, and e-commerce operators",
      "Anyone making inter-state supplies",
      "Providers of online information or database access from outside India",
      "Businesses that have received a notice, or fallen behind on returns",
    ],
    disclaimerIds: ["not-investment-advice"],
    seo: {
      title: "GST & Indirect Taxation — Registration, Returns & Advisory | Sarvam Associates",
      description:
        "GST registration, periodic and annual returns, reconciliation and indirect tax advisory for businesses across Mumbai.",
    },
  },

  /* -------------------------------------------------------------- audit */
  {
    slug: "audit-assurance",
    name: "Audit & Assurance",
    shortName: "Audit",
    description:
      "Statutory, internal, management, due diligence and tax audit for businesses and professional practices.",
    icon: "ClipboardCheck",
    eyebrow: "CA Services",
    lede: "An independent appraisal function established within an organisation to examine and evaluate its activities — as a service to the organisation, not an exam it has to pass.",
    intro: [
      "We have wide experience conducting audits for large and medium-sized business entities, and prepare financial statements both to accounting standards and in compliance with generally accepted accounting principles.",
      "The emphasis throughout is on internal control strong enough to minimise the risk of accidental or deliberate error and omission — safeguarding of assets, adequate division of authority over key control areas, and compliance with internal operating policy.",
    ],
    blocks: [
      {
        heading: "Internal audit",
        body: [
          "Conducted primarily to give management a clear, comprehensive analysis of the organisation's functional efficiency, and to suggest where it could be improved. Our internal audit services are designed around individual client needs rather than a fixed programme.",
        ],
        bullets: [
          "Critical evaluation of internal controls, and where to strengthen them",
          "Review of existing processes, policies and practices against best practice, including benchmarking",
          "Review of the management framework and its effectiveness",
          "Identification of areas for cost reduction, revenue optimisation and operational efficiency — followed by help implementing them",
          "Confirmation of compliance with regulatory provisions and operational manuals",
          "Assistance in meeting corporate governance requirements",
          "Complete outsourcing of the internal audit function, or co-sourcing alongside your existing team",
        ],
      },
      {
        heading: "Statutory audit",
        body: [
          "Auditing the books of account against statutory requirements, to assure a true and fair view under the particular law the audit is initiated under. Every account is examined against the provisions and regulations that govern it.",
          "Our statutory audit team are experienced professionals working to the applicable accounting and auditing standards.",
        ],
      },
      {
        heading: "Management audit",
        body: [
          "A comprehensive, objective assessment of a company's effectiveness, efficiency, productivity and readiness to respond to change — and of management competence and potential, in a form that can be compared reliably against other companies.",
        ],
        bullets: [
          "Merger and restructuring processes, and how positions should be filled",
          "Benchmarking and due diligence analysis to establish position against competitors and best practice",
          "Development and succession planning",
          "Review of business processes, policies and practices",
          "Evaluation of internal controls and the management framework",
          "Operational audits through scrutiny of business operations, activities and functions",
        ],
      },
      {
        heading: "Due diligence audit",
        body: [
          "A careful investigation into the complete financial picture of a company, generally before a purchase, merger or other major decision that could affect the finances of one or more businesses.",
          "Due diligence is the corporate equivalent of checking references before hiring. A company's strengths tend to be stressed and its weaknesses downplayed; the work focuses on information outside what is freely presented.",
        ],
        bullets: [
          "Confirmation of net assets — both title and value — and the accuracy of accounting",
          "Historic and prospective financial analysis, and assessment of financial risk",
          "Checking the accuracy of tax calculations and evaluating tax risk",
          "Review of corporate structure, title to assets, intellectual property rights and commercial liabilities",
          "Validation of balance sheet and off-balance-sheet items",
          "Review of accounts receivable, revenue trends and quality of earnings",
          "Assessment of accounting policies, the financial close process and the internal audit function",
          "Assessment of systems, IT infrastructure, data and network security",
          "Review of real estate, employee contracts and third-party providers",
        ],
      },
      {
        heading: "Tax audit",
        body: [
          "Section 44AB, introduced by the Finance Act 1984 and in effect from assessment year 1985-86, brought in the tax audit requirement with the aim of curbing tax evasion and avoidance.",
          "In a tax audit the auditor expresses an opinion on the liability and legality of the factual details the assessee has given to the tax authorities. The appointed Chartered Accountant provides the report in Form 3CD, and relevant facts from it must be included when the income tax return is filed.",
        ],
        bullets: [
          "Reducing tax burden by reviewing disallowances and deductions under the Income Tax Act 1961",
          "Careful attention to the figures used to compute assessable income",
          "Reports prepared to auditing and accounting standards and to statutory requirements",
        ],
      },
    ],
    whoItsFor: [
      "Companies with a statutory audit obligation",
      "Businesses falling under section 44AB",
      "Acquirers and investors running due diligence before a transaction",
      "Boards wanting an independent view of their control environment",
      "Organisations outsourcing or co-sourcing internal audit",
    ],
    disclaimerIds: ["not-investment-advice"],
    seo: {
      title: "Audit & Assurance — Statutory, Internal & Tax Audit | Sarvam Associates",
      description:
        "Statutory, internal, management, due diligence and tax audit for businesses and professional practices in Mumbai.",
    },
  },

  /* ---------------------------------------------------------- insurance */
  {
    slug: "insurance-solutions",
    name: "Insurance Solutions",
    shortName: "Insurance",
    description:
      "Life, health and business protection, advised alongside the wealth plan rather than separately.",
    icon: "Umbrella",
    eyebrow: "CA Services",
    lede: "Insurance is the lifeline of a family — and a financial tool for reaching goals, not a product bought once and forgotten.",
    intro: [
      "Sarvam Associates provides an insurance advisory service that works through a systematic analysis of your future needs, so cover is sized against what you are actually protecting rather than what happens to be on sale.",
      "Because we also handle your tax and, where relevant, your investments, protection gets reviewed as part of the same picture instead of as a separate purchase.",
    ],
    blocks: [
      {
        heading: "Life insurance",
        body: [
          "A contract between an insurer and a policyholder in which the insurer guarantees payment of a death benefit to named beneficiaries when the insured dies, in exchange for premiums paid by the policyholder.",
        ],
      },
      {
        heading: "Term insurance",
        body: [
          "A life policy providing cover for a specified term of years. If the insured dies during that period and the policy is in force, the death benefit is paid.",
          "Term cover is initially far less expensive than permanent life insurance. Unlike most permanent policies it has no cash value — the guaranteed death benefit is the whole of what it offers, which is precisely why it buys so much cover per rupee.",
        ],
      },
      {
        heading: "Health insurance",
        body: [
          "Cover that typically pays for medical, surgical, prescription drug and sometimes dental expenses. It can reimburse the insured for costs arising from illness or injury, or pay the care provider directly.",
          "The cost of health insurance premiums is deductible to the payer, and benefits received are tax-free, with certain exceptions — one of the places where the tax and protection conversations genuinely overlap.",
        ],
      },
      {
        heading: "General insurance",
        body: [
          "Non-life policies, including motor and homeowners cover, which pay out according to the loss from a particular event.",
          "General insurance protects the things you value — your home, your vehicle, your valuables — from the financial impact of risks large and small: fire, flood, storm and earthquake, theft, road accidents, travel mishaps, and the cost of legal action against you. Which of those risks you cover is a choice, made by choosing the policy and the features to match.",
        ],
      },
    ],
    whoItsFor: [
      "Families with dependants, or a single income supporting several people",
      "Anyone carrying a home loan or other long-dated liability",
      "Business owners with keyman, premises or liability exposure",
      "Households reviewing health cover after a claim or a diagnosis",
      "Investors whose portfolio has grown faster than their protection",
    ],
    disclaimerIds: ["insurance-irdai"],
    seo: {
      title: "Insurance Solutions — Life, Health & General Cover | Sarvam Associates",
      description:
        "Life, term, health and general insurance advice, sized against your actual needs and reviewed alongside your tax and wealth plan.",
    },
  },
];

export const ALL_SERVICE_SLUGS = SERVICES.map((s) => s.slug);

export const getService = (slug: string): Service | undefined =>
  SERVICES.find((s) => s.slug === slug);

/** Path for a service page. Single source of truth for nav, footer and cards. */
export const serviceHref = (slug: string) => `/services/${slug}`;
