import { getProductById } from "@/lib/dal/products";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Editar producto</h1>
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
