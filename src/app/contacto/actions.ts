"use server";

import { z } from "zod";

const schema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  asunto: z.enum(["consulta", "b2b", "distribucion", "otro"]),
  mensaje: z.string().min(10),
});

export async function sendContactMessage(formData: FormData) {
  const data = schema.safeParse(Object.fromEntries(formData));
  if (!data.success) return { ok: false, error: "Datos inválidos" };

  const { nombre, apellido, email, whatsapp, asunto, mensaje } = data.data;
  const asuntoLabels: Record<string, string> = {
    consulta: "Consulta general",
    b2b: "B2B / Mayoristas",
    distribucion: "Distribución",
    otro: "Otro",
  };

  // When Resend is configured, uncomment:
  // const { Resend } = await import("resend");
  // const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Placeholder: log to console until Resend is configured
    console.log("Contact form submission:", {
      from: `${nombre} ${apellido}`,
      email,
      whatsapp,
      subject: asuntoLabels[asunto],
      message: mensaje,
    });

    // Uncomment when Resend is ready:
    // await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL!,
    //   to: process.env.RESEND_TO_EMAIL!,
    //   replyTo: email,
    //   subject: `[Contacto · ${asuntoLabels[asunto]}] ${nombre} ${apellido}`,
    //   html: `<div style="font-family:system-ui;max-width:560px;margin:0 auto;background:#002852;color:white;padding:24px;border-radius:12px;">
    //     <div style="color:#b8ca60;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Nuevo mensaje · apexpeptidelab.com</div>
    //     <h1 style="color:#b8ca60;font-size:22px;margin:0 0 16px;">${nombre} ${apellido}</h1>
    //     <table style="width:100%;font-size:14px;line-height:1.6;">
    //       <tr><td style="color:rgba(255,255,255,0.6);padding:4px 0;width:110px;">Email</td><td><a href="mailto:${email}" style="color:white;">${email}</a></td></tr>
    //       ${whatsapp ? `<tr><td style="color:rgba(255,255,255,0.6);padding:4px 0;">WhatsApp</td><td>${whatsapp}</td></tr>` : ""}
    //       <tr><td style="color:rgba(255,255,255,0.6);padding:4px 0;">Asunto</td><td>${asuntoLabels[asunto]}</td></tr>
    //     </table>
    //     <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(184,202,96,0.2);">
    //       <div style="color:rgba(255,255,255,0.6);font-size:12px;margin-bottom:8px;">Mensaje:</div>
    //       <div style="white-space:pre-wrap;line-height:1.6;">${mensaje}</div>
    //     </div>
    //   </div>`,
    // });

    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo enviar el mensaje" };
  }
}
