import { notFound } from "next/navigation";
import { getProductBySlug, getPublicProducts } from "@/lib/dal/products";
import { ProductDetail } from "./ProductDetail";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} — Comprar en Bolivia | Apex Peptide Lab`;
  const description = product.description || `${product.name} — péptido de investigación con ${product.purity} de pureza. Envío a Santa Cruz, La Paz, Cochabamba y toda Bolivia.`;
  const url = `https://www.apexpeptidelab.shop/productos/${product.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "apex peptide lab",
      type: "website",
      locale: "es_BO",
      ...(product.image ? { images: [{ url: product.image, width: 800, height: 800, alt: product.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(product.image ? { images: [product.image] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getPublicProducts();
  const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://www.apexpeptidelab.shop" },
          { name: "Productos", url: "https://www.apexpeptidelab.shop/productos" },
          { name: product.name, url: `https://www.apexpeptidelab.shop/productos/${product.slug}` },
        ]}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}
