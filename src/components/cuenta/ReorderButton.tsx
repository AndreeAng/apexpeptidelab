"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import type { OrderItem } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/data/products";
import { dbProductToProduct } from "@/lib/supabase/types";

interface ReorderButtonProps {
  items: OrderItem[];
}

export function ReorderButton({ items }: ReorderButtonProps) {
  const [loading, setLoading] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  async function handleReorder() {
    setLoading(true);
    try {
      const supabase = createClient();

      // Fetch all products that match the order items
      const productIds = items.map((item) => item.productId);
      const { data: dbProducts } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      // Also try matching by slug (older orders might have slug as productId)
      const { data: dbProductsBySlugs } = await supabase
        .from("products")
        .select("*")
        .in("slug", productIds);

      const allProducts = [
        ...(dbProducts ?? []),
        ...(dbProductsBySlugs ?? []),
      ];

      // Dedupe by id
      const productMap = new Map<string, Product>();
      for (const dbp of allProducts) {
        const product = dbProductToProduct(dbp);
        productMap.set(dbp.id, product);
        productMap.set(dbp.slug, product);
      }

      // Add items to cart
      let added = 0;
      for (const item of items) {
        const product = productMap.get(item.productId);
        if (product && product.inStock) {
          for (let i = 0; i < item.quantity; i++) {
            addItem(product);
          }
          added++;
        }
      }

      if (added > 0) {
        router.push("/checkout");
      } else {
        alert("Los productos de este pedido ya no están disponibles.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleReorder}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-lime/10 text-lime border border-lime/20 rounded-lg hover:bg-lime/20 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      Volver a pedir
    </button>
  );
}
