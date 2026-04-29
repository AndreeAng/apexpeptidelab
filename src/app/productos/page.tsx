import Link from "next/link";
import { getPublicProducts } from "@/lib/dal/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ShieldCheck, Truck } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/AnimateIn";

export const metadata = {
  title: "Catálogo de Péptidos de Investigación Bolivia",
  description:
    "Comprar péptidos de investigación en Bolivia. BPC-157, GHK-Cu, CJC-1295, Retatrutide, Wolverine y más. Pureza 99%+, certificado de análisis. Envío a Santa Cruz, La Paz, Cochabamba y todo el país.",
  alternates: {
    canonical: "https://www.apexpeptidelab.shop/productos",
  },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const products = await getPublicProducts();
  const { categoria } = await searchParams;

  const activeCategory =
    typeof categoria === "string" ? categoria : undefined;

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="px-5 md:px-8 lg:px-12 pt-14 pb-10 border-b border-border-subtle max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
            Catálogo
          </div>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            Compuestos disponibles
          </h1>
          <p className="text-white/55 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
            Péptidos con 99%+ de pureza, certificado de análisis en cada lote
            y envío seguro a toda Bolivia.
          </p>
        </FadeIn>
      </header>

      {/* Category filters */}
      <div className="px-5 md:px-8 lg:px-12 pt-8 pb-2 max-w-7xl mx-auto">
        <FadeIn delay={0.05}>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/productos"
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ${
                !activeCategory
                  ? "bg-lime/15 text-lime border-lime/30"
                  : "text-white/50 border-white/10 hover:border-white/20"
              }`}
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/productos?categoria=${encodeURIComponent(cat)}`}
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ${
                  activeCategory === cat
                    ? "bg-lime/15 text-lime border-lime/30"
                    : "text-white/50 border-white/10 hover:border-white/20"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Product grid */}
      <div className="px-5 md:px-8 lg:px-12 py-10 md:py-14 max-w-7xl mx-auto">
        <FadeInStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((p) => (
            <FadeInStaggerItem key={p.slug}>
              <ProductCard product={p} />
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>

      {/* Trust banners */}
      <div className="px-5 md:px-8 lg:px-12 pb-14 max-w-7xl mx-auto">
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FadeInStaggerItem>
            <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 flex items-start gap-4 hover:border-lime/25 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center flex-shrink-0">
                <Truck size={20} className="text-lime" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium mb-1">
                  Envíos a toda Bolivia
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Envío seguro y confiable a todas las ciudades del país. Tu pedido
                  llega protegido y discreto.
                </p>
              </div>
            </div>
          </FadeInStaggerItem>
          <FadeInStaggerItem>
            <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 flex items-start gap-4 hover:border-lime/25 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-lime" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium mb-1">
                  Atención personalizada
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Asesoría directa por WhatsApp para resolver todas tus consultas
                  sobre nuestros productos.
                </p>
              </div>
            </div>
          </FadeInStaggerItem>
        </FadeInStagger>
      </div>

      {/* Terms */}
      <div className="px-5 md:px-8 lg:px-12 pb-14 max-w-7xl mx-auto">
        <FadeIn delay={0.1}>
          <div className="bg-surface-deep border border-border-subtle rounded-xl p-6">
            <h3 className="text-lime text-[11px] uppercase tracking-widest font-medium mb-3">
              Términos de venta
            </h3>
            <p className="text-white/45 text-xs leading-relaxed max-w-2xl">
              Al realizar una compra, el comprador certifica ser un profesional
              calificado o investigador autorizado. Todas las ventas son finales.
              El comprador asume total responsabilidad por el manejo, uso y
              almacenamiento conforme a la ley aplicable.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
