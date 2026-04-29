"use server";

import { z } from "zod";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  asunto: z.enum(["consulta", "b2b", "distribucion", "otro"]),
  mensaje: z.string().min(10),
});

export async function sendContactMessage(formData: FormData) {
  // Rate limit: max 3 contact messages per 10 minutes
  const rl = rateLimit("contact", 3, 10 * 60 * 1000);
  if (!rl.ok) return { ok: false, error: "Demasiados mensajes. Intenta en unos minutos." };

  const data = schema.safeParse(Object.fromEntries(formData));
  if (!data.success) return { ok: false, error: "Datos inválidos" };

  const { nombre, apellido, email, whatsapp, asunto, mensaje } = data.data;
  const asuntoLabels: Record<string, string> = {
    consulta: "Consulta general",
    b2b: "B2B / Mayoristas",
    distribucion: "Distribución",
    otro: "Otro",
  };

  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_TO_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `Apex Peptide Lab <${process.env.RESEND_FROM_EMAIL || "noreply@apexpeptidelab.com"}>`,
        to: process.env.RESEND_TO_EMAIL,
        replyTo: email,
        subject: `[Contacto · ${asuntoLabels[asunto]}] ${nombre} ${apellido}`,
        html: `<div style="font-family:system-ui;max-width:560px;margin:0 auto;background:#0f1f38;color:white;padding:24px;border-radius:12px;border:1px solid #1a2744;">
          <div style="color:#b8ca60;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Nuevo mensaje · apexpeptidelab.com</div>
          <h1 style="color:#b8ca60;font-size:22px;margin:0 0 16px;">${nombre} ${apellido}</h1>
          <table style="width:100%;font-size:14px;line-height:1.6;">
            <tr><td style="color:rgba(255,255,255,0.5);padding:4px 0;width:110px;">Email</td><td><a href="mailto:${email}" style="color:white;">${email}</a></td></tr>
            ${whatsapp ? `<tr><td style="color:rgba(255,255,255,0.5);padding:4px 0;">WhatsApp</td><td>${whatsapp}</td></tr>` : ""}
            <tr><td style="color:rgba(255,255,255,0.5);padding:4px 0;">Asunto</td><td>${asuntoLabels[asunto]}</td></tr>
          </table>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(184,202,96,0.2);">
            <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:8px;">Mensaje:</div>
            <div style="white-space:pre-wrap;line-height:1.6;">${mensaje}</div>
          </div>
        </div>`,
      });
    } else {
      console.log("Contact form (no Resend configured):", { nombre, apellido, email, asunto, mensaje });
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo enviar el mensaje" };
  }
}
