import Link from "next/link";
import {
  ShieldCheck,
  FlaskConical,
  FileCheck,
  Thermometer,
  Microscope,
  BadgeCheck,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleIn } from "@/components/ui/AnimateIn";

export const metadata = {
  title: "Calidad y Pureza de Péptidos — Certificado de Análisis",
  description:
    "Péptidos con pureza superior al 99% verificada por laboratorio independiente. Certificado de análisis (CoA) en cada lote. Protección de envío y almacenamiento garantizado en Bolivia.",
  alternates: {
    canonical: "https://www.apexpeptidelab.shop/calidad",
  },
};

export default function CalidadPage() {
  const pillars = [
    {
      icon: BadgeCheck,
      title: "Potencia",
      text: "Cada péptido es dosificado con precisión analítica para garantizar que la cantidad declarada corresponda exactamente al contenido real del vial.",
    },
    {
      icon: ShieldCheck,
      title: "Pureza",
      text: "Pureza superior al 99% verificada por laboratorio independiente. Eliminamos impurezas de síntesis, sales residuales y subproductos de degradación.",
    },
    {
      icon: Thermometer,
      title: "Estabilidad",
      text: "Formulaciones reconstituidas diseñadas para máxima estabilidad. Almacenamiento recomendado entre 2-8°C con vida útil documentada.",
    },
    {
      icon: Microscope,
      title: "Identidad",
      text: "Espectrometría de masas confirma la estructura molecular exacta de cada péptido, eliminando riesgos de sustitución o contaminación cruzada.",
    },
    {
      icon: FlaskConical,
      title: "Esterilidad",
      text: "Procesos de preparación en condiciones controladas. Viales sellados con garantía de integridad hasta su apertura.",
    },
    {
      icon: FileCheck,
      title: "Consistencia",
      text: "Sistema de control de lotes que garantiza que cada producción cumple las mismas especificaciones. Trazabilidad completa desde síntesis hasta envío.",
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="px-5 md:px-8 pt-14 pb-10 max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
            Calidad
          </div>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            Calidad verificable
          </h1>
          <p className="text-white/55 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
            Cada péptido pasa por un riguroso proceso de control de calidad antes
            de llegar a tu laboratorio.
          </p>
        </FadeIn>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {pillars.map((p) => (
            <FadeInStaggerItem key={p.title}>
              <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 hover:border-lime/25 transition-colors duration-300 h-full">
                <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center mb-4">
                  <p.icon size={20} className="text-lime" />
                </div>
                <h3 className="text-white font-medium mb-2">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.text}</p>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <ScaleIn>
          <div className="relative overflow-hidden bg-surface-deep border border-border-subtle rounded-xl p-6 md:p-8">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-lime/[0.03] blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-lime text-[11px] tracking-widest uppercase font-medium mb-4">
                Certificado de análisis
              </h2>
              <p className="text-white/55 text-sm leading-relaxed max-w-3xl mb-6">
                Cada lote producido incluye un certificado de análisis (CoA)
                documentando: pureza, identidad por espectrometría de
                masas, contenido neto, número de lote, fecha de producción y
                condiciones de almacenamiento. Solicita el CoA de cualquier
                producto a través de nuestro canal de WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/59172201700?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20un%20certificado%20de%20an%C3%A1lisis%20(CoA)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-whatsapp hover:bg-whatsapp-hover text-white px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer active:scale-[0.97]"
                >
                  <MessageCircle size={14} />
                  Solicitar CoA
                </a>
                <Link
                  href="/productos"
                  className="group border border-lime/30 text-lime px-5 py-2.5 rounded-full text-sm font-medium hover:border-lime hover:bg-lime/5 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  Ver productos
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </ScaleIn>
      </div>
    </div>
  );
}
