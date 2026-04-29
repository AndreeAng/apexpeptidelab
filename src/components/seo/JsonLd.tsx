import type { Product } from "@/data/products";

const BASE_URL = "https://www.apexpeptidelab.shop";

/** Organization schema — use in layout */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Apex Peptide Lab",
    url: BASE_URL,
    logo: `${BASE_URL}/apex-logo.png`,
    description:
      "Péptidos de investigación de grado farmacéutico con 99%+ de pureza. Envío seguro a toda Bolivia — Santa Cruz, La Paz, Cochabamba, Sucre, Oruro, Potosí, Tarija, Trinidad, Cobija.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+591-72201700",
      contactType: "customer service",
      availableLanguage: "Spanish",
      areaServed: "BO",
    },
    sameAs: [
      "https://www.instagram.com/apexpeptidelab",
      "https://www.tiktok.com/@apexpeptidelab",
      "https://www.facebook.com/apexpeptidelab",
    ],
    areaServed: {
      "@type": "Country",
      name: "Bolivia",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** WebSite schema with search — use in layout */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Apex Peptide Lab",
    alternateName: "apex peptide lab",
    url: BASE_URL,
    description:
      "Comprar péptidos de investigación en Bolivia. BPC-157, GHK-Cu, CJC-1295, Retatrutide y más. Pureza 99%+, certificado de análisis, envío a todo el país.",
    inLanguage: "es",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/productos?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Product schema — use on product detail pages */
export function ProductJsonLd({ product }: { product: Product }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image || `${BASE_URL}/apex-logo.png`,
    url: `${BASE_URL}/productos/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Apex Peptide Lab",
    },
    offers: {
      "@type": "Offer",
      price: product.isOffer && product.offerPriceBs
        ? product.offerPriceBs
        : product.priceBs,
      priceCurrency: "BOB",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Apex Peptide Lab",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BO",
        },
      },
    },
    category: product.category,
    sku: product.slug,
    ...(product.purity ? { additionalProperty: { "@type": "PropertyValue", name: "Pureza", value: product.purity } } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** FAQ schema — use on pages with FAQs */
export function FAQJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** BreadcrumbList schema */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
