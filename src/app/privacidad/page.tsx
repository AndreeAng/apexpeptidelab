import { FadeIn } from "@/components/ui/AnimateIn";

export const metadata = {
  title: "Política de privacidad — apex peptide lab",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-5 md:px-8 py-14">
      <FadeIn>
        <div className="text-lime text-[11px] tracking-widest uppercase font-medium mb-3">
          Legal
        </div>
      </FadeIn>
      <h1 className="text-white text-3xl md:text-4xl font-medium tracking-tight mb-8">
        Política de privacidad
      </h1>

      <div className="space-y-6">
        <Section title="1. Información que recopilamos">
          Recopilamos la información que usted proporciona voluntariamente al
          realizar un pedido o contactarnos: nombre, dirección, número de
          WhatsApp, email y ciudad. No recopilamos información sensible ni
          datos financieros a través de nuestro sitio web.
        </Section>

        <Section title="2. Uso de la información">
          Utilizamos su información exclusivamente para: procesar y coordinar
          pedidos, comunicarnos con usted sobre su compra, mejorar nuestros
          servicios y, si lo autoriza, enviar información sobre nuevos
          productos.
        </Section>

        <Section title="3. Compartir información">
          No vendemos, alquilamos ni compartimos su información personal con
          terceros, excepto cuando sea necesario para completar su pedido
          (servicio de mensajería) o cuando la ley lo requiera.
        </Section>

        <Section title="4. Seguridad">
          Implementamos medidas razonables para proteger su información
          personal. Sin embargo, ningún método de transmisión o almacenamiento
          electrónico es 100% seguro.
        </Section>

        <Section title="5. Cookies">
          Nuestro sitio utiliza almacenamiento local del navegador para
          mantener el estado del carrito de compras. No utilizamos cookies de
          seguimiento de terceros.
        </Section>

        <Section title="6. Sus derechos">
          Puede solicitar acceso, corrección o eliminación de sus datos
          personales contactándonos a través de nuestro formulario de
          contacto o WhatsApp.
        </Section>

        <Section title="7. Cambios">
          Nos reservamos el derecho de actualizar esta política. Los cambios
          se publicarán en esta página con la fecha de actualización.
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
