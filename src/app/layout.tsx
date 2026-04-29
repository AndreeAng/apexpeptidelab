import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "apex peptide lab — Péptidos de investigación, sin atajos",
  description:
    "Péptidos de investigación de grado farmacéutico con 99%+ de pureza. Certificado de análisis en cada lote. Envío seguro a toda Bolivia.",
  keywords: [
    "péptidos",
    "investigación",
    "laboratorio",
    "Bolivia",
    "BPC-157",
    "GHK-Cu",
    "CJC-1295",
  ],
  openGraph: {
    title: "apex peptide lab",
    description: "Péptidos de investigación, sin atajos.",
    type: "website",
    locale: "es_BO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen bg-navy text-white flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSidebar />
        <WhatsAppButton />
      </body>
    </html>
  );
}
