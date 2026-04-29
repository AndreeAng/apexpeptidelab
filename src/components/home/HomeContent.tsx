"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { HomeFAQ } from "@/components/home/FAQ";
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleIn } from "@/components/ui/AnimateIn";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FlaskConical,
  FileCheck,
  Truck,
  Beaker,
  Users,
  Package,
  BadgeCheck,
  Microscope,
  Atom,
  ArrowRight,
} from "lucide-react";

type Props = {
  products: Product[];
};

export default function HomeContent({ products }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative px-5 md:px-8 pt-16 md:pt-24 pb-16 md:pb-20 max-w-7xl mx-auto hero-glow rounded-b-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime/25 bg-lime-soft mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              <span className="text-lime text-[11px] font-medium tracking-wide">
                99%+ pureza · CoA en cada lote
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="text-white text-4xl md:text-5xl lg:text-[56px] font-medium tracking-tight leading-[1.08] mb-5"
              style={{ letterSpacing: "-0.5px" }}
            >
              Péptidos de{" "}
              <span className="bg-gradient-to-r from-lime to-lime/70 bg-clip-text text-transparent">
                investigación
              </span>
              , sin atajos.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-white/55 text-base md:text-lg leading-relaxed max-w-lg mb-8"
            >
              Compuestos de grado farmacéutico con certificado de análisis en cada lote.
              Pureza verificada y envío seguro a toda Bolivia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/productos"
                className="group bg-lime text-navy px-7 py-3.5 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-lime/20 transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97]"
              >
                Ver catálogo
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calidad"
                className="border border-lime/30 text-lime px-7 py-3.5 rounded-full text-sm font-medium hover:border-lime hover:bg-lime/5 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                Nuestra calidad
              </Link>
            </motion.div>
          </div>

          {/* Hero visual — product showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="hidden md:flex justify-center md:justify-end"
            aria-hidden="true"
          >
            <div className="relative w-[340px] h-[420px]">
              {/* Glow background */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-product-glow/8 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-product-cjc/8 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-lime/5 blur-2xl" />
              </div>

              {/* Product vial cards stacked */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Back card — CJC */}
                  <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.7, rotate: 6 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    className="absolute top-4 right-4 w-[150px] bg-navy-deep border border-product-cjc/25 rounded-xl p-4 hover:border-product-cjc/50 transition-colors duration-300"
                  >
                    <div className="text-center">
                      <div className="text-lime text-xs font-medium">apex</div>
                      <div className="text-lime/60 text-[8px]">peptide lab</div>
                    </div>
                    <div className="text-white text-sm font-medium text-center mt-3">CJC + Ipa</div>
                    <div className="h-1.5 mt-2 rounded-sm" style={{ background: "linear-gradient(90deg, #e6b54a, #002852)" }} />
                    <div className="text-white/40 text-[8px] text-center mt-2 italic">5mg/5mg</div>
                  </motion.div>

                  {/* Middle card — GHK-Cu */}
                  <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.8, rotate: -3 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="absolute top-16 left-2 w-[155px] bg-navy-deep border border-product-ghk/25 rounded-xl p-4 hover:border-product-ghk/50 transition-colors duration-300"
                  >
                    <div className="text-center">
                      <div className="text-lime text-xs font-medium">apex</div>
                      <div className="text-lime/60 text-[8px]">peptide lab</div>
                    </div>
                    <div className="text-white text-sm font-medium text-center mt-3">GHK-Cu</div>
                    <div className="h-1.5 mt-2 rounded-sm" style={{ background: "linear-gradient(90deg, #cb6120, #002852)" }} />
                    <div className="text-white/40 text-[8px] text-center mt-2 italic">50mg</div>
                  </motion.div>

                  {/* Front card — Glow (main) */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[200px] bg-navy-deep border border-product-glow/30 rounded-xl p-5 shadow-2xl shadow-product-glow/10 z-10 hover:shadow-product-glow/20 hover:border-product-glow/50 transition-all duration-500"
                  >
                    <div className="text-center mb-1">
                      <div className="text-lime text-sm font-medium">apex</div>
                      <div className="text-lime/60 text-[9px]">peptide lab</div>
                    </div>
                    <div className="text-white text-xl font-medium text-center mt-4">Glow</div>
                    <div className="h-2 mt-3 rounded-sm" style={{ background: "linear-gradient(90deg, #009bdb, #002852)" }} />
                    <div className="text-white text-[10px] text-center mt-1.5 font-medium">TB 10mg+BPC-157 10mg+GHK-CU 50mg</div>
                    <div className="text-white/40 text-[9px] text-center mt-3 italic">For Subcutaneous Use Only · Multiple Dose Vial</div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-mono text-lime text-xs">99.2%</span>
                      <span className="text-white font-medium text-sm">Bs 1.500</span>
                    </div>
                  </motion.div>

                  {/* GLP-3 floating */}
                  <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.7, rotate: 3 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="absolute bottom-4 right-0 w-[130px] bg-navy-deep border border-product-glp3/25 rounded-xl p-3 hover:border-product-glp3/50 transition-colors duration-300"
                  >
                    <div className="text-center">
                      <div className="text-lime text-[10px] font-medium">apex</div>
                      <div className="text-lime/60 text-[7px]">peptide lab</div>
                    </div>
                    <div className="text-white text-xs font-medium text-center mt-2">GLP-3</div>
                    <div className="h-1 mt-1.5 rounded-sm" style={{ background: "linear-gradient(90deg, #c03689, #002852)" }} />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-navy-deep border-y border-lime/10">
        <FadeInStagger className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {[
              { value: "99%+", label: "Pureza verificada", icon: ShieldCheck },
              { value: "Lab", label: "Testeo independiente", icon: FlaskConical },
              { value: "CoA", label: "Certificado incluido", icon: FileCheck },
              { value: "24-48h", label: "Envío a Bolivia", icon: Truck },
            ].map((item) => (
              <FadeInStaggerItem key={item.label}>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center flex-shrink-0 group-hover:bg-lime/20 transition-colors duration-300">
                    <item.icon size={24} className="text-lime" />
                  </div>
                  <div>
                    <div className="text-lime font-mono text-lg md:text-xl font-medium">
                      {item.value}
                    </div>
                    <div className="text-white/50 text-sm">{item.label}</div>
                  </div>
                </div>
              </FadeInStaggerItem>
            ))}
          </div>
        </FadeInStagger>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <FadeIn>
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-2">
                Catálogo
              </div>
              <h2 className="text-white text-2xl md:text-3xl font-medium tracking-tight">
                Nuestros compuestos
              </h2>
            </div>
            <Link
              href="/productos"
              className="hidden md:flex text-lime text-sm hover:underline items-center gap-1 cursor-pointer group"
            >
              Ver todos <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </FadeIn>
        <FadeInStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => (
            <FadeInStaggerItem key={p.slug}>
              <ProductCard product={p} />
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
        <div className="mt-6 md:hidden text-center">
          <Link
            href="/productos"
            className="text-lime text-sm hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Ver todos los productos <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Quality pillars */}
      <section className="bg-navy-deep border-y border-lime/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">
          <FadeIn className="text-center mb-10">
            <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-2">
              Garantía
            </div>
            <h2 className="text-white text-2xl md:text-3xl font-medium tracking-tight">
              Calidad verificable
            </h2>
          </FadeIn>
          <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                icon: BadgeCheck,
                title: "Pureza verificada",
                text: "Cada lote es analizado por laboratorio independiente para confirmar identidad y pureza superior al 99%.",
              },
              {
                icon: Package,
                title: "Protección de envío",
                text: "Embalaje especializado con protección térmica y discreción total. Envío seguro a todas las ciudades de Bolivia.",
              },
              {
                icon: FileCheck,
                title: "CoA en cada lote",
                text: "Certificado de análisis disponible para cada producto, documentando pureza, identidad y condiciones de almacenamiento.",
              },
            ].map((pillar) => (
              <FadeInStaggerItem key={pillar.title}>
                <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 hover:border-lime/30 transition-colors duration-300 h-full">
                  <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center mb-4">
                    <pillar.icon size={20} className="text-lime" />
                  </div>
                  <h3 className="text-white text-sm font-medium mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Why apex — redesigned as alternating layout */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <FadeIn className="text-center mb-10">
          <h2 className="text-white text-2xl md:text-3xl font-medium tracking-tight">
            ¿Por qué{" "}
            <span className="bg-gradient-to-r from-lime to-lime/60 bg-clip-text text-transparent">
              apex
            </span>
            ?
          </h2>
        </FadeIn>
        <FadeInStagger className="grid grid-cols-2 md:grid-cols-3 gap-4" stagger={0.06}>
          {[
            { icon: Package, title: "Stock disponible", text: "Productos listos para envío inmediato." },
            { icon: Users, title: "Volumen B2B", text: "Precios especiales para clínicas y profesionales." },
            { icon: Truck, title: "Envío nacional", text: "Cobertura a todas las ciudades de Bolivia." },
            { icon: Beaker, title: "99%+ pureza", text: "Cada lote verificado por laboratorio independiente." },
            { icon: Microscope, title: "Grado profesional", text: "Material de referencia de alta calidad." },
            { icon: Atom, title: "Documentación", text: "CoA y especificaciones técnicas incluidas." },
          ].map((item) => (
            <FadeInStaggerItem key={item.title}>
              <div className="group bg-surface-raised border border-border-subtle rounded-xl p-5 hover:border-lime/25 transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-lime/10 flex items-center justify-center mb-3 group-hover:bg-lime/15 transition-colors duration-300">
                  <item.icon size={18} className="text-lime" />
                </div>
                <h3 className="text-white text-sm font-medium mb-1">
                  {item.title}
                </h3>
                <p className="text-white/45 text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </section>

      {/* FAQ */}
      <section className="bg-navy-deep border-y border-lime/10">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-14 md:py-20">
          <FadeIn className="text-center mb-10">
            <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-2">
              FAQ
            </div>
            <h2 className="text-white text-2xl md:text-3xl font-medium tracking-tight">
              Preguntas frecuentes
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <HomeFAQ />
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <ScaleIn>
          <div className="relative overflow-hidden bg-surface-raised border border-border-default rounded-2xl p-8 md:p-14 text-center">
            {/* Decorative glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-lime/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-product-glow/5 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-lime/[0.02] blur-3xl pointer-events-none" />

            <div className="relative">
              <h2 className="text-white text-2xl md:text-3xl font-medium tracking-tight mb-3">
                Comienza hoy
              </h2>
              <p className="text-white/55 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Péptidos de grado farmacéutico con documentación completa y envío
                seguro a toda Bolivia.
              </p>
              <Link
                href="/productos"
                className="group bg-lime text-navy px-8 py-3.5 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-lime/20 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer active:scale-[0.97]"
              >
                Ver catálogo
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </ScaleIn>
      </section>
    </div>
  );
}
