import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Analytics } from "@/components/layout/Analytics";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

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
  metadataBase: new URL("https://www.apexpeptidelab.shop"),
  title: {
    default: "Péptidos de investigación en Bolivia — Apex Peptide Lab",
    template: "%s — Apex Peptide Lab",
  },
  description:
    "Comprar péptidos de investigación en Bolivia. BPC-157, GHK-Cu, CJC-1295, Retatrutide y más. Pureza 99%+, certificado de análisis en cada lote. Envío seguro a Santa Cruz, La Paz, Cochabamba, Sucre, Oruro, Potosí, Tarija y todo el país.",
  keywords: [
    "péptidos Bolivia",
    "péptidos de investigación",
    "comprar péptidos Bolivia",
    "péptidos Santa Cruz",
    "péptidos La Paz",
    "péptidos Cochabamba",
    "péptidos Sucre",
    "péptidos Oruro",
    "péptidos Potosí",
    "péptidos Tarija",
    "BPC-157 Bolivia",
    "GHK-Cu Bolivia",
    "CJC-1295 Bolivia",
    "Retatrutide Bolivia",
    "péptidos grado farmacéutico",
    "péptidos pureza 99",
    "laboratorio péptidos Bolivia",
    "péptidos investigación científica",
    "apex peptide lab",
  ],
  openGraph: {
    title: "Apex Peptide Lab — Péptidos de investigación en Bolivia",
    description:
      "Péptidos de grado farmacéutico con 99%+ de pureza. Certificado de análisis, envío seguro a toda Bolivia.",
    type: "website",
    locale: "es_BO",
    siteName: "Apex Peptide Lab",
    url: "https://www.apexpeptidelab.shop",
    images: [
      {
        url: "/apex-logo.png",
        width: 415,
        height: 217,
        alt: "Apex Peptide Lab — Péptidos de investigación en Bolivia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Peptide Lab — Péptidos de investigación en Bolivia",
    description:
      "Péptidos con 99%+ de pureza, certificado de análisis y envío a toda Bolivia.",
    images: ["/apex-logo.png"],
  },
  alternates: {
    canonical: "https://www.apexpeptidelab.shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
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
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-screen bg-navy text-white flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSidebar />
        <Analytics />
        <WhatsAppButton />
      </body>
    </html>
  );
}
