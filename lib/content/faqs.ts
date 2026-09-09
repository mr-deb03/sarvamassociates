import type { Faq } from "./types";

/**
 * Site-wide FAQs. Product-specific questions live on the product itself.
 *
 * Answers are plain text with no markup, because the same string feeds both
 * the rendered DOM and the FAQPage JSON-LD. Only FAQs actually visible on a
 * page may be emitted into that page's structured data.
 */
export const GENERAL_FAQS: Faq[] = [
  {
    question: "What exactly does Sarvam Associates do?",
    answer:
      "Two things, for the same clients. We are a chartered accountancy practice handling direct tax, GST, audit and compliance. We are also an AMFI-registered mutual fund distributor and an authorised distribution partner of Nuvama Wealth Management Ltd, through which we help clients invest. The point of doing both is that your tax position and your investments get considered together rather than by two people who never speak.",
  },
  {
    question: "Are you an investment adviser or a distributor?",
    answer:
      "A distributor. We are an AMFI-registered mutual fund distributor and an authorised distribution partner for the investment products shown on this site. We do not hold a SEBI Investment Adviser registration. The distinction matters: as a distributor we are compensated by the product manufacturers through commission, not by you through an advisory fee.",
  },
  {
    question: "How are you paid?",
    answer:
      "Through distribution commission paid by product manufacturers, which is built into the product rather than billed to you separately. This is standard for a distributor, and it is worth understanding, because it means we have a commercial relationship with the manufacturers whose products we recommend. Ask us what we earn on anything we suggest and we will tell you.",
  },
  {
    question: "What is Nuvama's role, and what is yours?",
    answer:
      "Nuvama Wealth Management Ltd manufactures and issues the investment products — they run the strategies and make the investment decisions. Sarvam Associates is their authorised distribution partner: we assess whether a product suits you, handle onboarding and paperwork, and manage your relationship and reviews. We do not manage any portfolio and we do not issue any product.",
  },
  {
    question: "Do I need a large amount to start?",
    answer:
      "No. A SIP starts at ₹500 a month and a lump-sum mutual fund investment at ₹1,000. Some products do carry high regulatory minimums that cannot be waived — PMS requires ₹50,00,000 and AIFs ₹1,00,00,000, both set by SEBI rather than by us.",
  },
  {
    question: "Can you guarantee returns?",
    answer:
      "No, and neither can anyone else offering market-linked products. Every investment shown on this site carries risk, including the possibility of losing money. Where a product includes a capital protection feature, that feature depends on the issuer meeting its obligations and is not a guarantee. Any figures described as indicative are illustrations of how a product is designed to behave, not promises of what you will receive.",
  },
  {
    question: "Do you take custody of my money?",
    answer:
      "No. Investments are made in your own name, into accounts and folios that belong to you. In a PMS, shares are held in your own demat account. We facilitate and administer; we never hold your funds.",
  },
  {
    question: "What happens in the free consultation?",
    answer:
      "Fifteen minutes on a call. We ask about your goals, your timeline, and what you already hold. You will get an honest view of whether we can add anything — including being told that your current arrangement is fine and you do not need us. There is no obligation and nothing is sold on that call.",
  },
  {
    question: "I already invest elsewhere. Is it worth talking?",
    answer:
      "Often yes, particularly if nobody has looked at your portfolio and your tax position at the same time. We are just as likely to tell you to leave things alone as to change them.",
  },
  {
    question: "Where are you based?",
    answer:
      "Bhandup (West), Mumbai. We meet clients in person at the office, and we work with clients across Mumbai remotely. Onboarding is digital, with a real person checking every step.",
  },
];
