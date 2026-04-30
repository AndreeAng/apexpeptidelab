import type { Product } from "@/data/products";

// ============================================================
// Database row types (match SQL columns exactly, snake_case)
// ============================================================

export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  composition: string | null;
  dose_label: string | null;
  category: string | null;
  accent_color: string;
  description: string | null;
  long_description: string | null;
  highlights: string[];
  benefits: { icon: string; title: string; text: string }[];
  specs: { label: string; value: string }[];
  storage: string | null;
  purity: string | null;
  price_bs: number;
  image: string | null;
  in_stock: boolean;
  is_offer: boolean;
  offer_price_bs: number | null;
  faqs: { q: string; a: string }[];
  sort_order: number;
  created_at: string;
}

export interface DbOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_ci: string | null;
  customer_address: string | null;
  customer_city: string | null;
  notes: string | null;
  admin_notes: string | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  coupon_code: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface DbCoupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbProfile {
  id: string;
  role: "user" | "admin";
  name: string | null;
  last_name: string | null;
  phone: string | null;
  ci: string | null;
  email: string | null;
  addresses: unknown[];
  created_at: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  doseLabel: string;
  quantity: number;
  priceUnit: number;
  priceTotal: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CouponType = "percentage" | "fixed";

// ============================================================
// Mapper functions
// ============================================================

/** Converts a snake_case DB product row to the camelCase Product type used by the frontend. */
export function dbProductToProduct(db: DbProduct): Product {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    shortName: db.short_name ?? "",
    composition: db.composition ?? "",
    doseLabel: db.dose_label ?? "",
    category: db.category ?? "",
    accentColor: db.accent_color,
    description: db.description ?? "",
    longDescription: db.long_description ?? undefined,
    highlights: db.highlights ?? [],
    benefits: db.benefits ?? [],
    specs: db.specs ?? [],
    storage: db.storage ?? "",
    purity: db.purity ?? "",
    priceBs: db.price_bs,
    image: db.image ?? "",
    inStock: db.in_stock,
    isOffer: db.is_offer,
    offerPriceBs: db.offer_price_bs ?? undefined,
    sortOrder: db.sort_order,
    faqs: db.faqs ?? [],
    // Fields that exist on Product but not in DB — provide defaults
    research: [],
    vialNote: "",
  };
}

/** Converts a camelCase Product (or partial) back to snake_case for DB inserts/updates. */
export function productToDbProduct(
  p: Partial<Product>,
): Partial<DbProduct> {
  const result: Partial<DbProduct> = {};

  if (p.id !== undefined) result.id = p.id;
  if (p.slug !== undefined) result.slug = p.slug;
  if (p.name !== undefined) result.name = p.name;
  if (p.shortName !== undefined) result.short_name = p.shortName;
  if (p.composition !== undefined) result.composition = p.composition;
  if (p.doseLabel !== undefined) result.dose_label = p.doseLabel;
  if (p.category !== undefined) result.category = p.category;
  if (p.accentColor !== undefined) result.accent_color = p.accentColor;
  if (p.description !== undefined) result.description = p.description;
  if (p.longDescription !== undefined)
    result.long_description = p.longDescription;
  if (p.highlights !== undefined) result.highlights = p.highlights;
  if (p.benefits !== undefined) result.benefits = p.benefits;
  if (p.specs !== undefined) result.specs = p.specs;
  if (p.storage !== undefined) result.storage = p.storage;
  if (p.purity !== undefined) result.purity = p.purity;
  if (p.priceBs !== undefined) result.price_bs = p.priceBs;
  if (p.image !== undefined) result.image = p.image;
  if (p.inStock !== undefined) result.in_stock = p.inStock;
  if (p.isOffer !== undefined) result.is_offer = p.isOffer;
  if (p.offerPriceBs !== undefined) result.offer_price_bs = p.offerPriceBs;
  if (p.faqs !== undefined) result.faqs = p.faqs;
  if (p.sortOrder !== undefined) result.sort_order = p.sortOrder;

  return result;
}
