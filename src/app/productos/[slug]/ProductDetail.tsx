"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatBs } from "@/lib/format";
import { buildProductInquiryMessage } from "@/lib/whatsapp";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductBenefits } from "@/components/product/ProductBenefits";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/data/products";
import {
  ShoppingBag,
  ShieldCheck,
  FileCheck,
  Truck,
  FlaskConical,
  ChevronRight,
  MessageCircle,
  Package,
  Phone,
  Thermometer,
  CheckCircle,
  Info,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleIn } from "@/components/ui/AnimateIn";

type Props = {
  product: Product;
  related: Product[];
};

export function ProductDetail({ product, related }: Props) {
  const addItem = useCart((s) => s.addItem);
  const whatsappNumber = "59172201700";

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-6 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/" className="hover:text-lime transition-colors cursor-pointer">
            Inicio
          </Link>
          <ChevronRight size={12} />
          <Link href="/productos" className="hover:text-lime transition-colors cursor-pointer">
            Catálogo
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/70">{product.name}</span>
        </nav>
      </div>

      {/* Product hero */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center justify-center bg-surface-raised border border-border-subtle rounded-xl p-8 md:p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                background: `radial-gradient(circle at 30% 50%, ${product.accentColor}, transparent 70%)`,
              }}
            />
            <ProductImage product={product} size={280} />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-5">
            {/* Category badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider"
              style={{
                backgroundColor: `${product.accentColor}18`,
                color: product.accentColor,
                border: `1px solid ${product.accentColor}30`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: product.accentColor }}
              />
              {product.category}
            </div>

            <h1 className="text-white text-3xl md:text-4xl font-medium tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Composition */}
            <div className="font-mono text-xs text-white/40 bg-surface-raised border border-border-subtle rounded-lg px-3 py-2 inline-block">
              {product.composition}
            </div>

            <div className="text-lime font-mono text-2xl font-medium">
              Bs {formatBs(product.priceBs)}
            </div>

            <p className="text-white/60 text-sm leading-relaxed max-w-lg">
              {product.description}
            </p>

            {/* Add to cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addItem(product)}
                className="flex-1 bg-lime text-navy px-8 py-3.5 rounded-full text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={16} />
                Agregar al carrito
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa el ${product.name}. ¿Podrían darme más información?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-whatsapp/40 text-whatsapp px-6 py-3.5 rounded-full text-sm font-medium hover:bg-whatsapp/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} />
                Consultar
              </a>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <ShieldCheck size={14} className="text-lime flex-shrink-0" />
                <span>{product.purity} pureza</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <FlaskConical size={14} className="text-lime flex-shrink-0" />
                <span>Lab verificado</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <FileCheck size={14} className="text-lime flex-shrink-0" />
                <span>CoA incluido</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <Truck size={14} className="text-lime flex-shrink-0" />
                <span>Envío 24-48h</span>
              </div>
            </div>

            {/* In stock indicator */}
            {product.inStock && (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400/80">En stock · Envío inmediato</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Highlights — key selling points */}
      {product.highlights && product.highlights.length > 0 && (
        <FadeIn className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
          <div
            className="rounded-xl border p-6 md:p-8"
            style={{
              backgroundColor: `${product.accentColor}06`,
              borderColor: `${product.accentColor}20`,
            }}
          >
            <h2 className="text-white text-lg font-medium mb-5 flex items-center gap-2">
              <CheckCircle size={18} style={{ color: product.accentColor }} />
              ¿Por qué elegir {product.shortName}?
            </h2>
            <ul className="space-y-3">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-mono font-medium"
                    style={{
                      backgroundColor: `${product.accentColor}20`,
                      color: product.accentColor,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-white/70 leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      )}

      {/* Benefits — research areas */}
      <FadeIn className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <h2 className="text-white text-xl md:text-2xl font-medium mb-6">
          Aspectos estudiados
        </h2>
        <ProductBenefits product={product} />
      </FadeIn>

      {/* Specs table */}
      {product.specs && product.specs.length > 0 && (
        <FadeIn className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
          <h2 className="text-white text-xl md:text-2xl font-medium mb-6">
            Especificaciones técnicas
          </h2>
          <div className="bg-surface-raised border border-border-subtle rounded-xl overflow-hidden">
            {product.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                  i < product.specs.length - 1 ? "border-b border-border-subtle" : ""
                }`}
              >
                <span className="text-white/50">{spec.label}</span>
                <span className="text-white font-medium font-mono text-xs">{spec.value}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Storage */}
      <FadeIn className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 flex items-start gap-3">
          <Thermometer size={16} className="text-lime flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white text-sm font-medium mb-1">Almacenamiento</h3>
            <p className="text-white/55 text-xs leading-relaxed">
              {product.storage}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Long description */}
      {product.longDescription && (
        <FadeIn className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8">
            <h2 className="text-lime text-[11px] uppercase tracking-widest font-medium mb-4">
              Descripción detallada
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-3xl">
              {product.longDescription}
            </p>
          </div>
        </FadeIn>
      )}

      {/* How to order */}
      <section className="bg-navy-deep border-y border-lime/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
          <FadeIn className="text-center mb-8">
            <h2 className="text-white text-xl md:text-2xl font-medium">
              ¿Cómo lo obtengo?
            </h2>
          </FadeIn>
          <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: Package,
                title: "Realizas tu pedido",
                text: "Agrega productos al carrito y completa tus datos de envío.",
              },
              {
                icon: Phone,
                title: "Te contactamos",
                text: "Coordinamos pago y detalles por WhatsApp de forma directa.",
              },
              {
                icon: Truck,
                title: "Lo enviamos a tu ciudad",
                text: "Envío seguro, discreto y con protección térmica a toda Bolivia.",
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center relative"
              >
                <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center mx-auto mb-3">
                  <step.icon size={18} className="text-lime" />
                </div>
                <div className="text-lime font-mono text-[10px] mb-1">
                  Paso {i + 1}
                </div>
                <h3 className="text-white text-sm font-medium mb-1.5">
                  {step.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* B2B */}
      <ScaleIn className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <div
          className="rounded-xl p-6 md:p-8 border"
          style={{
            backgroundColor: `${product.accentColor}08`,
            borderColor: `${product.accentColor}25`,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div
                className="text-[10px] uppercase tracking-widest font-medium mb-2"
                style={{ color: product.accentColor }}
              >
                B2B · Mayoristas
              </div>
              <h3 className="text-white text-lg font-medium mb-1">
                ¿Tienes clínica, spa o negocio?
              </h3>
              <p className="text-white/50 text-sm">
                Precios mayoristas, asesor dedicado y envíos prioritarios.
              </p>
            </div>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildProductInquiryMessage(product.name))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp hover:bg-whatsapp-hover text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer flex-shrink-0 active:scale-[0.97]"
            >
              <MessageCircle size={16} />
              Más información
            </a>
          </div>
        </div>
      </ScaleIn>

      {/* FAQ */}
      {product.faqs.length > 0 && (
        <FadeIn className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
          <h2 className="text-white text-xl md:text-2xl font-medium mb-6">
            Preguntas frecuentes
          </h2>
          <Accordion.Root type="single" collapsible className="space-y-2">
            {product.faqs.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`faq-${i}`}
                className="bg-surface-raised border border-border-subtle rounded-lg overflow-hidden"
              >
                <Accordion.Trigger className="w-full px-5 py-4 text-left text-white text-sm font-medium hover:text-lime transition-colors flex items-center justify-between gap-3 cursor-pointer group">
                  <span>{faq.q}</span>
                  <ChevronRight
                    size={14}
                    className="text-white/30 group-data-[state=open]:rotate-90 transition-transform duration-200 flex-shrink-0"
                  />
                </Accordion.Trigger>
                <Accordion.Content className="px-5 pb-4 text-white/55 text-sm leading-relaxed data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                  {faq.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </FadeIn>
      )}

      {/* Research disclaimer */}
      <FadeIn className="max-w-7xl mx-auto px-5 md:px-8 pb-10">
        <div className="bg-surface-raised border border-border-subtle rounded-lg p-4 flex items-start gap-3">
          <Info size={14} className="text-white/30 flex-shrink-0 mt-0.5" />
          <p className="text-white/30 text-[11px] leading-relaxed">
            <span className="text-white/50 font-medium">Solo para investigación.</span>{" "}
            Este producto se vende exclusivamente como material de referencia para
            investigación, laboratorio y educación. No apto para consumo humano ni
            uso terapéutico.
          </p>
        </div>
      </FadeIn>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-navy/95 backdrop-blur-md border-t border-lime/15 px-4 py-3 z-20">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{product.shortName}</div>
            <div className="text-lime font-mono text-sm">Bs {formatBs(product.priceBs)}</div>
          </div>
          <button
            onClick={() => addItem(product)}
            className="bg-lime text-navy px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-transform flex-shrink-0"
          >
            <ShoppingBag size={14} />
            Agregar
          </button>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-20 md:pb-14">
          <FadeIn>
            <h2 className="text-white text-xl md:text-2xl font-medium mb-6">
              Otros productos
            </h2>
          </FadeIn>
          <FadeInStagger className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {related.slice(0, 3).map((p) => (
              <FadeInStaggerItem key={p.slug}>
                <ProductCard product={p} />
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      )}
    </div>
  );
}
