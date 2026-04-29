"use client";

import { useCart } from "@/store/cart";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatBs } from "@/lib/format";
import { useEffect } from "react";

export function CartSidebar() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal);
  const itemCount = useCart((s) => s.itemCount);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-navy z-50 flex flex-col border-l border-lime/20"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 border-b border-lime/15">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-lime" />
                <span className="text-white text-[11px] font-medium tracking-widest uppercase">
                  Tu carrito
                </span>
                {itemCount() > 0 && (
                  <span className="bg-lime-soft text-lime text-xs px-2 py-0.5 rounded-full font-medium">
                    {itemCount()}
                  </span>
                )}
              </div>
              <button
                onClick={close}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </header>

            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
                <ShoppingBag size={32} className="text-lime/30" />
                <p className="text-white/50 text-sm">Tu carrito está vacío</p>
                <Link
                  href="/productos"
                  onClick={close}
                  className="text-lime text-sm hover:underline cursor-pointer"
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.slug}
                      className="flex gap-3 p-3 bg-black/20 border border-lime/10 rounded-lg group"
                    >
                      {/* Accent bar */}
                      <div
                        className="w-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: product.accentColor }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-white text-sm font-medium truncate">
                              {product.name}
                            </div>
                            <div className="text-white/45 text-xs">
                              {product.doseLabel}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(product.slug)}
                            className="text-white/30 hover:text-red-400 transition-colors cursor-pointer p-1 -m-1 rounded"
                            aria-label={`Eliminar ${product.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                updateQuantity(product.slug, quantity - 1)
                              }
                              className="w-6 h-6 rounded border border-lime/25 flex items-center justify-center text-lime/70 hover:border-lime hover:text-lime transition-colors cursor-pointer"
                              aria-label="Reducir cantidad"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-white text-xs font-mono w-5 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(product.slug, quantity + 1)
                              }
                              className="w-6 h-6 rounded border border-lime/25 flex items-center justify-center text-lime/70 hover:border-lime hover:text-lime transition-colors cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-lime font-mono text-sm">
                            Bs {formatBs(product.priceBs * quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <footer className="px-5 py-4 bg-black/25 border-t border-lime/15">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">
                      Bs {formatBs(subtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mb-3">
                    <span>Envío</span>
                    <span>A coordinar</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block bg-lime text-navy text-center py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Pagar y recibir
                  </Link>
                  <p className="text-center text-[10px] text-white/35 mt-2.5 italic">
                    Research use only
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
