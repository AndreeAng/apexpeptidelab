import type { CartItem } from "@/store/cart";
import { formatBs } from "./format";

type CustomerData = {
  nombre: string;
  apellido: string;
  ci?: string;
  whatsapp: string;
  direccion: string;
  ciudad: string;
  notas?: string;
};

export function buildWhatsAppMessage({
  customer,
  items,
  total,
  orderNumber,
  discount,
  couponCode,
  subtotal,
}: {
  customer: CustomerData;
  items: CartItem[];
  total: number;
  orderNumber?: string;
  discount?: number;
  couponCode?: string;
  subtotal?: number;
}) {
  const computedSubtotal =
    subtotal ?? items.reduce((sum, i) => sum + i.product.priceBs * i.quantity, 0);

  const lines: (string | null)[] = [
    `────────────────────`,
    `  *APEX PEPTIDE LAB*`,
    orderNumber ? `  Orden #${orderNumber}` : `  _Orden de compra_`,
    `────────────────────`,
    ``,
    `*DATOS DEL CLIENTE*`,
    `Nombre: ${customer.nombre} ${customer.apellido}`,
    customer.ci ? `CI: ${customer.ci}` : null,
    `Tel: ${customer.whatsapp}`,
    `Ciudad: ${customer.ciudad}`,
    `Dirección: ${customer.direccion}`,
    customer.notas ? `Notas: ${customer.notas}` : null,
    ``,
    `────────────────────`,
    `*DETALLE DEL PEDIDO*`,
    `────────────────────`,
    ``,
    ...items.map(
      ({ product, quantity }) =>
        `• ${product.name} (${product.doseLabel}) x${quantity} — Bs ${formatBs(product.priceBs * quantity)}`,
    ),
    ``,
    `────────────────────`,
    `Subtotal: Bs ${formatBs(computedSubtotal)}`,
    discount && discount > 0 && couponCode
      ? `Descuento (${couponCode}): -Bs ${formatBs(discount)}`
      : discount && discount > 0
        ? `Descuento: -Bs ${formatBs(discount)}`
        : null,
    `*TOTAL: Bs ${formatBs(total)}*`,
    `────────────────────`,
    ``,
    `_apexpeptidelab.shop_`,
  ];

  return lines.filter((l) => l !== null).join("\n");
}

export function buildProductInquiryMessage(productName: string) {
  return `Hola, tengo un negocio y me interesa el ${productName}. ¿Podrían enviarme información sobre precios mayoristas?`;
}
