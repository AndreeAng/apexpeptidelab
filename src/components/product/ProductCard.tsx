"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatBs } from "@/lib/format";
import type { Product } from "@/data/products";
import { ShoppingBag, FlaskConical } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group bg-surface-raised border border-border-subtle rounded-xl overflow-hidden hover:border-lime/30 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lime/[0.04] transition-all duration-500 ease-out">
      <Link href={`/productos/${product.slug}`} className="block cursor-pointer">
        {/* Product image */}
        <div className="relative aspect-square bg-navy-deep overflow-hidden">
          {product.image && !imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={85}
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${product.accentColor}15` }}
              >
                <FlaskConical size={28} style={{ color: product.accentColor }} />
              </div>
              <span className="text-white/30 text-xs">Foto próximamente</span>
            </div>
          )}

          {/* Accent gradient overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: product.accentColor }}
          />

          {/* Purity badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <span className="font-mono text-lime text-[11px] font-medium">
              {product.purity}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
            {product.category}
          </div>
          <h3 className="text-white text-base font-medium leading-snug">
            {product.shortName}
          </h3>
          <div className="text-white/50 text-xs">{product.doseLabel}</div>
          <div className="pt-1">
            <span className="text-lime font-mono text-lg font-medium">
              Bs {formatBs(product.priceBs)}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          aria-label={`Agregar ${product.name} al carrito`}
          className="w-full bg-lime/10 hover:bg-lime hover:text-navy text-lime text-xs font-medium py-2.5 rounded-full border border-lime/25 hover:border-lime transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.97]"
        >
          <ShoppingBag size={13} />
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
