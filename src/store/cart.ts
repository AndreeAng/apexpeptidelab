import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartItem = { product: Product; quantity: number };

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (product) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.product.slug === product.slug
          );
          if (existing)
            return {
              items: s.items.map((i) =>
                i.product.slug === product.slug
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              isOpen: true,
            };
          return {
            items: [...s.items, { product, quantity: 1 }],
            isOpen: true,
          };
        }),
      removeItem: (slug) =>
        set((s) => ({
          items: s.items.filter((i) => i.product.slug !== slug),
        })),
      updateQuantity: (slug, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.product.slug !== slug)
              : s.items.map((i) =>
                  i.product.slug === slug ? { ...i, quantity: qty } : i
                ),
        })),
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.priceBs * i.quantity,
          0
        ),
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "apex-cart" }
  )
);
