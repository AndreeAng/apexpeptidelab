import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "noreply@apexpeptidelab.shop";
const ADMIN_EMAIL = process.env.RESEND_TO_EMAIL || "";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "re_xxxxxxxxxxxx") return null;
  return new Resend(key);
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
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
  console.log("[Email] Attempting to send admin email. Resend:", !!resend, "ADMIN_EMAIL:", ADMIN_EMAIL, "FROM:", FROM, "API_KEY starts with:", process.env.RESEND_API_KEY?.slice(0, 8));
  if (!resend || !ADMIN_EMAIL) {
    console.log("[Email] Skipped — resend:", !!resend, "adminEmail:", !!ADMIN_EMAIL);
    return;
  }

  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #1a2744;color:#c8d0dc;">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #1a2744;color:#c8d0dc;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #1a2744;color:#c8d0dc;text-align:right;">Bs ${i.priceTotal.toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="background:#0a1628;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#0f1f38;border:1px solid #1a2744;border-radius:12px;overflow:hidden;">

        <div style="background:#b8ca60;padding:16px 24px;">
          <h1 style="margin:0;font-size:16px;color:#0a1628;font-weight:600;">Nuevo pedido ${data.orderNumber}</h1>
        </div>

        <div style="padding:24px;">
          <h2 style="margin:0 0 16px;font-size:14px;color:#b8ca60;text-transform:uppercase;letter-spacing:1px;">Cliente</h2>
          <table style="width:100%;margin-bottom:24px;">
            <tr>
              <td style="padding:4px 0;color:#7a8599;font-size:13px;width:100px;">Nombre</td>
              <td style="padding:4px 0;color:#e2e8f0;font-size:13px;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#7a8599;font-size:13px;">WhatsApp</td>
              <td style="padding:4px 0;color:#e2e8f0;font-size:13px;">${data.customerPhone}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#7a8599;font-size:13px;">Ciudad</td>
              <td style="padding:4px 0;color:#e2e8f0;font-size:13px;">${data.customerCity}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#7a8599;font-size:13px;">Dirección</td>
              <td style="padding:4px 0;color:#e2e8f0;font-size:13px;">${data.customerAddress}</td>
            </tr>
          </table>

          <h2 style="margin:0 0 12px;font-size:14px;color:#b8ca60;text-transform:uppercase;letter-spacing:1px;">Productos</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <thead>
              <tr style="border-bottom:2px solid #1a2744;">
                <th style="padding:8px 12px;text-align:left;color:#7a8599;font-size:11px;text-transform:uppercase;">Producto</th>
                <th style="padding:8px 12px;text-align:center;color:#7a8599;font-size:11px;text-transform:uppercase;">Cant.</th>
                <th style="padding:8px 12px;text-align:right;color:#7a8599;font-size:11px;text-transform:uppercase;">Precio</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <div style="background:#0a1628;border-radius:8px;padding:16px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span style="color:#7a8599;font-size:13px;">Subtotal</span>
              <span style="color:#c8d0dc;font-size:13px;">Bs ${data.subtotal.toFixed(2)}</span>
            </div>
            ${data.discount > 0 ? `
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span style="color:#7a8599;font-size:13px;">Descuento${data.couponCode ? ` (${data.couponCode})` : ""}</span>
              <span style="color:#ef4444;font-size:13px;">-Bs ${data.discount.toFixed(2)}</span>
            </div>` : ""}
            <div style="border-top:1px solid #1a2744;margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;">
              <span style="color:#e2e8f0;font-size:15px;font-weight:600;">Total</span>
              <span style="color:#b8ca60;font-size:15px;font-weight:600;">Bs ${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style="padding:16px 24px;background:#0a1628;border-top:1px solid #1a2744;text-align:center;">
          <a href="https://www.apexpeptidelab.shop/admin/pedidos" style="color:#b8ca60;font-size:13px;text-decoration:none;">
            Ver en el panel de admin →
          </a>
        </div>
      </div>
    </div>
  `;

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

/** Send order confirmation to customer */
export async function sendCustomerConfirmationEmail(
  customerEmail: string,
  data: OrderEmailData,
) {
  const resend = getResend();
  if (!resend) return;

  const itemList = data.items
    .map((i) => `<li style="padding:4px 0;color:#c8d0dc;font-size:13px;">${i.name} × ${i.quantity} — Bs ${i.priceTotal.toFixed(2)}</li>`)
    .join("");

  const html = `
    <div style="background:#0a1628;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#0f1f38;border:1px solid #1a2744;border-radius:12px;overflow:hidden;">

        <div style="background:#b8ca60;padding:20px 24px;text-align:center;">
          <h1 style="margin:0;font-size:18px;color:#0a1628;font-weight:600;">¡Pedido recibido!</h1>
        </div>

        <div style="padding:24px;">
          <p style="color:#c8d0dc;font-size:14px;margin:0 0 4px;">Hola ${data.customerName},</p>
          <p style="color:#7a8599;font-size:13px;margin:0 0 20px;">Tu pedido ha sido registrado exitosamente.</p>

          <div style="background:#0a1628;border-radius:8px;padding:16px;margin-bottom:20px;text-align:center;">
            <span style="color:#7a8599;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Número de pedido</span>
            <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#b8ca60;font-family:monospace;">${data.orderNumber}</p>
          </div>

          <h3 style="margin:0 0 8px;font-size:13px;color:#7a8599;text-transform:uppercase;letter-spacing:1px;">Resumen</h3>
          <ul style="list-style:none;padding:0;margin:0 0 16px;">${itemList}</ul>

          <div style="border-top:1px solid #1a2744;padding-top:12px;">
            ${data.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span style="color:#7a8599;font-size:13px;">Descuento</span>
              <span style="color:#ef4444;font-size:13px;">-Bs ${data.discount.toFixed(2)}</span>
            </div>` : ""}
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#e2e8f0;font-size:15px;font-weight:600;">Total</span>
              <span style="color:#b8ca60;font-size:15px;font-weight:600;">Bs ${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style="padding:16px 24px;background:#0a1628;border-top:1px solid #1a2744;text-align:center;">
          <p style="color:#7a8599;font-size:12px;margin:0;">
            Te contactaremos por WhatsApp para coordinar el envío.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: `Apex Peptide Lab <${FROM}>`,
      to: customerEmail,
      subject: `Pedido ${data.orderNumber} confirmado — Apex Peptide Lab`,
      html,
    });
  } catch (err) {
    console.error("Failed to send customer email:", err);
  }
}
