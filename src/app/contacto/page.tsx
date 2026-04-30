"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendContactMessage } from "./actions";
import { useState } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";

const contactSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre"),
  apellido: z.string().min(2, "Ingresa tu apellido"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().optional(),
  asunto: z.enum(["consulta", "b2b", "distribucion", "otro"]),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});
type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { asunto: "consulta" },
  });

  const onSubmit = async (data: ContactForm) => {
    setSending(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    const result = await sendContactMessage(formData);
    setSending(false);
    if (result.ok) setSent(true);
  };

  const whatsappNumber = "59172201700";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="px-5 md:px-8 pt-14 pb-10 max-w-7xl mx-auto">
        <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
          Contacto
        </div>
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
          Hablemos
        </h1>
        <p className="text-white/55 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
          ¿Tienes preguntas sobre nuestros péptidos?
          Estamos aquí para ayudarte.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          {/* Left — Contact info */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <ContactItem
                icon={<MessageCircle size={16} />}
                label="WhatsApp"
                primary
              >
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola, me interesa información sobre los péptidos que tienen disponibles.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-whatsapp hover:bg-whatsapp-hover text-white px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.97] mt-2"
                >
                  <MessageCircle size={14} />
                  Escribir por WhatsApp
                </a>
              </ContactItem>

              <ContactItem icon={<Mail size={16} />} label="Email">
                <span className="text-white/70 text-sm">
                  contacto@apexpeptidelab.shop
                </span>
              </ContactItem>

              <ContactItem icon={<MapPin size={16} />} label="Cobertura">
                <span className="text-white/70 text-sm">
                  Envíos a toda Bolivia
                </span>
              </ContactItem>
            </div>
          </div>

          {/* Right — Form */}
          <div className="md:col-span-3">
            {sent ? (
              <div className="bg-surface-raised border border-lime/25 rounded-xl p-8 text-center">
                <CheckCircle size={32} className="text-lime mx-auto mb-4" />
                <h2 className="text-white text-lg font-medium mb-2">
                  Mensaje enviado
                </h2>
                <p className="text-white/55 text-sm">
                  Te responderemos lo antes posible.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8 space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Nombre"
                    required
                    id="contact-nombre"
                    error={errors.nombre?.message}
                  >
                    <input
                      {...register("nombre")}
                      id="contact-nombre"
                      placeholder="Nombre"
                      className="contact-input"
                    />
                  </Field>
                  <Field
                    label="Apellido"
                    required
                    id="contact-apellido"
                    error={errors.apellido?.message}
                  >
                    <input
                      {...register("apellido")}
                      id="contact-apellido"
                      placeholder="Apellido"
                      className="contact-input"
                    />
                  </Field>
                </div>

                <Field label="Email" required id="contact-email" error={errors.email?.message}>
                  <input
                    {...register("email")}
                    id="contact-email"
                    type="email"
                    placeholder="tu@email.com"
                    className="contact-input"
                    autoComplete="email"
                  />
                </Field>

                <Field label="WhatsApp (opcional)" id="contact-whatsapp">
                  <input
                    {...register("whatsapp")}
                    id="contact-whatsapp"
                    placeholder="+591 7..."
                    type="tel"
                    autoComplete="tel"
                    className="contact-input"
                  />
                </Field>

                <Field label="Asunto" required id="contact-asunto">
                  <select {...register("asunto")} id="contact-asunto" className="contact-input">
                    <option value="consulta">Consulta general</option>
                    <option value="b2b">B2B / Mayoristas</option>
                    <option value="distribucion">Distribución</option>
                    <option value="otro">Otro</option>
                  </select>
                </Field>

                <Field
                  label="Mensaje"
                  required
                  id="contact-mensaje"
                  error={errors.mensaje?.message}
                >
                  <textarea
                    {...register("mensaje")}
                    id="contact-mensaje"
                    placeholder="Escribe tu mensaje..."
                    rows={4}
                    className="contact-input"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-lime text-navy py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.97]"
                >
                  <Send size={14} />
                  {sending ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  icon,
  label,
  primary,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-raised border border-border-subtle rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={primary ? "text-whatsapp" : "text-lime"}>
          {icon}
        </span>
        <span className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  id,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1.5"
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-[11px] mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
