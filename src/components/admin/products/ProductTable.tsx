"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { toggleStockAction, toggleOfferAction, deleteProductAction } from "@/app/admin/(dashboard)/productos/actions";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-lg border border-lime/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-lime/10 bg-black/20">
            <th className="px-4 py-3 text-left text-white/60 font-medium">Imagen</th>
            <th className="px-4 py-3 text-left text-white/60 font-medium">Nombre</th>
            <th className="px-4 py-3 text-left text-white/60 font-medium">Precio</th>
            <th className="px-4 py-3 text-center text-white/60 font-medium">Stock</th>
            <th className="px-4 py-3 text-center text-white/60 font-medium">Oferta</th>
            <th className="px-4 py-3 text-right text-white/60 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} onMutation={() => router.refresh()} />
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                No hay productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({ product, onMutation }: { product: Product; onMutation: () => void }) {
  const [stockLoading, setStockLoading] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerPrice, setOfferPrice] = useState(product.offerPriceBs?.toString() || "");

  async function handleToggleStock() {
    setStockLoading(true);
    await toggleStockAction(product.id!, !product.inStock);
    setStockLoading(false);
    onMutation();
  }

  async function handleToggleOffer() {
    setOfferLoading(true);
    const newIsOffer = !product.isOffer;
    const price = newIsOffer ? parseFloat(offerPrice) || undefined : undefined;
    await toggleOfferAction(product.id!, newIsOffer, price);
    setOfferLoading(false);
    onMutation();
  }

  async function handleOfferPriceBlur() {
    if (product.isOffer) {
      const price = parseFloat(offerPrice) || 0;
      await toggleOfferAction(product.id!, true, price);
      onMutation();
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return;
    await deleteProductAction(product.id!);
    onMutation();
  }

  return (
    <tr className="border-b border-lime/5 hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={40}
            height={40}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white/20 text-xs">
            —
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-white font-medium">{product.name}</td>
      <td className="px-4 py-3 text-white/80">{product.priceBs} Bs</td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={handleToggleStock}
          disabled={stockLoading}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            product.inStock ? "bg-lime/60" : "bg-white/10"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              product.inStock ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleToggleOffer}
            disabled={offerLoading}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              product.isOffer ? "bg-lime/60" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                product.isOffer ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          {product.isOffer && (
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              onBlur={handleOfferPriceBlur}
              className="w-20 px-2 py-1 text-xs bg-black/30 border border-lime/20 rounded text-white"
              placeholder="Precio"
            />
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/productos/${product.id}`}
            className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white/70 transition-colors"
          >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-xs bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 text-red-400 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
