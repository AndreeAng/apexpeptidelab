import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — apex peptide lab",
  description: "Completa tu pedido de péptidos.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
