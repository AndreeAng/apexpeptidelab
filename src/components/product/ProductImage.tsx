"use client";

import { useState } from "react";
import Image from "next/image";
import { FlaskConical } from "lucide-react";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  size?: number;
  className?: string;
};

export function ProductImage({ product, size = 280, className }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 ${className || ""}`}
        style={{ width: size, height: size }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${product.accentColor}15` }}
        >
          <FlaskConical size={36} style={{ color: product.accentColor }} />
        </div>
        <span className="text-white/25 text-sm">Foto próximamente</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <Image
        src={product.image}
        alt={product.name}
        width={size}
        height={size}
        sizes="(max-width: 768px) 100vw, 50vw"
        quality={85}
        onError={() => setErrored(true)}
        className="object-contain"
      />
    </div>
  );
}
