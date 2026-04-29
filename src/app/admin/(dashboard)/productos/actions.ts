"use server";

import { toggleStock, toggleOffer, deleteProduct, createProduct, updateProduct } from "@/lib/dal/products";
import { uploadProductImage } from "@/lib/supabase/storage";
import { revalidatePath } from "next/cache";
import type { Product } from "@/data/products";

export async function toggleStockAction(id: string, inStock: boolean) {
  return toggleStock(id, inStock);
}

export async function toggleOfferAction(id: string, isOffer: boolean, offerPrice?: number) {
  return toggleOffer(id, isOffer, offerPrice);
}

export async function deleteProductAction(id: string) {
  return deleteProduct(id);
}

function parseJsonArray(value: string | null): unknown[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export async function createProductAction(data: FormData) {
  const name = data.get("name") as string;
  const priceBs = parseFloat(data.get("priceBs") as string);
  if (!name || !name.trim()) return { success: false, error: "El nombre es obligatorio" };
  if (!priceBs || priceBs <= 0) return { success: false, error: "El precio debe ser mayor a 0" };

  let imageUrl = "";
  const imageFile = data.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadProductImage(imageFile);
    if ("error" in result) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const productData: Partial<Product> = {
    name,
    slug: data.get("slug") as string,
    shortName: data.get("shortName") as string,
    composition: data.get("composition") as string,
    doseLabel: data.get("doseLabel") as string,
    category: data.get("category") as string,
    accentColor: data.get("accentColor") as string,
    description: data.get("description") as string,
    longDescription: (data.get("longDescription") as string) || undefined,
    storage: data.get("storage") as string,
    purity: data.get("purity") as string,
    priceBs: parseFloat(data.get("priceBs") as string) || 0,
    isOffer: data.get("isOffer") === "true",
    offerPriceBs: data.get("offerPriceBs") ? parseFloat(data.get("offerPriceBs") as string) : undefined,
    inStock: data.get("inStock") === "true",
    sortOrder: parseInt(data.get("sortOrder") as string) || 0,
    image: imageUrl,
    highlights: parseJsonArray(data.get("highlights") as string) as string[],
    benefits: parseJsonArray(data.get("benefits") as string) as { icon: string; title: string; text: string }[],
    specs: parseJsonArray(data.get("specs") as string) as { label: string; value: string }[],
    faqs: parseJsonArray(data.get("faqs") as string) as { q: string; a: string }[],
  };

  const result = await createProduct(productData);
  if (!result) return { success: false, error: "Error al crear el producto" };
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  return { success: true };
}

export async function updateProductAction(id: string, data: FormData) {
  const name = data.get("name") as string;
  const priceBs = parseFloat(data.get("priceBs") as string);
  if (!name || !name.trim()) return { success: false, error: "El nombre es obligatorio" };
  if (!priceBs || priceBs <= 0) return { success: false, error: "El precio debe ser mayor a 0" };

  let imageUrl: string | undefined;
  const imageFile = data.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadProductImage(imageFile);
    if ("error" in result) return { success: false, error: result.error };
    imageUrl = result.url;
  }

  const productData: Partial<Product> = {
    name: data.get("name") as string,
    slug: data.get("slug") as string,
    shortName: data.get("shortName") as string,
    composition: data.get("composition") as string,
    doseLabel: data.get("doseLabel") as string,
    category: data.get("category") as string,
    accentColor: data.get("accentColor") as string,
    description: data.get("description") as string,
    longDescription: (data.get("longDescription") as string) || undefined,
    storage: data.get("storage") as string,
    purity: data.get("purity") as string,
    priceBs: parseFloat(data.get("priceBs") as string) || 0,
    isOffer: data.get("isOffer") === "true",
    offerPriceBs: data.get("offerPriceBs") ? parseFloat(data.get("offerPriceBs") as string) : undefined,
    inStock: data.get("inStock") === "true",
    sortOrder: parseInt(data.get("sortOrder") as string) || 0,
    highlights: parseJsonArray(data.get("highlights") as string) as string[],
    benefits: parseJsonArray(data.get("benefits") as string) as { icon: string; title: string; text: string }[],
    specs: parseJsonArray(data.get("specs") as string) as { label: string; value: string }[],
    faqs: parseJsonArray(data.get("faqs") as string) as { q: string; a: string }[],
  };

  if (imageUrl) {
    productData.image = imageUrl;
  }

  const result = await updateProduct(id, productData);
  if (!result) return { success: false, error: "Error al actualizar el producto" };
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  return { success: true };
}
