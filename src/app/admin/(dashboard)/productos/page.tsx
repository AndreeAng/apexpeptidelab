import Link from "next/link";
import { getProducts } from "@/lib/dal/products";
import { ProductTable } from "@/components/admin/products/ProductTable";

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="px-4 py-2 bg-lime/20 border border-lime/30 rounded-lg text-lime text-sm font-medium hover:bg-lime/30 transition-colors"
        >
          Nuevo producto
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
