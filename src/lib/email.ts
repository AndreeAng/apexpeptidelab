import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "noreply@apexpeptidelab.shop";
const ADMIN_EMAIL = process.env.RESEND_TO_EMAIL || "";
const LOGO_URL = "https://www.apexpeptidelab.shop/apex-logo.png";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "re_xxxxxxxxxxxx") return null;
  return new Resend(key);
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerCi?: string;
  customerCity: string;
  customerAddress: string;
  items: { name: string; quantity: number; priceUnit: number; priceTotal: number }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
}

/** Notify admin of a new order */
export async function sendAdminNewOrderEmail(data: OrderEmailData) {
  const resend = getResend();
  if (!resend || !ADMIN_EMAIL) return;

  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:10px 16px;border-bottom:1px solid #1a2744;color:#e2e8f0;font-size:13px;">${i.name}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #1a2744;color:#e2e8f0;font-size:13px;text-align:center;">${i.quantity}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #1a2744;color:#e2e8f0;font-size:13px;text-align:right;">Bs ${i.priceUnit.toFixed(2)}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #1a2744;color:#ffffff;font-size:13px;text-align:right;font-weight:600;">Bs ${i.priceTotal.toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#070e1b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">

    <!-- Logo -->
    <div style="text-align:center;padding:24px 0 20px;">
      <img src="${LOGO_URL}" alt="Apex Peptide Lab" width="180" style="max-width:180px;height:auto;" />
    </div>

    <!-- Main card -->
    <div style="background:#0f1f38;border:1px solid #1e3050;border-radius:16px;overflow:hidden;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#b8ca60,#9aaf3f);padding:20px 28px;">
        <table style="width:100%;">
          <tr>
            <td>
              <div style="font-size:11px;color:#0a1628;text-transform:uppercase;letter-spacing:2px;font-weight:600;opacity:0.7;">Nuevo pedido</div>
              <div style="font-size:22px;color:#0a1628;font-weight:700;margin-top:2px;">${data.orderNumber}</div>
            </td>
            <td style="text-align:right;vertical-align:bottom;">
              <div style="font-size:24px;color:#0a1628;font-weight:700;">Bs ${data.total.toFixed(2)}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Customer -->
      <div style="padding:24px 28px;border-bottom:1px solid #1a2744;">
        <div style="font-size:11px;color:#b8ca60;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin-bottom:14px;">Datos del cliente</div>
        <table style="width:100%;">
          <tr>
            <td style="padding:5px 0;color:#7a8599;font-size:13px;width:90px;vertical-align:top;">Nombre</td>
            <td style="padding:5px 0;color:#ffffff;font-size:13px;font-weight:500;">${data.customerName}</td>
          </tr>
          ${data.customerCi ? `<tr>
            <td style="padding:5px 0;color:#7a8599;font-size:13px;vertical-align:top;">CI</td>
            <td style="padding:5px 0;color:#ffffff;font-size:13px;font-weight:500;">${data.customerCi}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:5px 0;color:#7a8599;font-size:13px;vertical-align:top;">WhatsApp</td>
            <td style="padding:5px 0;color:#ffffff;font-size:13px;font-weight:500;">${data.customerPhone}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#7a8599;font-size:13px;vertical-align:top;">Ciudad</td>
            <td style="padding:5px 0;color:#ffffff;font-size:13px;font-weight:500;">${data.customerCity}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#7a8599;font-size:13px;vertical-align:top;">Dirección</td>
            <td style="padding:5px 0;color:#ffffff;font-size:13px;font-weight:500;">${data.customerAddress}</td>
          </tr>
        </table>
      </div>

      <!-- Products -->
      <div style="padding:24px 28px;border-bottom:1px solid #1a2744;">
        <div style="font-size:11px;color:#b8ca60;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin-bottom:14px;">Productos</div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:8px 16px;text-align:left;color:#7a8599;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a2744;">Producto</th>
              <th style="padding:8px 16px;text-align:center;color:#7a8599;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a2744;">Cant.</th>
              <th style="padding:8px 16px;text-align:right;color:#7a8599;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a2744;">P. Unit.</th>
              <th style="padding:8px 16px;text-align:right;color:#7a8599;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a2744;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="padding:20px 28px;background:#0a1628;">
        <table style="width:100%;">
          <tr>
            <td style="padding:4px 0;color:#7a8599;font-size:13px;">Subtotal</td>
            <td style="padding:4px 0;color:#c8d0dc;font-size:13px;text-align:right;">Bs ${data.subtotal.toFixed(2)}</td>
          </tr>
          ${data.discount > 0 ? `<tr>
            <td style="padding:4px 0;color:#7a8599;font-size:13px;">Descuento${data.couponCode ? ` (${data.couponCode})` : ""}</td>
            <td style="padding:4px 0;color:#ef4444;font-size:13px;text-align:right;">-Bs ${data.discount.toFixed(2)}</td>
          </tr>` : ""}
          <tr>
            <td colspan="2" style="padding:0;"><div style="border-top:1px solid #1a2744;margin:8px 0;"></div></td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#ffffff;font-size:16px;font-weight:700;">Total</td>
            <td style="padding:4px 0;color:#b8ca60;font-size:16px;font-weight:700;text-align:right;">Bs ${data.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="padding:20px 28px;text-align:center;border-top:1px solid #1a2744;">
        <a href="https://www.apexpeptidelab.shop/admin/pedidos" style="display:inline-block;background:#b8ca60;color:#0a1628;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">
          Ver pedido en admin
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px 0 8px;">
      <p style="color:#4a5568;font-size:11px;margin:0;">
        Este email fue generado automáticamente por apexpeptidelab.shop
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: `Apex Peptide Lab <${FROM}>`,
      to: ADMIN_EMAIL,
      subject: `Nuevo pedido ${data.orderNumber} — Bs ${data.total.toFixed(2)}`,
      html,
    });
    console.log("[Email] Send result:", JSON.stringify(result));
  } catch (err) {
    console.error("[Email] Failed to send admin email:", err);
  }
}
