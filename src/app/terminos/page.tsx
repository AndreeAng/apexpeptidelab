import { FadeIn } from "@/components/ui/AnimateIn";

export const metadata = {
  title: "Términos y condiciones — apex peptide lab",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-5 md:px-8 py-14">
      <FadeIn>
        <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
          Legal
        </div>
        <h1 className="text-white text-3xl md:text-4xl font-medium tracking-tight mb-8">
          Términos y condiciones
        </h1>
      </FadeIn>

      <div className="prose-apex space-y-6">
        <Section title="1. Aceptación de términos">
          Al acceder y utilizar el sitio web de apex peptide lab y/o realizar
          una compra, usted acepta estos términos y condiciones en su
          totalidad. Si no está de acuerdo, no utilice nuestros servicios.
        </Section>

        <Section title="2. Productos">
          Todos los productos vendidos por apex peptide lab son materiales de
          referencia destinados exclusivamente para uso en investigación,
          laboratorio y educación. No están aprobados para consumo humano,
          uso veterinario, ni para ninguna aplicación terapéutica o
          diagnóstica.
        </Section>

        <Section title="3. Elegibilidad del comprador">
          Al realizar una compra, el comprador certifica ser un profesional
          calificado, investigador autorizado o representar a una institución
          de investigación. El comprador asume total responsabilidad por el
          manejo, uso y almacenamiento de los productos conforme a las leyes
          y regulaciones aplicables.
        </Section>

        <Section title="4. Precios y pagos">
          Los precios están expresados en Bolivianos (Bs) e incluyen el
          producto únicamente. El envío se coordina de forma independiente.
          Los pagos se coordinan a través de WhatsApp. Nos reservamos el
          derecho de modificar precios sin previo aviso.
        </Section>

        <Section title="5. Envíos">
          Realizamos envíos a todas las ciudades de Bolivia. Los tiempos de
          entrega son estimados y pueden variar según la ubicación.
          apex peptide lab no se responsabiliza por retrasos atribuibles al
          servicio de mensajería.
        </Section>

        <Section title="6. Devoluciones">
          Todas las ventas son finales. Debido a la naturaleza de los
          productos, no aceptamos devoluciones una vez que el producto ha
          sido enviado, salvo en caso de error de nuestra parte o producto
          dañado durante el transporte.
        </Section>

        <Section title="7. Limitación de responsabilidad">
          apex peptide lab no se hace responsable por el uso indebido de los
          productos. El comprador es el único responsable de cumplir con
          todas las leyes y regulaciones aplicables en su jurisdicción.
        </Section>

        <Section title="8. Modificaciones">
          Nos reservamos el derecho de modificar estos términos en cualquier
          momento. Las modificaciones entran en vigor al ser publicadas en
          este sitio.
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
