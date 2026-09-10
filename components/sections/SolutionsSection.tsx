import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CATEGORIES } from "@/lib/content/categories";
import { getProductsByCategory } from "@/lib/content";
import { formatMinimum } from "@/lib/content/display";

/**
 * The seven solution categories.
 *
 * Each card's "from" figure is computed from the products themselves rather
 * than typed by hand, so a change to a product minimum updates the card
 * automatically and the two can never disagree.
 *
 * Cards sit on mist and are paper, so the surface separation comes from the
 * ground rather than from shadows.
 */
export function SolutionsSection() {
  return (
    <section className="bg-mist section">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Solutions"
            title="Products for every financial goal"
            lede="Seven categories, from a ₹500 monthly SIP to alternative strategies with a ₹1 crore minimum. Each one states plainly who it is for, and who it is not."
            action={
              <ButtonLink href="/investments" variant="secondary" withArrow>
                Compare all solutions
              </ButtonLink>
            }
          />
        </Reveal>

        <Reveal preset="stagger" className="mt-16" tall>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => {
              const products = getProductsByCategory(category.slug);
              const cheapest = products
                .map((p) => p.minInvestment)
                .filter((m) => m !== null)
                .sort((a, b) => a.amount - b.amount)[0];

              const href =
                category.domain === "investment"
                  ? `/investments/${category.slug}`
                  : "/financial-solutions";

              return (
                <RevealItem key={category.slug} as="li">
                  <Link
                    href={href}
                    className="group border-line bg-card rounded-card hover:border-navy/25 flex h-full flex-col border p-8 transition-[border-color,transform] duration-400 ease-[var(--ease-editorial)] hover:-translate-y-0.5"
                  >
                    <CategoryIcon
                      name={category.icon}
                      className="text-navy size-6"
                    />

                    <h3 className="font-display text-display-sm text-navy mt-8">
                      {category.name}
                    </h3>
                    <p className="text-body mt-3 mb-8 text-sm">
                      {category.description}
                    </p>

                    <div className="border-line mt-auto flex items-center justify-between border-t pt-5">
                      <span className="text-muted text-xs">
                        {cheapest ? (
                          <>
                            From{" "}
                            <span className="text-navy font-semibold">
                              {formatMinimum(cheapest)}
                            </span>
                          </>
                        ) : (
                          <span className="text-navy font-semibold">
                            On enquiry
                          </span>
                        )}
                      </span>

                      <ArrowRight
                        aria-hidden
                        strokeWidth={1.75}
                        className="text-muted group-hover:text-navy size-4 transition-all duration-400 ease-[var(--ease-editorial)] group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </RevealItem>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
