import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { COMPANY, PARTNER, REGISTRATIONS } from "@/lib/content/company";
import { FOOTER_DISCLAIMER_IDS, getDisclaimers } from "@/lib/content/disclaimers";
import { FOOTER_COLUMNS } from "@/lib/content/nav";
import { SOCIAL_ICONS } from "@/components/ui/SocialIcon";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const disclaimers = getDisclaimers(FOOTER_DISCLAIMER_IDS);

  return (
    <footer className="bg-charcoal text-ivory grain relative isolate">
      <div className="container-page relative section">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-12">
          {/* Brand */}
          <div>
            <Logo onDark />

            <p className="text-ivory/55 measure mt-8 max-w-xs text-sm">
              A Mumbai practice that has handled tax and compliance for 15+
              years — now bringing the same relationship to how you invest.
            </p>

            <address className="text-ivory/55 mt-8 space-y-3 text-sm not-italic">
              <span className="flex items-start gap-3">
                <MapPin
                  aria-hidden
                  strokeWidth={1.5}
                  className="text-champagne mt-1 size-4 shrink-0"
                />
                <span>
                  {COMPANY.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </span>
              <a
                href={`mailto:${COMPANY.email}`}
                className="hover:text-ivory flex items-center gap-3 transition-colors"
              >
                <Mail
                  aria-hidden
                  strokeWidth={1.5}
                  className="text-champagne size-4 shrink-0"
                />
                {COMPANY.email}
              </a>
              {COMPANY.phone && (
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                  className="hover:text-ivory block transition-colors"
                >
                  {COMPANY.phone}
                </a>
              )}
            </address>

            <ul className="mt-8 flex gap-2.5">
              {COMPANY.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon as keyof typeof SOCIAL_ICONS];
                return (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${COMPANY.name} on ${social.name}`}
                      className="border-ivory/15 text-ivory/55 hover:border-ivory/40 hover:text-ivory grid size-10 place-items-center rounded-pill border transition-colors duration-300"
                    >
                      <Icon aria-hidden className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-eyebrow text-ivory/40 mb-5 uppercase">
                {column.title}
              </h2>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ivory/60 hover:text-ivory inline-flex items-center gap-1.5 text-sm transition-colors duration-300"
                      >
                        {link.label}
                        <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-ivory/60 hover:text-ivory text-sm transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Regulatory block — readable size, never 10px grey on black. */}
      <div className="border-ivory/10 relative border-t">
        <div className="container-page py-12">
          <h2 className="text-eyebrow text-ivory/40 mb-6 uppercase">
            Important information
          </h2>

          <div className="grid gap-x-16 gap-y-4 md:grid-cols-2">
            {disclaimers.map((d) => (
              <p key={d.id} className="text-ivory/55 text-xs">
                {d.body}
              </p>
            ))}
          </div>

          <p className="text-ivory/55 mt-5 text-xs">
            {REGISTRATIONS.roleStatement}
            {REGISTRATIONS.hasArn && ` ${REGISTRATIONS.arn}.`} Products are
            manufactured and issued by {PARTNER.legalName} and other product
            providers; Sarvam Associates distributes them and does not
            manufacture, issue or manage any product shown on this site.
          </p>
        </div>
      </div>

      <div className="border-ivory/10 relative border-t">
        <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ivory/40 text-xs">
            © {year} {COMPANY.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {[
              { label: "Disclaimer", href: "/disclaimer" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Use", href: "/terms" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ivory/40 hover:text-ivory text-xs transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
