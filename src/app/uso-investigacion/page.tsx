import { FadeIn } from "@/components/ui/AnimateIn";

export const metadata = {
  title: "Uso de investigación — apex peptide lab",
};

export default function UsoInvestigacionPage() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-5 md:px-8 py-14">
      <FadeIn>
        <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
          Legal
        </div>
      </FadeIn>
      <h1 className="text-white text-3xl md:text-4xl font-medium tracking-tight mb-8">
        Declaración de uso de investigación
      </h1>

      <div className="space-y-6">
        <div className="bg-lime-soft border border-lime/20 rounded-lg p-5 mb-8">
          <p className="text-lime text-sm font-medium leading-relaxed">
            Todos los productos de apex peptide lab se venden exclusivamente
            como materiales de referencia para investigación, laboratorio y
            educación.
          </p>
        </div>

        <Section title="Uso permitido">
          Nuestros productos están destinados para uso en investigación
          científica, incluyendo pero no limitado a: estudios in vitro,
          protocolos de laboratorio, investigación académica, desarrollo de
          métodos analíticos y educación científica.
        </Section>

        <Section title="Uso no permitido">
          Nuestros productos NO están aprobados ni destinados para: consumo
          humano o animal, aplicaciones terapéuticas o diagnósticas,
          formulación de medicamentos, suplementos dietarios o cosméticos para
          uso directo, ni cualquier otro uso no autorizado por las regulaciones
          aplicables.
        </Section>

        <Section title="Responsabilidad del comprador">
          Al adquirir productos de apex peptide lab, el comprador declara y
          garantiza que: es un investigador calificado o representa a una
          institución autorizada, utilizará los productos exclusivamente para
          fines de investigación, cumplirá con todas las leyes y regulaciones
          aplicables en su jurisdicción, y asumirá total responsabilidad por
          el manejo, almacenamiento y uso de los productos.
        </Section>

        <Section title="Documentación">
          apex peptide lab proporciona documentación técnica (certificado de
          análisis, especificaciones de almacenamiento) exclusivamente como
          referencia para el investigador. Esta documentación no constituye ni
          implica aprobación regulatoria alguna.
        </Section>

        <Section title="Exención de responsabilidad">
          apex peptide lab no se hace responsable por el uso indebido de sus
          productos ni por las consecuencias derivadas del incumplimiento de
          estas condiciones por parte del comprador.
        </Section>

        <p className="text-white/30 text-xs italic pt-4">
          Última actualización: abril 2026
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-white text-sm font-medium mb-2">{title}</h2>
      <p className="text-white/50 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
