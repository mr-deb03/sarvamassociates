import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { COMPANY } from "@/lib/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "The terms on which Sarvam Associates provides this website, including the limits of the information published on it.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="The terms on which this website is provided. Using it means accepting them."
      crumb="Terms of Use"
      path="/terms"
      updated="September 2026"
      sections={[
        {
          heading: "About this website",
          paragraphs: [
            `This website is operated by ${COMPANY.name}, ${COMPANY.addressLines.join(", ")}.`,
            "It is provided for general information about our services. It is not an offer, solicitation or recommendation to buy or sell any financial product.",
          ],
        },
        {
          heading: "Information is general, not personal",
          paragraphs: [
            "Nothing published here takes account of your particular objectives, financial situation or needs. Product descriptions are summaries and are not complete — the definitive terms of any product are in its own offer documents, which you should read before investing.",
            "Where this site and a product's own scheme documents, disclosure document, private placement memorandum or policy wording differ, those documents prevail.",
          ],
        },
        {
          heading: "Accuracy",
          paragraphs: [
            "We take care to keep this site accurate, but figures such as minimum investments, indicative yields, interest rates and regulatory thresholds change. We do not warrant that everything here is current at the moment you read it, and we are not liable for decisions made in reliance on it without speaking to us.",
          ],
        },
        {
          heading: "No guarantee of outcomes",
          paragraphs: [
            "We do not guarantee any investment return, capital protection, approval of any loan or facility, or any timeline for sanction or disbursement. Those are decisions of product manufacturers and lenders, not ours.",
          ],
        },
        {
          heading: "Availability",
          paragraphs: [
            "We may change, suspend or withdraw any part of this website at any time without notice.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            `The content, design and marks on this website belong to ${COMPANY.name} or are used with permission. Third-party names and marks referred to on this site remain the property of their respective owners.`,
          ],
        },
        {
          heading: "External links",
          paragraphs: [
            "Links to external sites are provided for convenience. We do not control and are not responsible for their content or practices.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            `These terms are governed by the laws of India, and the courts at ${COMPANY.address.city}, ${COMPANY.address.region} have exclusive jurisdiction over any dispute arising from them.`,
          ],
        },
        {
          heading: "Contact",
          paragraphs: [`Questions about these terms: ${COMPANY.email}.`],
        },
      ]}
    />
  );
}
