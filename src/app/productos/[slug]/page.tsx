import { notFound } from "next/navigation";
import { getProductBySlug, getPublicProducts } from "@/lib/dal/products";
import { ProductDetail } from "./ProductDetail";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — apex peptide lab`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getPublicProducts();
  const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  return <ProductDetail product={product} related={related} />;
}
