import { createClient } from "@/lib/supabase/server";
import { dbProductToProduct, productToDbProduct } from "@/lib/supabase/types";
import type { DbProduct } from "@/lib/supabase/types";
import type { Product } from "@/data/products";

/** Fetch all products ordered by sort_order, then created_at. */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    return (data as DbProduct[]).map(dbProductToProduct);
  } catch {
    return [];
  }
}

/** Fetch all in-stock products (for public pages). */
export async function getPublicProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    return (data as DbProduct[]).map(dbProductToProduct);
  } catch {
    return [];
  }
}

/** Fetch a single product by slug. */
export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return dbProductToProduct(data as DbProduct);
  } catch {
    return null;
  }
}

/** Fetch a single product by ID (for admin). */
export async function getProductById(
  id: string,
): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return dbProductToProduct(data as DbProduct);
  } catch {
    return null;
  }
}

/** Create a new product, returns the created product. */
export async function createProduct(
  data: Partial<Product>,
): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const dbData = productToDbProduct(data);
    const { data: created, error } = await supabase
      .from("products")
      .insert(dbData)
      .select()
      .single();

    if (error || !created) return null;
    return dbProductToProduct(created as DbProduct);
  } catch {
    return null;
  }
}

/** Update a product by ID. */
export async function updateProduct(
  id: string,
  data: Partial<Product>,
): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const dbData = productToDbProduct(data);
    const { data: updated, error } = await supabase
      .from("products")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) return null;
    return dbProductToProduct(updated as DbProduct);
  } catch {
    return null;
  }
}

/** Delete a product by ID. */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}

/** Toggle stock status. */
export async function toggleStock(
  id: string,
  inStock: boolean,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .update({ in_stock: inStock })
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}

/** Toggle offer status with optional offer price. */
export async function toggleOffer(
  id: string,
  isOffer: boolean,
  offerPriceBs?: number,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const updateData: { is_offer: boolean; offer_price_bs?: number | null } = {
      is_offer: isOffer,
    };

    if (isOffer && offerPriceBs !== undefined) {
      updateData.offer_price_bs = offerPriceBs;
    } else if (!isOffer) {
      updateData.offer_price_bs = null;
    }

    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}
