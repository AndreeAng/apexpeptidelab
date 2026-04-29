import Link from "next/link";
import { blogArticles } from "@/data/blog";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/AnimateIn";

export const metadata = {
  title: "Blog — Artículos sobre Péptidos de Investigación",
  description:
    "Artículos educativos sobre péptidos de investigación: BPC-157, GHK-Cu, CJC-1295, almacenamiento, calidad y más. Información para investigadores en Bolivia.",
  keywords: [
    "blog péptidos",
    "péptidos Bolivia",
    "BPC-157 información",
    "GHK-Cu beneficios",
    "almacenar péptidos",
    "certificado de análisis",
    "péptidos investigación Bolivia",
  ],
  alternates: {
    canonical: "https://www.apexpeptidelab.shop/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <header className="pb-10">
        <FadeIn>
          <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
            Blog
          </div>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            Artículos y guías
          </h1>
          <p className="text-white/55 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
            Información científica, guías prácticas y todo lo que necesitas saber
            sobre péptidos de investigación en Bolivia.
          </p>
        </FadeIn>
      </header>

      <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogArticles.map((article) => (
          <FadeInStaggerItem key={article.slug}>
            <Link href={`/blog/${article.slug}`} className="block h-full">
              <article className="bg-surface-raised border border-border-subtle rounded-xl p-6 hover:border-lime/25 transition-colors duration-300 h-full flex flex-col">
                <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
                  {article.category}
                </div>
                <h2 className="text-white text-lg font-medium leading-snug mb-2">
                  {article.title}
                </h2>
                <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-white/40 pt-3 border-t border-border-subtle">
                  <span>
                    {new Date(article.date).toLocaleDateString("es-BO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>{article.readTime} de lectura</span>
                </div>
                <span className="text-lime text-sm mt-3 hover:underline">
                  Leer más →
                </span>
              </article>
            </Link>
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>
    </div>
  );
}
