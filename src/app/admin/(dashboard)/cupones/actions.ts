"use server";

import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
} from "@/lib/dal/coupons";
import { revalidatePath } from "next/cache";

export async function createCouponAction(formData: FormData) {
  const code = (formData.get("code") as string).toUpperCase().trim();
  const type = formData.get("type") as "percentage" | "fixed";
  const value = parseFloat(formData.get("value") as string);
  const minOrder = formData.get("minOrder")
    ? parseFloat(formData.get("minOrder") as string)
    : undefined;
  const maxUses = formData.get("maxUses")
    ? parseInt(formData.get("maxUses") as string, 10)
    : undefined;
  const expiresAt = (formData.get("expiresAt") as string) || undefined;

  await createCoupon({ code, type, value, minOrder, maxUses, expiresAt });
  revalidatePath("/admin/cupones");
}

export async function updateCouponAction(id: string, formData: FormData) {
  const code = (formData.get("code") as string).toUpperCase().trim();
  const type = formData.get("type") as "percentage" | "fixed";
  const value = parseFloat(formData.get("value") as string);
  const minOrderStr = formData.get("minOrder") as string;
  const maxUsesStr = formData.get("maxUses") as string;
  const expiresAt = (formData.get("expiresAt") as string) || null;

  await updateCoupon(id, {
    code,
    type,
    value,
    minOrder: minOrderStr ? parseFloat(minOrderStr) : null,
    maxUses: maxUsesStr ? parseInt(maxUsesStr, 10) : null,
    expiresAt,
  });
  revalidatePath("/admin/cupones");
}

export async function deleteCouponAction(id: string) {
  await deleteCoupon(id);
  revalidatePath("/admin/cupones");
}

export async function toggleCouponActiveAction(id: string, isActive: boolean) {
  await toggleCouponActive(id, isActive);
  revalidatePath("/admin/cupones");
}
