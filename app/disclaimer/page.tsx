import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { DISCLAIMERS } from "@/lib/content/disclaimers";
import { COMPANY, PARTNER, REGISTRATIONS } from "@/lib/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "Investment risk disclosures, our role as a distributor rather than a manufacturer, and what the figures on this site do and do not mean.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="What the information on this site is, what it isn't, and the risks attached to every product described on it."
      crumb="Disclaimer"
      path="/disclaimer"
      updated="September 2026"
      sections={[
        {
          heading: "Market risk",
          paragraphs: [
            DISCLAIMERS["mf-market-risk"].body,
            DISCLAIMERS["securities-market-risk"].body,
            DISCLAIMERS["past-performance"].body,
            "Every investment product described on this website carries risk, including the risk of losing money. The value of investments can fall as well as rise, and you may get back less than you invested.",
          ],
        },
        {
          heading: "Our role",
          paragraphs: [
            REGISTRATIONS.roleStatement,
            DISCLAIMERS["distributor-role"].body,
            `${PARTNER.legalName} and other product providers manufacture and issue the products described on this site. ${COMPANY.name} distributes them. We do not manage any portfolio, we do not issue any product, and we do not take custody of client funds. Investments are made in your own name, into accounts and folios that belong to you.`,
          ],
        },
        {
          heading: "How we are paid",
          paragraphs: [
            "As a distributor, we are compensated by product manufacturers through distribution commission, which is built into the product rather than billed to you separately.",
            "This means we have a commercial relationship with the manufacturers whose products we distribute. We disclose this openly because you should factor it in. You are entitled to ask what we earn on anything we suggest, and we will tell you.",
          ],
        },
        {
          heading: "Not investment advice",
          paragraphs: [
            DISCLAIMERS["not-investment-advice"].body,
            "Nothing on this website is a recommendation to buy, sell or hold any security or product. Any tools, filters or calculators provided here narrow information or perform arithmetic on assumptions you supply — they do not assess whether anything is suitable for your circumstances.",
          ],
        },
        {
          heading: "Figures, yields and indicative returns",
          paragraphs: [
            DISCLAIMERS["indicative-yield"].body,
            "Where a figure on this site is described as indicative, it illustrates how a product is structured to behave across different outcomes. It is not a forecast, not a promise, and not a range you should expect to receive. Actual returns may be lower, including zero or negative.",
          ],
        },
        {
          heading: "Capital protection",
          paragraphs: [
            DISCLAIMERS["mld-capital-protection"].body,
            "No product described on this site is guaranteed, risk-free or capital-assured in the sense a bank deposit is. Where a structure includes a protection feature, that feature depends on the issuer meeting its obligations.",
          ],
        },
        {
          heading: "Regulatory minimums",
          paragraphs: [
            DISCLAIMERS["pms-eligibility"].body,
            DISCLAIMERS["aif-eligibility"].body,
          ],
        },
        {
          heading: "Borrowing against securities",
          paragraphs: [DISCLAIMERS["las-collateral"].body],
        },
        {
          heading: "Insurance",
          paragraphs: [DISCLAIMERS["insurance-irdai"].body],
        },
        {
          heading: "Third-party links",
          paragraphs: [
            `This website links to ${COMPANY.legacySite} and to third-party social media profiles. We are not responsible for the content, accuracy or availability of any external site.`,
          ],
        },
      ]}
      footer={
        <Disclaimer
          ids={["platform-facilitation", "nuvama-facilitation"]}
          variant="panel"
        />
      }
    />
  );
}
