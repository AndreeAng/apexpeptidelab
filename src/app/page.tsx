import { getPublicProducts } from "@/lib/dal/products";
import HomeContent from "@/components/home/HomeContent";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Péptidos de investigación en Bolivia",
  description:
    "Comprar péptidos de investigación en Bolivia. BPC-157, GHK-Cu, CJC-1295, Retatrutide y más. Pureza 99%+, certificado de análisis. Envío seguro a Santa Cruz, La Paz, Cochabamba, Sucre, Oruro, Potosí, Tarija y todo el país.",
  alternates: {
    canonical: "https://www.apexpeptidelab.shop",
  },
};

const homeFaqs = [
  { q: "¿Qué son los péptidos de investigación?", a: "Los péptidos son cadenas cortas de aminoácidos utilizadas en investigación científica para estudiar procesos biológicos, desarrollar protocolos experimentales y explorar mecanismos celulares. Nuestros productos están destinados exclusivamente para uso en laboratorio." },
  { q: "¿Cuál es la pureza de los productos?", a: "Todos nuestros péptidos tienen una pureza verificada superior al 99%, confirmada por laboratorio independiente y espectrometría de masas. Cada lote incluye su certificado de análisis." },
  { q: "¿Realizan envíos a todo Bolivia?", a: "Sí, realizamos envíos seguros y discretos a todas las ciudades de Bolivia incluyendo Santa Cruz, La Paz, Cochabamba, Sucre, Oruro, Potosí, Tarija, Trinidad y Cobija. El tiempo de entrega es generalmente de 24-48 horas." },
  { q: "¿Cómo funciona el proceso de compra?", a: "Agrega los productos al carrito, completa tus datos en el checkout, y tu pedido se envía directamente a nuestro WhatsApp. Coordinamos pago y envío por chat de forma personalizada." },
  { q: "¿Existe precio diferencial para profesionales?", a: "Sí, ofrecemos condiciones especiales para clínicas, spas, laboratorios y profesionales. Contactanos por WhatsApp para obtener información sobre precios mayoristas." },
  { q: "¿Qué incluye el certificado de análisis (CoA)?", a: "El CoA documenta la pureza del lote, identidad del péptido confirmada por espectrometría de masas, contenido neto, número de lote y condiciones de almacenamiento recomendadas." },
  { q: "¿Cómo debo almacenar los péptidos?", a: "Los viales reconstituidos deben refrigerarse entre 2-8°C. Proteger de la luz directa y usar dentro de los 30 días posteriores a la apertura." },
  { q: "¿Los productos son aptos para consumo humano?", a: "No. Nuestros productos se venden exclusivamente como material de referencia para investigación, laboratorio y educación. No están aprobados para consumo humano, uso veterinario ni aplicaciones terapéuticas." },
];

export default async function Home() {
  const products = await getPublicProducts();

  return (
    <>
      <FAQJsonLd faqs={homeFaqs} />
      <HomeContent products={products} />
    </>
  );
}
