import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — apex peptide lab",
  description:
    "Contáctanos por WhatsApp o email para consultas sobre nuestros péptidos.",
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
