import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { COMPANY } from "@/lib/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "What Sarvam Associates collects through this website, why, how long we keep it, and what we deliberately do not ask for.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="A short policy, because this website collects very little. Here is exactly what it takes, why, and what it deliberately does not ask for."
      crumb="Privacy Policy"
      path="/privacy-policy"
      updated="September 2026"
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "Only what you type into the consultation form on this website:",
          ],
          bullets: [
            "Your name",
            "Your mobile number",
            "Your email address",
            "The area you'd like to discuss, your preferred contact method and callback time",
            "Anything you choose to write in the optional message box",
          ],
        },
        {
          heading: "What we deliberately do not collect",
          paragraphs: [
            "This website will never ask you for your PAN, Aadhaar number, bank account details, card details, account passwords, income, or the value of your existing portfolio.",
            "Where identity verification is genuinely required — for account opening and KYC — it happens through regulated channels operated by the product manufacturer or registrar, never through a form on this website, and never over email or a messaging app. If anyone claiming to represent us asks you for those details through this site, an email, or WhatsApp, do not provide them and contact us directly.",
          ],
        },
        {
          heading: "Why we collect it",
          paragraphs: [
            "Solely to respond to your enquiry — to call or email you back about the consultation you requested.",
            "We do not add enquiry details to a marketing list, and we do not send unsolicited campaigns to people who asked a question.",
          ],
        },
        {
          heading: "Who we share it with",
          paragraphs: [
            "Nobody, other than the service providers that operate this website and deliver form submissions to us. We do not sell, rent or trade personal information, and we do not pass your details to product manufacturers unless and until you decide to invest and instruct us to proceed.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "Enquiry details are retained only as long as needed to respond and to maintain a reasonable record of the conversation. If you ask us to delete your enquiry, we will.",
            "Where you become a client, records are retained for the periods required by applicable law and regulation, which are longer and are not within our discretion.",
          ],
        },
        {
          heading: "Cookies and analytics",
          paragraphs: [
            "This website does not use advertising cookies and does not track you across other websites. Any analytics used are limited to understanding aggregate page usage.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            `You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Email ${COMPANY.email} and we will action it.`,
          ],
        },
        {
          heading: "Security",
          paragraphs: [
            "This website is served over HTTPS and form submissions are transmitted encrypted. No system is perfectly secure, which is a further reason this site does not ask for financial or identity documents.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            `Questions about this policy: ${COMPANY.email}, or write to us at ${COMPANY.addressLines.join(", ")}.`,
          ],
        },
      ]}
    />
  );
}
