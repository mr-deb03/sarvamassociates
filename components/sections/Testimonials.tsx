import { Info } from "lucide-react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  HAS_PLACEHOLDER_TESTIMONIALS,
  TESTIMONIALS,
  VERIFIED_TESTIMONIALS,
} from "@/lib/content/testimonials";
import type { Testimonial } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Client stories. Two constraints, both deliberate:
 *
 * 1. NO STAR RATINGS. The original mockup put ★★★★★ on every card. Ratings
 *    that were never collected are a fabricated verification signal, so the
 *    component has no way to render one.
 * 2. Placeholder copy is labelled as placeholder. The source document heads
 *    these "Dummy Reviews" — the client's own illustrative text, not real
 *    client statements. `allowPlaceholders` must be passed explicitly, and when
 *    it is, a visible notice renders above the quotes.
 *
 * Once real, consented quotes replace the text and `placeholder` is set false
 * in the content file, this section switches to them automatically and the
 * notice disappears.
 */
export function Testimonials({
  allowPlaceholders = false,
}: {
  allowPlaceholders?: boolean;
}) {
  const items = allowPlaceholders ? TESTIMONIALS : VERIFIED_TESTIMONIALS;
  const showingPlaceholders = allowPlaceholders && HAS_PLACEHOLDER_TESTIMONIALS;

  // A designed empty state rather than a blank gap.
  if (items.length === 0) {
    return (
      <section className="bg-mist section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Client stories"
            title="Coming soon"
            lede="We are collecting consented client statements. Rather than publish invented ones, we would rather leave this space empty until they are real."
          />
        </div>
      </section>
    );
  }

  const [featured, ...rest] = items;

  return (
    <section className="bg-mist section">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Client stories"
            title="What working with us actually sounds like"
          />
        </Reveal>

        {showingPlaceholders && (
          <Reveal className="mt-10">
            <p className="border-line text-body flex max-w-3xl items-start gap-3 border-l-2 py-1 pl-5 text-xs">
              <Info aria-hidden strokeWidth={1.75} className="text-muted mt-0.5 size-4 shrink-0" />
              <span>
                <strong className="text-navy font-semibold">
                  Illustrative content.
                </strong>{" "}
                The quotes below are placeholder copy supplied for design
                purposes and are not verified client statements. They will be
                replaced with real, consented testimonials before launch.
              </span>
            </p>
          </Reveal>
        )}

        {/* Featured quote, set large and editorial. */}
        {featured && (
          <Reveal className="mt-14">
            <figure className="border-navy max-w-4xl border-t pt-12">
              <blockquote className="font-display text-display-md text-navy italic">
                {featured.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-baseline gap-3 text-sm">
                <span className="text-navy font-semibold">
                  {featured.author}
                </span>
                <span className="text-muted">{featured.context}</span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        <Reveal preset="stagger" className="mt-16" tall>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rest.slice(0, 4).map((t) => (
              <RevealItem key={t.id} as="li">
                <TestimonialCard testimonial={t} />
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure
      className={cn(
        "border-line bg-card rounded-card flex h-full flex-col border p-7",
        "transition-[border-color,transform] duration-400 ease-[var(--ease-editorial)]",
        "hover:border-navy/25 hover:-translate-y-0.5",
      )}
    >
      <blockquote className="text-body text-sm">{testimonial.quote}</blockquote>

      <figcaption className="border-line mt-auto border-t pt-5">
        <span className="text-navy block text-sm font-semibold">
          {testimonial.author}
        </span>
        <span className="text-muted mt-1 block text-xs">
          {testimonial.context}
        </span>
      </figcaption>
    </figure>
  );
}
