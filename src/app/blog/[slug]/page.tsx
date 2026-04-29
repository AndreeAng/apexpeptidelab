import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles } from "@/data/blog";
import { FadeIn } from "@/components/ui/AnimateIn";
import { ShareButton } from "./ShareButton";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      url: `https://www.apexpeptidelab.shop/blog/${article.slug}`,
      siteName: "Apex Peptide Lab",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      canonical: `https://www.apexpeptidelab.shop/blog/${article.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.apexpeptidelab.shop",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.apexpeptidelab.shop/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://www.apexpeptidelab.shop/blog/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <FadeIn>
          <Link
            href="/blog"
            className="text-lime text-sm hover:underline inline-flex items-center gap-1 mb-8"
          >
            ← Volver al blog
          </Link>
        </FadeIn>

        {/* Article header */}
        <FadeIn>
          <header className="mb-10">
            <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
              {article.category}
            </div>
            <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <span>
                {new Date(article.date).toLocaleDateString("es-BO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>·</span>
              <span>{article.readTime} de lectura</span>
            </div>
          </header>
        </FadeIn>

        {/* Article content */}
        <FadeIn delay={0.1}>
          <div
            className="prose prose-invert prose-lime max-w-none
              prose-headings:text-white prose-headings:font-medium
              prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-white/70 prose-li:leading-relaxed
              prose-strong:text-white prose-strong:font-medium
              prose-ul:my-4 prose-ul:pl-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </FadeIn>

        {/* Share button */}
        <FadeIn delay={0.15}>
          <div className="mt-12 pt-6 border-t border-border-subtle">
            <ShareButton slug={article.slug} />
          </div>
        </FadeIn>

        {/* Related products */}
        {article.relatedProducts.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="mt-10 pt-6 border-t border-border-subtle">
              <h3 className="text-white text-lg font-medium mb-4">
                Productos relacionados
              </h3>
              <div className="flex flex-wrap gap-3">
                {article.relatedProducts.map((productSlug) => (
                  <Link
                    key={productSlug}
                    href={`/productos/${productSlug}`}
                    className="bg-surface-raised border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-white/70 hover:text-lime hover:border-lime/25 transition-colors duration-200"
                  >
                    Ver producto →
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </>
  );
}

