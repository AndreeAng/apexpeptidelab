import {
  ShieldCheck,
  FlaskConical,
  Truck,
  Users,
  Target,
  Heart,
} from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/AnimateIn";
import Link from "next/link";

export const metadata = {
  title: "Nosotros",
  description:
    "Conoce a Apex Peptide Lab: péptidos de investigación de grado farmacéutico en Bolivia. Nuestra misión, valores y compromiso con la calidad.",
  alternates: {
    canonical: "https://www.apexpeptidelab.shop/nosotros",
  },
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="px-5 md:px-8 lg:px-12 pt-14 pb-10 max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
            Nosotros
          </div>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            Péptidos de investigación,{" "}
            <span className="bg-gradient-to-r from-lime to-lime/60 bg-clip-text text-transparent">
              sin atajos
            </span>
          </h1>
          <p className="text-white/55 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
            Nacimos para resolver un problema simple: los investigadores en Bolivia
            merecen acceso a péptidos de la misma calidad que cualquier laboratorio
            internacional.
          </p>
        </FadeIn>
      </header>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 pb-14">
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeInStaggerItem>
            <div className="bg-surface-raised border border-border-subtle rounded-xl p-8 h-full">
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center mb-5">
                <Target size={20} className="text-lime" />
              </div>
              <h2 className="text-white text-lg font-medium mb-3">Nuestra misión</h2>
              <p className="text-white/55 text-sm leading-relaxed">
                Proveer péptidos de investigación de grado farmacéutico con pureza verificada,
                documentación completa y entrega confiable a investigadores, laboratorios y
                profesionales en toda Bolivia. Creemos que la calidad no debería depender
                de tu ubicación geográfica.
              </p>
            </div>
          </FadeInStaggerItem>
          <FadeInStaggerItem>
            <div className="bg-surface-raised border border-border-subtle rounded-xl p-8 h-full">
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center mb-5">
                <Heart size={20} className="text-lime" />
              </div>
              <h2 className="text-white text-lg font-medium mb-3">Por qué existimos</h2>
              <p className="text-white/55 text-sm leading-relaxed">
                Antes de Apex, conseguir péptidos de calidad en Bolivia significaba importaciones
                costosas, semanas de espera, aduanas impredecibles y cero garantía sobre la cadena
                de frío. Decidimos cambiar eso ofreciendo stock local, envío en 24-48 horas y
                soporte técnico en español.
              </p>
            </div>
          </FadeInStaggerItem>
        </FadeInStagger>
      </div>

      {/* Values */}
      <div className="bg-navy-deep border-y border-lime/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-14 md:py-20">
          <FadeIn className="text-center mb-12">
            <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-2">
              Valores
            </div>
            <h2 className="text-white text-2xl md:text-3xl font-medium tracking-tight">
              Lo que nos define
            </h2>
          </FadeIn>
          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ShieldCheck,
                title: "Pureza sin compromisos",
                text: "Cada lote supera el 99% de pureza, verificado por laboratorio independiente con espectrometría de masas.",
              },
              {
                icon: FlaskConical,
                title: "Transparencia total",
                text: "Certificado de análisis (CoA) en cada producto. Sin secretos, sin atajos, sin letra pequeña.",
              },
              {
                icon: Truck,
                title: "Cadena de frío",
                text: "Envío con protección térmica a las 9 capitales de departamento. Tu producto llega en condiciones óptimas.",
              },
              {
                icon: Users,
                title: "Soporte real",
                text: "Atención personalizada por WhatsApp. Asesoría sobre almacenamiento, reconstitución y protocolos.",
              },
            ].map((v) => (
              <FadeInStaggerItem key={v.title}>
                <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 hover:border-lime/25 transition-colors h-full">
                  <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center mb-4">
                    <v.icon size={20} className="text-lime" />
                  </div>
                  <h3 className="text-white text-sm font-medium mb-2">{v.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{v.text}</p>
                </div>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-14 md:py-20">
        <FadeInStagger className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "99%+", label: "Pureza mínima garantizada" },
            { value: "24-48h", label: "Tiempo de entrega" },
            { value: "9", label: "Capitales con cobertura" },
            { value: "100%", label: "Productos con CoA" },
          ].map((s) => (
            <FadeInStaggerItem key={s.label}>
              <div>
                <p className="text-lime font-mono text-3xl md:text-4xl font-bold">{s.value}</p>
                <p className="text-white/45 text-xs mt-2">{s.label}</p>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 pb-14">
        <FadeIn>
          <div className="bg-surface-raised border border-border-subtle rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-white text-xl md:text-2xl font-medium mb-3">
              ¿Listo para trabajar con nosotros?
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
              Explora nuestro catálogo o contáctanos para asesoría personalizada sobre
              tus necesidades de investigación.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/productos"
                className="bg-lime text-navy-deep px-7 py-3 rounded-full text-sm font-medium hover:brightness-110 transition-all inline-flex items-center justify-center"
              >
                Ver catálogo
              </Link>
              <Link
                href="/contacto"
                className="border border-lime/30 text-lime px-7 py-3 rounded-full text-sm font-medium hover:border-lime hover:bg-lime/5 transition-all inline-flex items-center justify-center"
              >
                Contactarnos
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
