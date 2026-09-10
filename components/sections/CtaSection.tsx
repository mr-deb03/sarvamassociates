import { Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { COMPANY } from "@/lib/content/company";

/**
 * Closing call to action — the page's final dark beat before the footer.
 *
 * Reused at the foot of most pages, so the copy is props rather than baked in:
 * one component, contextual wording.
 */
export function CtaSection({
  eyebrow = "Next step",
  title = "Let's build your financial plan together.",
  body = "A 15-minute conversation about your goals, your timeline, and what you already hold. No commitment, no sales script — and an honest answer if we think you don't need us.",
  primary = { label: "Book a Consultation", href: "/contact" },
  secondary,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="bg-navy grain section relative isolate overflow-hidden">
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[70vw] max-w-[56rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-navy-600)_0%,transparent_64%)] opacity-70"
      />

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow onDark centered className="mb-8">
            {eyebrow}
          </Eyebrow>

          <h2 className="font-display text-display-lg text-paper">{title}</h2>

          <p className="text-body-lg text-paper/65 measure-wide mx-auto mt-8">
            {body}
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <ButtonLink
              href={primary.href}
              variant="primaryOnDark"
              size="lg"
              withArrow
            >
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink
                href={secondary.href}
                variant="tertiaryOnDark"
                size="lg"
                withArrow
              >
                {secondary.label}
              </ButtonLink>
            )}
          </div>

          <div className="text-paper/50 mt-14 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-10">
            <a
              href={`mailto:${COMPANY.email}`}
              className="hover:text-paper flex items-center gap-2.5 transition-colors"
            >
              <Mail aria-hidden strokeWidth={1.5} className="text-accent size-4" />
              {COMPANY.email}
            </a>
            <span className="flex items-center gap-2.5">
              <MapPin aria-hidden strokeWidth={1.5} className="text-accent size-4" />
              {COMPANY.address.locality}, {COMPANY.address.city}
            </span>
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-3xl">
          <Disclaimer
            ids={["mf-market-risk", "distributor-role", "not-investment-advice"]}
            onDark
            variant="panel"
          />
        </Reveal>
      </div>
    </section>
  );
}
