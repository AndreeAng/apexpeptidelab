import { createClient } from "@/lib/supabase/server";
import type { DbCoupon } from "@/lib/supabase/types";

/** Get all coupons ordered by created_at desc. */
export async function getCoupons(): Promise<DbCoupon[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as DbCoupon[];
  } catch {
    return [];
  }
}

/** Get a single coupon by ID. */
export async function getCouponById(id: string): Promise<DbCoupon | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as DbCoupon;
  } catch {
    return null;
  }
}

/** Create a new coupon. */
export async function createCoupon(data: {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder?: number;
  maxUses?: number;
  expiresAt?: string;
}): Promise<DbCoupon | null> {
  try {
    const supabase = await createClient();
    const { data: created, error } = await supabase
      .from("coupons")
      .insert({
        code: data.code,
        type: data.type,
        value: data.value,
        min_order: data.minOrder ?? null,
        max_uses: data.maxUses ?? null,
        expires_at: data.expiresAt ?? null,
      })
      .select("*")
      .single();

    if (error || !created) return null;
    return created as DbCoupon;
  } catch {
    return null;
  }
}

/** Update a coupon by ID. */
export async function updateCoupon(
  id: string,
  data: Partial<{
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minOrder: number | null;
    maxUses: number | null;
    expiresAt: string | null;
    isActive: boolean;
  }>,
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const updates: Record<string, unknown> = {};
    if (data.code !== undefined) updates.code = data.code;
    if (data.type !== undefined) updates.type = data.type;
    if (data.value !== undefined) updates.value = data.value;
    if (data.minOrder !== undefined) updates.min_order = data.minOrder;
    if (data.maxUses !== undefined) updates.max_uses = data.maxUses;
    if (data.expiresAt !== undefined) updates.expires_at = data.expiresAt;
    if (data.isActive !== undefined) updates.is_active = data.isActive;

    const { error } = await supabase
      .from("coupons")
      .update(updates)
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}

/** Delete a coupon by ID. */
export async function deleteCoupon(id: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}

/** Toggle the active status of a coupon. */
export async function toggleCouponActive(
  id: string,
  isActive: boolean,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: isActive })
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}

/** Increment used_count for a coupon (called after a successful order). */
export async function incrementCouponUsage(code: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    // 1. Fetch coupon by code
    const { data: coupon, error: fetchError } = await supabase
      .from("coupons")
      .select("id, used_count")
      .eq("code", code)
      .single();

    if (fetchError || !coupon) return false;

    // 2. Update used_count = used_count + 1
    const { error: updateError } = await supabase
      .from("coupons")
      .update({ used_count: coupon.used_count + 1 })
      .eq("id", coupon.id);

    return !updateError;
  } catch {
    return false;
  }
}
