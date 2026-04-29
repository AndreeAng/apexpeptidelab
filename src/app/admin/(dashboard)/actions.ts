"use server";

import { getOrdersByDateRange } from "@/lib/dal/analytics";

export async function exportOrdersCSVAction(from: string, to: string) {
  const orders = await getOrdersByDateRange(from, to);

  const headers = ["Pedido", "Cliente", "Teléfono", "Ciudad", "Subtotal", "Descuento", "Cupón", "Total", "Estado", "Fecha"];
  const rows = orders.map((o) => [
    o.order_number,
    `"${o.customer_name.replace(/"/g, '""')}"`,
    o.customer_phone,
    o.customer_city ?? "",
    o.subtotal.toFixed(2),
    o.discount.toFixed(2),
    o.coupon_code ?? "",
    o.total.toFixed(2),
    o.status,
    new Date(o.created_at).toLocaleDateString("es-BO"),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  return { csv, count: orders.length };
}
