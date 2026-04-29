import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — Péptidos de Investigación Bolivia",
  description:
    "Contáctanos por WhatsApp o email para consultas sobre péptidos de investigación. Atención personalizada, envío a toda Bolivia.",
  alternates: {
    canonical: "https://www.apexpeptidelab.shop/contacto",
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
