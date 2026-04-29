import {
  Dna,
  Activity,
  Bone,
  Zap,
  TrendingDown,
  Beaker,
  ShieldCheck,
  Sparkles,
  Layers,
  Atom,
  Target,
  Combine,
} from "lucide-react";
import type { Product } from "@/data/products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  Dna,
  Activity,
  Bone,
  Zap,
  TrendingDown,
  Beaker,
  ShieldCheck,
  Sparkles,
  Layers,
  Atom,
  Target,
  Combine,
};

export function ProductBenefits({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {product.benefits.map((benefit) => {
        const Icon = iconMap[benefit.icon] || Zap;
        return (
          <div
            key={benefit.title}
            className="bg-surface-raised border border-border-subtle rounded-lg p-5"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${product.accentColor}20` }}
              >
                <Icon
                  size={18}
                  style={{ color: product.accentColor }}
                />
              </div>
              <div>
                <h4 className="text-white text-sm font-medium mb-1">
                  {benefit.title}
                </h4>
                <p className="text-white/55 text-xs leading-relaxed">
                  {benefit.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
