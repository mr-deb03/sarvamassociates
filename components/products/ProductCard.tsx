import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RiskMeter } from "@/components/ui/RiskMeter";
import { formatMinimum, LIQUIDITY_LABELS } from "@/lib/content/display";
import type { Product } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Product card — a server component.
 *
 * Every value shown derives from the product's stored machine fields via the
 * display maps, so a card and the filter that selects it can never disagree.
 *
 * The risk meter is always present and sits directly above the minimum, which
 * is the opposite of how most financial cards are built — risk is usually
 * demoted to a footnote, if it appears at all.
 */
export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group border-line bg-card rounded-card flex h-full flex-col border p-8",
        "transition-[border-color,transform] duration-400 ease-[var(--ease-editorial)]",
        "hover:border-navy/25 hover:-translate-y-0.5",
        className,
      )}
    >
      <p className="text-eyebrow text-muted uppercase">{product.badge}</p>

      <h3 className="font-display text-display-sm text-navy mt-4">
        {product.name}
      </h3>

      <p className="text-body mt-3 mb-8 text-sm">{product.summary}</p>

      <div className="mt-auto space-y-5">
        <RiskMeter risk={product.risk} />

        <dl className="text-muted flex gap-2 text-xs">
          <dt>Liquidity</dt>
          <dd className="text-body">{LIQUIDITY_LABELS[product.liquidity]}</dd>
        </dl>

        <div className="border-line flex items-center justify-between border-t pt-5">
          <span className="text-muted text-xs">
            {product.minInvestment ? "From " : ""}
            <span className="text-navy font-semibold">
              {formatMinimum(product.minInvestment)}
            </span>
          </span>

          <ArrowRight
            aria-hidden
            strokeWidth={1.75}
            className="text-muted group-hover:text-navy size-4 transition-all duration-400 ease-[var(--ease-editorial)] group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
