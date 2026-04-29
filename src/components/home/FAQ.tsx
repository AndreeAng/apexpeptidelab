"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";

const faqs = [
  {
    q: "¿Qué son los péptidos de investigación?",
    a: "Los péptidos son cadenas cortas de aminoácidos utilizadas en investigación científica para estudiar procesos biológicos, desarrollar protocolos experimentales y explorar mecanismos celulares. Nuestros productos están destinados exclusivamente para uso en laboratorio.",
  },
  {
    q: "¿Cuál es la pureza de los productos?",
    a: "Todos nuestros péptidos tienen una pureza verificada superior al 99%, confirmada por laboratorio independiente y espectrometría de masas. Cada lote incluye su certificado de análisis.",
  },
  {
    q: "¿Realizan envíos a todo Bolivia?",
    a: "Sí, realizamos envíos seguros y discretos a todas las ciudades de Bolivia. El tiempo de entrega es generalmente de 24-48 horas una vez confirmado el pedido.",
  },
  {
    q: "¿Cómo funciona el proceso de compra?",
    a: "Agrega los productos al carrito, completa tus datos en el checkout, y tu pedido se envía directamente a nuestro WhatsApp. Coordinamos pago y envío por chat de forma personalizada.",
  },
  {
    q: "¿Existe precio diferencial para profesionales?",
    a: "Sí, ofrecemos condiciones especiales para clínicas, spas, laboratorios y profesionales. Contactanos por WhatsApp para obtener información sobre precios mayoristas.",
  },
  {
    q: "¿Qué incluye el certificado de análisis (CoA)?",
    a: "El CoA documenta la pureza del lote, identidad del péptido confirmada por espectrometría de masas, contenido neto, número de lote y condiciones de almacenamiento recomendadas.",
  },
  {
    q: "¿Cómo debo almacenar los péptidos?",
    a: "Los viales reconstituidos deben refrigerarse entre 2-8°C. Proteger de la luz directa y usar dentro de los 30 días posteriores a la apertura.",
  },
  {
    q: "¿Los productos son aptos para consumo humano?",
    a: "No. Nuestros productos se venden exclusivamente como material de referencia para investigación, laboratorio y educación. No están aprobados para consumo humano, uso veterinario ni aplicaciones terapéuticas.",
  },
];

export function HomeFAQ() {
  return (
    <Accordion.Root type="single" collapsible className="space-y-2">
      {faqs.map((faq, i) => (
        <Accordion.Item
          key={i}
          value={`faq-${i}`}
          className="bg-surface-raised border border-border-subtle rounded-lg overflow-hidden"
        >
          <Accordion.Trigger className="w-full px-5 py-4 text-left text-white text-sm font-medium hover:text-lime transition-colors flex items-center justify-between gap-3 cursor-pointer group">
            <span>{faq.q}</span>
            <ChevronRight
              size={14}
              className="text-white/30 group-data-[state=open]:rotate-90 transition-transform duration-200 flex-shrink-0"
            />
          </Accordion.Trigger>
          <Accordion.Content className="px-5 pb-4 text-white/55 text-sm leading-relaxed overflow-hidden">
            {faq.a}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
