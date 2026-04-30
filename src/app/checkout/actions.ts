"use server";

import { createOrder } from "@/lib/dal/orders";
import { incrementCouponUsage } from "@/lib/dal/coupons";
import type { OrderItem } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { sendAdminNewOrderEmail, sendCustomerConfirmationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function createOrderAction(formData: {
  nombre: string;
  apellido: string;
  ci: string;
  whatsapp: string;
  direccion: string;
  ciudad: string;
  notas?: string;
  couponCode?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
}) {
  // Rate limit per phone number
  const rl = rateLimit(`checkout:${formData.whatsapp}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return { ok: false as const, error: "Demasiados pedidos. Intenta en unos minutos." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Re-validate coupon server-side and recompute discount/total
  let discount = 0;
  let total = formData.subtotal;

  if (formData.couponCode) {
    const couponResult = await validateCouponAction(
      formData.couponCode,
      formData.subtotal,
    );
    if (couponResult.ok) {
      discount = couponResult.discount;
      total = Math.max(0, formData.subtotal - discount);
    }
    // If coupon is no longer valid, proceed without discount
  }

  const result = await createOrder({
    userId: user?.id,
    customerName: `${formData.nombre} ${formData.apellido}`,
    customerPhone: formData.whatsapp,
    customerCi: formData.ci,
    customerAddress: formData.direccion,
    customerCity: formData.ciudad,
    notes: formData.notas,
    items: formData.items,
    subtotal: formData.subtotal,
    discount,
    couponCode: discount > 0 ? formData.couponCode : undefined,
    total,
  });

  if (!result) return { ok: false as const, error: "Error al crear la orden" };

  // Increment coupon usage after successful order
  if (formData.couponCode && discount > 0) {
    incrementCouponUsage(formData.couponCode).catch(() => {});
  }

  // Send email notifications (fire-and-forget)
  const emailData = {
    orderNumber: result.orderNumber,
    customerName: `${formData.nombre} ${formData.apellido}`,
    customerPhone: formData.whatsapp,
    customerCity: formData.ciudad,
    customerAddress: formData.direccion,
    items: formData.items,
    subtotal: formData.subtotal,
    discount,
    couponCode: formData.couponCode,
    total,
  };

  sendAdminNewOrderEmail(emailData).catch(() => {});

  if (user?.email) {
    sendCustomerConfirmationEmail(user.email, emailData).catch(() => {});
  }

  return {
    ok: true as const,
    orderNumber: result.orderNumber,
    orderId: result.id,
  };
}

export async function validateCouponAction(code: string, subtotal: number) {
  try {
    const supabase = await createClient();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return { ok: false as const, error: "Cupón no encontrado o inválido" };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { ok: false as const, error: "Este cupón ha expirado" };
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return { ok: false as const, error: "Este cupón ya alcanzó su límite de uso" };
    }

    if (coupon.min_order !== null && subtotal < coupon.min_order) {
      return {
        ok: false as const,
        error: `El pedido mínimo para este cupón es Bs ${coupon.min_order}`,
      };
    }

    let discount: number;
    if (coupon.type === "percentage") {
      discount = Math.round((subtotal * coupon.value) / 100 * 100) / 100;
    } else {
      // Cap fixed discount to subtotal to prevent negative totals
      discount = Math.min(coupon.value, subtotal);
    }

    return {
      ok: true as const,
      discount,
      type: coupon.type as string,
      value: coupon.value as number,
    };
  } catch {
    return { ok: false as const, error: "Error al validar el cupón" };
  }
}
