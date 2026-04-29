import { ProductForm } from "@/components/admin/products/ProductForm";

export default function NuevoProductoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Nuevo producto</h1>
      <ProductForm mode="create" />
    </div>
  );
}
