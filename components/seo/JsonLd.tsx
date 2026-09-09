import { COMPANY, PARTNER } from "@/lib/content/company";
import type { Faq, Product } from "@/lib/content/types";
import { SITE, SITE_URL } from "@/lib/seo";

/**
 * Structured data.
 *
 * Every node cross-references the organisation by @id rather than repeating
 * it — the same principle as the disclaimer registry. Nothing here asserts a
 * claim the site does not also make visibly: no aggregateRating (there are no
 * verified reviews), no numeric AUM (that figure belongs to the partner), and
 * no registration identifier until a real one is supplied.
 */

const ORG_ID = `${SITE_URL}/#organization`;

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is fully controlled by us — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const a = COMPANY.address;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        // AccountingService is a subtype of FinancialService -> LocalBusiness
        // -> Organization, so one node satisfies all three.
        "@type": "AccountingService",
        "@id": ORG_ID,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        url: SITE_URL,
        description: SITE.description,
        email: COMPANY.email,
        // `telephone` is omitted deliberately — no phone number appears in any
        // source document. Add it here once COMPANY.phone is populated.
        ...(COMPANY.phone && { telephone: COMPANY.phone }),
        address: {
          "@type": "PostalAddress",
          streetAddress: `${a.line1}, ${a.line2}`,
          addressLocality: a.locality,
          addressRegion: a.region,
          postalCode: a.postalCode,
          addressCountry: a.country,
        },
        areaServed: { "@type": "City", name: "Mumbai" },
        sameAs: COMPANY.socials.map((s) => s.href),
        knowsAbout: [
          "Tax planning",
          "GST and indirect taxation",
          "Audit and assurance",
          "Mutual fund distribution",
          "Portfolio Management Services",
          "Alternative Investment Funds",
          "Loan against securities",
        ],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-IN",
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        name: product.name,
        description: product.summary,
        url: `${SITE_URL}/products/${product.slug}`,
        category: product.category,
        // Sarvam distributes; it does not issue. `provider` names the
        // distributor relationship, and the page text names the manufacturer.
        provider: { "@id": ORG_ID },
        ...(product.disclaimerIds.includes("nuvama-facilitation") && {
          brand: { "@type": "Organization", name: PARTNER.legalName },
        }),
      }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: readonly Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      }}
    />
  );
}
