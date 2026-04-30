"use server";

import { getOrdersByDateRange } from "@/lib/dal/analytics";

export async function exportOrdersCSVAction(from: string, to: string) {
  const orders = await getOrdersByDateRange(from, to);

  function esc(val: string) {
    return `"${val.replace(/"/g, '""')}"`;
  }

  const headers = ["Pedido", "Cliente", "CI", "Teléfono", "Ciudad", "Dirección", "Subtotal", "Descuento", "Cupón", "Total", "Estado", "Fecha"];
  const rows = orders.map((o) => [
    esc(o.order_number),
    esc(o.customer_name),
    esc(o.customer_ci ?? ""),
    esc(o.customer_phone),
    esc(o.customer_city ?? ""),
    esc(o.customer_address ?? ""),
    o.subtotal.toFixed(2),
    o.discount.toFixed(2),
    esc(o.coupon_code ?? ""),
    o.total.toFixed(2),
    esc(o.status),
    esc(new Date(o.created_at).toLocaleDateString("es-BO")),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  return { csv, count: orders.length };
}
