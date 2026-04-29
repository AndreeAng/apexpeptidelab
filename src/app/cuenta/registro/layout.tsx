import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Cuenta",
  description: "Crea tu cuenta en Apex Peptide Lab para guardar tus pedidos, direcciones y datos.",
};

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
