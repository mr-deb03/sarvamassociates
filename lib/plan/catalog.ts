/* ==========================================================================
   Financial plan taxonomies.

   Every list the planner renders lives here once. The field set is modelled on
   the planning worksheet the practice already uses internally (supplied as
   screenshots), so a plan produced on the website maps field-for-field onto
   what the advisor sees on their desk.

   TWO FIELDS FROM THAT WORKSHEET ARE DELIBERATELY ABSENT:

     - PAN. The worksheet opens with "Search Client / PAN" because it is an
       internal tool looking up an existing client record. A public website
       form asking an unauthenticated visitor for a PAN is a different thing
       entirely, and brief §26 forbids it.
     - Client ID. Same reason — it is an internal key, meaningless here.

   Nothing else was dropped. Where a value had to be invented rather than read
   off the worksheet it is commented as such below.
   ========================================================================== */

export const GENDERS = ["male", "female", "other"] as const;
export type Gender = (typeof GENDERS)[number];
export const GENDER_LABELS: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

export const MARITAL_STATUSES = ["single", "married", "other"] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];
export const MARITAL_LABELS: Record<MaritalStatus, string> = {
  single: "Single",
  married: "Married",
  other: "Other",
};

/* ==========================================================================
   Risk profiles

   The five band names are the worksheet's own. The allocation attached to each
   is a STARTING POINT the visitor can overwrite — every one of the five
   numbers is an editable input, and the plan uses whatever they leave in the
   boxes, not what is seeded here.

   Only "Moderately Aggressive" is sourced: the worksheet screenshot shows it
   selected with 55 / 25 / 10 / 10 / 0. The other four are conventional spreads
   around it, which is why the UI labels them an indicative starting mix and
   the report restates that the allocation shown is the visitor's own.
   ========================================================================== */

export interface Allocation {
  equity: number;
  debt: number;
  cash: number;
  commodities: number;
  alternatives: number;
}

export const ALLOCATION_KEYS = [
  "equity",
  "debt",
  "cash",
  "commodities",
  "alternatives",
] as const satisfies readonly (keyof Allocation)[];

export const ALLOCATION_LABELS: Record<keyof Allocation, string> = {
  equity: "Equity",
  debt: "Debt",
  cash: "Cash",
  commodities: "Commodities",
  alternatives: "Alt. investments",
};

export const RISK_PROFILES = [
  "conservative",
  "moderate",
  "moderately-aggressive",
  "aggressive",
  "very-aggressive",
] as const;
export type RiskProfile = (typeof RISK_PROFILES)[number];

export interface RiskProfileMeta {
  label: string;
  /** One line on who tends to sit here. Descriptive, not a recommendation. */
  note: string;
  allocation: Allocation;
}

export const RISK_PROFILE_META: Record<RiskProfile, RiskProfileMeta> = {
  conservative: {
    label: "Conservative",
    note: "Protecting what you have matters more than growing it quickly.",
    allocation: { equity: 15, debt: 60, cash: 20, commodities: 5, alternatives: 0 },
  },
  moderate: {
    label: "Moderate",
    note: "Some growth, but a fall of more than a fifth would be hard to sit through.",
    allocation: { equity: 35, debt: 45, cash: 10, commodities: 10, alternatives: 0 },
  },
  "moderately-aggressive": {
    label: "Moderately Aggressive",
    note: "Comfortable with market swings over a ten-year horizon.",
    // The one allocation taken directly from the practice's worksheet.
    allocation: { equity: 55, debt: 25, cash: 10, commodities: 10, alternatives: 0 },
  },
  aggressive: {
    label: "Aggressive",
    note: "Long horizon, and a bad year does not change the plan.",
    allocation: { equity: 70, debt: 15, cash: 5, commodities: 5, alternatives: 5 },
  },
  "very-aggressive": {
    label: "Very Aggressive",
    note: "Maximum growth sought, with full acceptance of deep drawdowns.",
    allocation: { equity: 80, debt: 5, cash: 5, commodities: 5, alternatives: 5 },
  },
};

/* ==========================================================================
   Income and expenses

   Both lists are the worksheet's, in the worksheet's order.
   ========================================================================== */

export const INCOME_FIELDS = [
  { key: "salary", label: "Salary / Business / Profession" },
  { key: "rental", label: "Rental / Other income" },
] as const;

export const EXPENSE_FIELDS = [
  { key: "groceries", label: "Groceries" },
  { key: "transportation", label: "Transportation" },
  { key: "clothing", label: "Clothing" },
  { key: "education", label: "Education" },
  { key: "houseRent", label: "House rent" },
  { key: "diningOut", label: "Dining out" },
  { key: "electricity", label: "Electricity" },
  { key: "houseServant", label: "House help" },
  { key: "medical", label: "Medical" },
  { key: "mobileInternet", label: "Mobile & internet" },
  { key: "other", label: "Other expenses" },
] as const;
export type ExpenseKey = (typeof EXPENSE_FIELDS)[number]["key"];

/* ==========================================================================
   Goals

   The eight tiles from the worksheet's Quick Goal Maker, in its order.

   `defaultHorizonYears` seeds the date picker only. `defaultInflation` differs
   by goal because education and weddings have historically run well ahead of
   headline CPI — the visitor can change every one of these, and the report
   prints the assumption next to the number it produced.
   ========================================================================== */

export const GOAL_TYPES = [
  "car",
  "child-marriage",
  "child-education",
  "holiday",
  "house",
  "retirement",
  "self-education",
  "other",
] as const;
export type GoalType = (typeof GOAL_TYPES)[number];

export interface GoalTypeMeta {
  label: string;
  /** lucide-react icon name, resolved in components/plan/GoalIcon.tsx */
  icon: string;
  defaultHorizonYears: number;
  defaultInflation: number;
  /** Prompt for the free-text "who or what is this for" field. */
  subjectLabel: string;
  subjectPlaceholder: string;
}

export const GOAL_TYPE_META: Record<GoalType, GoalTypeMeta> = {
  car: {
    label: "Car",
    icon: "Car",
    defaultHorizonYears: 5,
    defaultInflation: 5,
    subjectLabel: "Which car?",
    subjectPlaceholder: "Family hatchback",
  },
  "child-marriage": {
    label: "Child's marriage",
    icon: "HeartHandshake",
    defaultHorizonYears: 20,
    defaultInflation: 7,
    subjectLabel: "Planning for",
    subjectPlaceholder: "Child's name",
  },
  "child-education": {
    label: "Child's education",
    icon: "GraduationCap",
    defaultHorizonYears: 15,
    defaultInflation: 8,
    subjectLabel: "Planning for",
    subjectPlaceholder: "Child's name",
  },
  holiday: {
    label: "Holiday",
    icon: "Palmtree",
    defaultHorizonYears: 2,
    defaultInflation: 6,
    subjectLabel: "Where to?",
    subjectPlaceholder: "Europe, two weeks",
  },
  house: {
    label: "House",
    icon: "Home",
    defaultHorizonYears: 7,
    defaultInflation: 7,
    subjectLabel: "What kind?",
    subjectPlaceholder: "2BHK in the Mumbai suburbs",
  },
  retirement: {
    label: "Retirement",
    icon: "Armchair",
    defaultHorizonYears: 25,
    defaultInflation: 6,
    subjectLabel: "Label",
    subjectPlaceholder: "My retirement",
  },
  "self-education": {
    label: "Self education",
    icon: "BookOpen",
    defaultHorizonYears: 4,
    defaultInflation: 8,
    subjectLabel: "Which course?",
    subjectPlaceholder: "Executive MBA",
  },
  other: {
    label: "Something else",
    icon: "Target",
    defaultHorizonYears: 10,
    defaultInflation: 6,
    subjectLabel: "Label",
    subjectPlaceholder: "What is this for?",
  },
};

/* ==========================================================================
   Assets and liabilities
   ========================================================================== */

export const ASSET_TYPES = [
  "equity-mf",
  "debt-mf",
  "stocks",
  "fd-rd",
  "ppf-epf",
  "nps",
  "gold",
  "real-estate",
  "insurance-savings",
  "cash",
  "other",
] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export interface AssetTypeMeta {
  label: string;
  /** Which allocation sleeve this counts towards in the current-mix chart. */
  sleeve: keyof Allocation;
  /**
   * Whether this asset can realistically be earmarked against a goal.
   * A self-occupied home and an EPF balance usually cannot, so they are
   * excluded from goal mapping and shown under net worth only.
   */
  mappable: boolean;
}

export const ASSET_TYPE_META: Record<AssetType, AssetTypeMeta> = {
  "equity-mf": { label: "Equity mutual funds", sleeve: "equity", mappable: true },
  "debt-mf": { label: "Debt mutual funds", sleeve: "debt", mappable: true },
  stocks: { label: "Direct stocks", sleeve: "equity", mappable: true },
  "fd-rd": { label: "Fixed / recurring deposits", sleeve: "debt", mappable: true },
  "ppf-epf": { label: "PPF / EPF", sleeve: "debt", mappable: false },
  nps: { label: "NPS", sleeve: "equity", mappable: false },
  gold: { label: "Gold & sovereign gold bonds", sleeve: "commodities", mappable: true },
  "real-estate": { label: "Real estate", sleeve: "alternatives", mappable: false },
  "insurance-savings": {
    label: "Traditional insurance / endowment",
    sleeve: "debt",
    mappable: true,
  },
  cash: { label: "Savings account & cash", sleeve: "cash", mappable: true },
  other: { label: "Other investments", sleeve: "alternatives", mappable: true },
};

export const LIABILITY_TYPES = [
  "home-loan",
  "car-loan",
  "personal-loan",
  "education-loan",
  "credit-card",
  "other",
] as const;
export type LiabilityType = (typeof LIABILITY_TYPES)[number];

export const LIABILITY_LABELS: Record<LiabilityType, string> = {
  "home-loan": "Home loan",
  "car-loan": "Car / vehicle loan",
  "personal-loan": "Personal loan",
  "education-loan": "Education loan",
  "credit-card": "Credit card outstanding",
  other: "Other borrowing",
};

/* ==========================================================================
   Assumption defaults

   These seed the inputs. They are NOT Sarvam's view of what any asset will
   return, and the planner says so beside every one of them.

   6% inflation is the upper bound of the RBI's 4% ±2% tolerance band — a
   conventional, conservative planning figure rather than a forecast.

   10% is a round number chosen for being unremarkable. It sits below long-run
   Indian equity history and above long-run debt, so it flatters neither an
   equity-heavy nor a debt-heavy plan. The visitor is expected to change it.
   ========================================================================== */

export const ASSUMPTIONS = {
  inflation: { default: 6, min: 0, max: 15, step: 0.5 },
  returnRate: { default: 10, min: 1, max: 20, step: 0.5 },
  /** Months of expenses held as an emergency buffer. Worksheet default: 3. */
  contingencyMonths: { default: 6, min: 0, max: 24, step: 1 },
  retirementAge: { default: 60, min: 40, max: 80 },
  lifeExpectancy: { default: 85, min: 50, max: 110 },
  /** Post-retirement drawdown return, deliberately lower than accumulation. */
  postRetirementReturn: { default: 7, min: 1, max: 15, step: 0.5 },
} as const;
