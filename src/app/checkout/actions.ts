"use server";

import { createOrder } from "@/lib/dal/orders";
import type { OrderItem } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { sendAdminNewOrderEmail, sendCustomerConfirmationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function createOrderAction(formData: {
  nombre: string;
  apellido: string;
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
  // Rate limit: max 5 orders per 10 minutes
  const rl = rateLimit("checkout", 5, 10 * 60 * 1000);
  if (!rl.ok) return { ok: false as const, error: "Demasiados pedidos. Intenta en unos minutos." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = await createOrder({
    userId: user?.id,
    customerName: `${formData.nombre} ${formData.apellido}`,
    customerPhone: formData.whatsapp,
    customerAddress: formData.direccion,
    customerCity: formData.ciudad,
    notes: formData.notas,
    items: formData.items,
    subtotal: formData.subtotal,
    discount: formData.discount,
    couponCode: formData.couponCode,
    total: formData.total,
  });

  if (!result) return { ok: false as const, error: "Error al crear la orden" };

  // Send email notifications (fire-and-forget, don't block checkout)
  const emailData = {
    orderNumber: result.orderNumber,
    customerName: `${formData.nombre} ${formData.apellido}`,
    customerPhone: formData.whatsapp,
    customerCity: formData.ciudad,
    customerAddress: formData.direccion,
    items: formData.items,
    subtotal: formData.subtotal,
    discount: formData.discount,
    couponCode: formData.couponCode,
    total: formData.total,
  };

  // Admin notification
  sendAdminNewOrderEmail(emailData).catch(() => {});

  // Customer confirmation (only if logged in with email)
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

    // Check expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { ok: false as const, error: "Este cupón ha expirado" };
    }

    // Check usage limit
    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return { ok: false as const, error: "Este cupón ya alcanzó su límite de uso" };
    }

    // Check minimum order
    if (coupon.min_order !== null && subtotal < coupon.min_order) {
      return {
        ok: false as const,
        error: `El pedido mínimo para este cupón es Bs ${coupon.min_order}`,
      };
    }

    // Calculate discount
    let discount: number;
    if (coupon.type === "percentage") {
      discount = Math.round((subtotal * coupon.value) / 100 * 100) / 100;
    } else {
      discount = coupon.value;
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
