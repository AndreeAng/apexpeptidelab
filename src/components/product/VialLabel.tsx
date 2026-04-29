"use client";

import type { Product } from "@/data/products";

type VialLabelProps = {
  product: Product;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { w: 64, h: 80, logo: 8, name: 9, dose: 7, note: 6, bar: 3, stripe: 3 },
  md: { w: 140, h: 175, logo: 11, name: 14, dose: 9, note: 7, bar: 5, stripe: 4 },
  lg: { w: 240, h: 300, logo: 14, name: 20, dose: 11, note: 9, bar: 7, stripe: 6 },
};

export function VialLabel({ product, size = "md" }: VialLabelProps) {
  const s = sizes[size];

  return (
    <div
      className="relative overflow-hidden rounded-sm select-none"
      style={{
        width: s.w,
        height: s.h,
        backgroundColor: "#002852",
      }}
    >
      {/* Accent stripe left */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: s.stripe,
          backgroundColor: product.accentColor,
        }}
      />

      <div
        className="flex flex-col items-center justify-between h-full"
        style={{ paddingLeft: s.stripe + 4, paddingRight: 4, paddingTop: s.h * 0.08, paddingBottom: s.h * 0.06 }}
      >
        {/* Logo */}
        <div className="text-center">
          <div
            className="font-semibold leading-none"
            style={{ color: "#b8ca60", fontSize: s.logo }}
          >
            apex
          </div>
          <div
            className="leading-none mt-0.5"
            style={{ color: "#b8ca60", fontSize: s.logo * 0.7 }}
          >
            peptide lab
          </div>
        </div>

        {/* Product name */}
        <div
          className="font-semibold text-white text-center leading-tight"
          style={{ fontSize: s.name }}
        >
          {product.shortName}
        </div>

        {/* Gradient bar with dose */}
        <div className="w-full px-1">
          <div
            className="rounded-sm flex items-center justify-center"
            style={{
              height: s.bar * 4,
              background: `linear-gradient(90deg, ${product.accentColor}, #002852)`,
            }}
          >
            <span
              className="text-white font-medium"
              style={{ fontSize: s.dose }}
            >
              {product.doseLabel}
            </span>
          </div>
        </div>

        {/* Vial note */}
        <div
          className="text-white/70 italic text-center leading-tight"
          style={{ fontSize: s.note }}
        >
          For Subcutaneous Use Only
          <br />
          Multiple Dose Vial
        </div>
      </div>
    </div>
  );
}
