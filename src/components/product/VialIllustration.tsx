"use client";

import type { Product } from "@/data/products";
import { VialLabel } from "./VialLabel";

type Props = {
  product: Product;
  size?: number;
};

export function VialIllustration({ product, size = 200 }: Props) {
  const vialW = size * 0.55;
  const vialH = size;
  const capH = size * 0.12;
  const neckH = size * 0.08;
  const bodyH = size - capH - neckH;
  const liquidH = bodyH * 0.45;
  const borderRadius = vialW * 0.12;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: vialW, height: vialH }}
    >
      {/* Cap */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 rounded-t-md"
        style={{
          width: vialW * 0.55,
          height: capH,
          backgroundColor: "#0a1830",
        }}
      />

      {/* Neck */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: capH,
          width: vialW * 0.35,
          height: neckH,
          backgroundColor: "#1a3060",
        }}
      />

      {/* Body */}
      <div
        className="absolute left-0 overflow-hidden"
        style={{
          top: capH + neckH,
          width: vialW,
          height: bodyH,
          backgroundColor: "#FAF8F3",
          borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
        }}
      >
        {/* Liquid */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: liquidH,
            backgroundColor: product.accentColor,
            opacity: 0.2,
          }}
        />

        {/* Reflection */}
        <div
          className="absolute top-2 left-1 bottom-2 rounded-full"
          style={{
            width: vialW * 0.06,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))",
          }}
        />

        {/* Label centered on body */}
        <div className="absolute inset-0 flex items-center justify-center">
          <VialLabel
            product={product}
            size={size > 160 ? "md" : "sm"}
          />
        </div>
      </div>
    </div>
  );
}
