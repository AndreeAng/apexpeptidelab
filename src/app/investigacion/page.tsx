import Link from "next/link";
import { Atom, BookOpen, FlaskConical, Microscope, ArrowRight } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem, ScaleIn } from "@/components/ui/AnimateIn";

export const metadata = {
  title: "Investigación — apex peptide lab",
  description: "Recursos y contexto científico sobre péptidos.",
};

export default function InvestigacionPage() {
  return (
    <div className="min-h-screen">
      <header className="px-5 md:px-8 pt-14 pb-10 max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
            Investigación
          </div>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            Contexto científico
          </h1>
          <p className="text-white/55 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
            Información de referencia sobre los péptidos disponibles en nuestro
            catálogo y su relevancia en la investigación actual.
          </p>
        </FadeIn>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: Atom,
              title: "¿Qué son los péptidos?",
              text: "Los péptidos son cadenas cortas de aminoácidos (entre 2 y 50 residuos) que actúan como señalizadores biológicos. A diferencia de las proteínas, su menor tamaño facilita la síntesis en laboratorio y el estudio de interacciones moleculares específicas.",
            },
            {
              icon: FlaskConical,
              title: "Aplicaciones",
              text: "Los péptidos se utilizan para estudiar mecanismos de señalización celular, explorar vías metabólicas, investigar procesos de reparación tisular y desarrollar nuevos protocolos experimentales en bioquímica y farmacología.",
            },
            {
              icon: Microscope,
              title: "Control de calidad",
              text: "La verificación de pureza y la confirmación de identidad por espectrometría de masas son estándares fundamentales para garantizar la reproducibilidad de resultados experimentales.",
            },
            {
              icon: BookOpen,
              title: "Documentación técnica",
              text: "Cada producto incluye certificado de análisis (CoA), especificaciones de almacenamiento, y referencias bibliográficas relevantes para contextualizar su uso en protocolos.",
            },
          ].map((item) => (
            <FadeInStaggerItem key={item.title}>
              <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 hover:border-lime/25 transition-colors duration-300 h-full">
                <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-lime" />
                </div>
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <ScaleIn>
          <div className="relative overflow-hidden bg-surface-raised border border-border-default rounded-xl p-6 md:p-8 text-center">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-lime/[0.03] blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-white text-lg md:text-xl font-medium mb-2">
                Explora nuestro catálogo
              </h2>
              <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
                Péptidos con certificado de análisis y documentación técnica completa.
              </p>
              <Link
                href="/productos"
                className="group bg-lime text-navy px-6 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-lime/20 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer active:scale-[0.97]"
              >
                Ver catálogo
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </ScaleIn>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <FadeIn>
          <div className="bg-surface-deep border border-border-subtle rounded-xl p-6">
            <p className="text-white/35 text-xs leading-relaxed">
              <span className="text-lime/60 font-medium">Nota importante:</span>{" "}
              La información proporcionada en esta sección es de carácter
              informativo y educativo. No constituye consejo médico, terapéutico
              ni diagnóstico. Todos los productos se venden exclusivamente para
              uso en investigación.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
