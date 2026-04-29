/**
 * Seed script — inserts the 4 core products into the Supabase `products` table.
 *
 * Usage:  npx tsx scripts/seed-products.ts
 *
 * Uses upsert with onConflict: 'slug' so it is safe to run multiple times.
 */

import { config } from "dotenv";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local from the project root
config({ path: path.resolve(__dirname, "..", ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
      "Make sure .env.local (or .env) contains both variables.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Product data
// ---------------------------------------------------------------------------

const products = [
  {
    slug: "glow",
    name: "Glow",
    short_name: "Glow",
    composition: "TB-500 10mg + BPC-157 10mg + GHK-Cu 50mg",
    dose_label: "TB 10mg+BPC-157 10mg+GHK-CU 50mg",
    category: "Mezcla celular",
    accent_color: "#009bdb",
    description:
      "Mezcla de péptidos combinando un fragmento de timosina, BPC-157 y el tripéptido cobre GHK-Cu en un solo vial reconstituido.",
    long_description:
      "Formulación triple diseñada para regeneración celular. Combina TB-500 (fragmento de timosina beta-4), BPC-157 (péptido gástrico estable) y GHK-Cu (tripéptido cobre) en proporciones optimizadas para estudios in vitro e in vivo. Cada lote incluye certificado de análisis con pureza verificada.",
    price_bs: 1500,
    purity: "99.2%",
    in_stock: true,
    is_offer: false,
    image: "/products/glow.png",
    sort_order: 1,
    highlights: [
      "Fórmula triple en un solo vial — conveniencia para protocolos multi-compuesto",
      "TB-500: fragmento de timosina beta-4 estudiado en regeneración tisular",
      "BPC-157: péptido gástrico estable con amplia literatura científica",
      "GHK-Cu: tripéptido cobre asociado a síntesis de colágeno y matriz extracelular",
    ],
    benefits: [
      {
        icon: "Dna",
        title: "Reparación de tejidos",
        text: "Investigado por su relación con procesos asociados a la regeneración y organización de tejidos.",
      },
      {
        icon: "Activity",
        title: "Recuperación",
        text: "Estudiado por su vínculo con la recuperación de estructuras musculares.",
      },
      {
        icon: "Bone",
        title: "Soporte estructural",
        text: "Explorado por su relación con tejidos como tendones y ligamentos.",
      },
      {
        icon: "Zap",
        title: "Entorno regenerativo",
        text: "Analizado por su asociación con procesos biológicos de recuperación celular.",
      },
    ],
    specs: [
      { label: "Contenido", value: "TB-500 10mg + BPC-157 10mg + GHK-Cu 50mg" },
      { label: "Pureza", value: "≥99.2%" },
      { label: "Formato", value: "Reconstituido (líquido)" },
      { label: "Presentación", value: "Vial multi-dosis" },
      { label: "Peso molecular", value: "Mezcla tri-péptido" },
      { label: "CoA", value: "Incluido en cada lote" },
    ],
    storage:
      "Refrigerar entre 2-8°C. Proteger de la luz directa y evitar congelación. Usar dentro de los 30 días posteriores a la apertura.",
    faqs: [
      {
        q: "¿Realizan envíos a todo Bolivia?",
        a: "Sí, enviamos a todas las ciudades del país por mensajería confiable con embalaje térmico.",
      },
      {
        q: "¿Cuánto tarda el envío?",
        a: "Generalmente 24-48h dentro de las principales ciudades, una vez confirmado el pedido.",
      },
      {
        q: "¿Existe precio para clínicas o profesionales?",
        a: "Sí, contáctanos por WhatsApp para condiciones B2B con precios mayoristas y asesor dedicado.",
      },
      {
        q: "¿Incluye certificado de análisis?",
        a: "Sí, cada lote viene con su CoA documentando pureza, identidad y condiciones de almacenamiento.",
      },
      {
        q: "¿Cómo se almacena este producto?",
        a: "Refrigerar entre 2-8°C. Proteger de la luz directa. Usar dentro de 30 días después de abrir.",
      },
    ],
  },

  {
    slug: "glp-3-rt",
    name: "GLP-3 RT",
    short_name: "GLP-3",
    composition: "40mg",
    dose_label: "40mg",
    category: "Compuesto metabólico",
    accent_color: "#c03689",
    description:
      "Péptido de triple acción metabólica. Reconstituido, estable a temperatura ambiente.",
    long_description:
      "Compuesto metabólico de nueva generación enfocado en regulación energética y balance metabólico. Formulación reconstituida con estabilidad a temperatura ambiente, facilitando el almacenamiento y transporte. Pureza verificada por laboratorio independiente.",
    price_bs: 1800,
    purity: "99.4%",
    in_stock: true,
    is_offer: false,
    image: "/products/glp-3-rt.png",
    sort_order: 2,
    highlights: [
      "40mg por vial — una de las dosis más altas del mercado",
      "Estable a temperatura ambiente (RT) — no requiere congelación antes de abrir",
      "Triple acción sobre receptores metabólicos",
      "Ideal para protocolos de larga duración",
    ],
    benefits: [
      {
        icon: "Activity",
        title: "Regulación metabólica",
        text: "Investigado en contextos de regulación metabólica y señalización de receptores GLP.",
      },
      {
        icon: "TrendingDown",
        title: "Balance energético",
        text: "Asociado a estudios sobre composición corporal y balance energético celular.",
      },
      {
        icon: "Beaker",
        title: "Estabilidad RT",
        text: "Formulación estable a temperatura ambiente, facilitando almacenamiento y transporte sin cadena de frío.",
      },
      {
        icon: "ShieldCheck",
        title: "Alta concentración",
        text: "40mg por vial con pureza del 99.4%, optimizado para protocolos extendidos.",
      },
    ],
    specs: [
      { label: "Contenido", value: "40mg" },
      { label: "Pureza", value: "≥99.4%" },
      { label: "Formato", value: "Reconstituido (líquido)" },
      { label: "Presentación", value: "Vial multi-dosis" },
      { label: "Estabilidad", value: "Temperatura ambiente (RT)" },
      { label: "CoA", value: "Incluido en cada lote" },
    ],
    storage:
      "Estable a temperatura ambiente antes de abrir. Una vez abierto, refrigerar entre 2-8°C y usar en un máximo de 30 días.",
    faqs: [
      {
        q: "¿Realizan envíos a todo Bolivia?",
        a: "Sí, enviamos a todas las ciudades del país por mensajería confiable.",
      },
      {
        q: "¿Cuánto tarda el envío?",
        a: "Generalmente 24-48h dentro de las principales ciudades.",
      },
      {
        q: "¿Existe precio para clínicas o profesionales?",
        a: "Sí, contáctanos por WhatsApp para condiciones B2B con precios mayoristas.",
      },
      {
        q: "¿Qué significa 'RT' en el nombre?",
        a: "RT significa Room Temperature. Este péptido es estable a temperatura ambiente antes de abrir, lo que facilita su almacenamiento y transporte.",
      },
      {
        q: "¿Por qué 40mg es relevante?",
        a: "40mg es una de las concentraciones más altas disponibles, lo que permite protocolos más extensos con un solo vial.",
      },
    ],
  },

  {
    slug: "ghk-cu",
    name: "GHK-CU",
    short_name: "GHK-Cu",
    composition: "50mg",
    dose_label: "50mg",
    category: "Compuesto dérmico",
    accent_color: "#cb6120",
    description:
      "Tripéptido cobre reconstituido con identidad confirmada por espectrometría de masas.",
    long_description:
      "GHK-Cu (glicil-L-histidil-L-lisina cobre) es un tripéptido naturalmente presente en plasma humano, investigado extensamente por su rol en la síntesis de matriz extracelular. Cada vial contiene 50mg de péptido reconstituido con pureza superior al 99%.",
    price_bs: 700,
    purity: "99.6%",
    in_stock: true,
    is_offer: false,
    image: "/products/ghk-cu.png",
    sort_order: 3,
    highlights: [
      "Tripéptido naturalmente presente en plasma humano — amplia base científica",
      "50mg por vial — concentración generosa para múltiples experimentos",
      "Pureza del 99.6% — una de las más altas de nuestro catálogo",
      "Investigado en más de 100 estudios publicados sobre síntesis de colágeno",
    ],
    benefits: [
      {
        icon: "Sparkles",
        title: "Investigación dérmica",
        text: "Extensamente estudiado en contextos de regeneración cutánea y remodelación de la piel.",
      },
      {
        icon: "Layers",
        title: "Matriz extracelular",
        text: "Asociado a la estimulación de síntesis de colágeno, elastina y glicosaminoglicanos.",
      },
      {
        icon: "Atom",
        title: "Tripéptido cobre",
        text: "Complejo Gly-His-Lys con ion cobre (Cu²⁺). Presente de forma natural en el cuerpo humano.",
      },
      {
        icon: "ShieldCheck",
        title: "Máxima pureza",
        text: "99.6% de pureza verificada. Identidad molecular confirmada por espectrometría de masas.",
      },
    ],
    specs: [
      { label: "Contenido", value: "50mg" },
      { label: "Pureza", value: "≥99.6%" },
      { label: "Formato", value: "Reconstituido (líquido)" },
      { label: "Presentación", value: "Vial multi-dosis" },
      { label: "Secuencia", value: "Gly-His-Lys · Cu²⁺" },
      { label: "CoA", value: "Incluido en cada lote" },
    ],
    storage:
      "Refrigerar entre 2-8°C. Proteger de la luz directa y evitar congelación. Usar dentro de los 30 días posteriores a la apertura.",
    faqs: [
      {
        q: "¿Realizan envíos a todo Bolivia?",
        a: "Sí, enviamos a todas las ciudades del país por mensajería confiable.",
      },
      {
        q: "¿Cuánto tarda el envío?",
        a: "Generalmente 24-48h dentro de las principales ciudades.",
      },
      {
        q: "¿Existe precio para clínicas o profesionales?",
        a: "Sí, contáctanos por WhatsApp para condiciones B2B con precios mayoristas.",
      },
      {
        q: "¿Qué es GHK-Cu exactamente?",
        a: "Es un tripéptido (tres aminoácidos: glicina, histidina, lisina) unido a un ion de cobre. Se encuentra naturalmente en el plasma humano y ha sido objeto de más de 100 publicaciones científicas.",
      },
      {
        q: "¿Por qué la pureza del 99.6% es importante?",
        a: "Una pureza alta garantiza resultados reproducibles y libres de impurezas de síntesis.",
      },
    ],
  },

  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 (no DAC) + IPAMORELIN",
    short_name: "CJC + Ipa",
    composition: "5mg / 5mg",
    dose_label: "5mg/5mg",
    category: "Secretagogo",
    accent_color: "#e6b54a",
    description:
      "Combinación de CJC-1295 sin DAC e Ipamorelin en proporción 1:1, reconstituida en un solo vial.",
    long_description:
      "Formulación dual que combina CJC-1295 (análogo de GHRH sin modificación DAC) con Ipamorelin (pentapéptido secretagogo selectivo) en un solo vial reconstituido. Diseñada para estudios de pulsatilidad de hormona de crecimiento. Cada componente a 5mg con pureza individual verificada.",
    price_bs: 1200,
    purity: "99.3%",
    in_stock: true,
    is_offer: false,
    image: "/products/cjc-1295-ipamorelin.png",
    sort_order: 4,
    highlights: [
      "Combinación sinérgica 1:1 en un solo vial — simplifica protocolos",
      "CJC-1295 sin DAC: vida media corta, ideal para estudios de pulsatilidad",
      "Ipamorelin: pentapéptido altamente selectivo sobre el receptor de ghrelina",
      "Ampliamente referenciado en literatura sobre secretagogos de GH",
    ],
    benefits: [
      {
        icon: "Activity",
        title: "Análogo GHRH",
        text: "CJC-1295 (sin DAC) estudiado como análogo de hormona liberadora de GH con vida media controlada.",
      },
      {
        icon: "Target",
        title: "Selectividad",
        text: "Ipamorelin investigado por su alta selectividad sobre el receptor de ghrelina (GHS-R1a) sin afectar otros ejes hormonales.",
      },
      {
        icon: "Combine",
        title: "Sinergia 1:1",
        text: "Combinación reconstituida en un solo vial. Elimina la necesidad de mezclar compuestos individualmente.",
      },
      {
        icon: "ShieldCheck",
        title: "Doble verificación",
        text: "Pureza individual del 99.3% verificada para cada componente del vial.",
      },
    ],
    specs: [
      { label: "Contenido", value: "CJC-1295 5mg + Ipamorelin 5mg" },
      { label: "Pureza", value: "≥99.3% (cada componente)" },
      { label: "Formato", value: "Reconstituido (líquido)" },
      { label: "Presentación", value: "Vial multi-dosis" },
      { label: "Proporción", value: "1:1" },
      { label: "CoA", value: "Incluido en cada lote" },
    ],
    storage:
      "Refrigerar entre 2-8°C. Proteger de la luz directa y evitar congelación. Usar dentro de los 30 días posteriores a la apertura.",
    faqs: [
      {
        q: "¿Realizan envíos a todo Bolivia?",
        a: "Sí, enviamos a todas las ciudades del país por mensajería confiable.",
      },
      {
        q: "¿Cuánto tarda el envío?",
        a: "Generalmente 24-48h dentro de las principales ciudades.",
      },
      {
        q: "¿Existe precio para clínicas o profesionales?",
        a: "Sí, contáctanos por WhatsApp para condiciones B2B con precios mayoristas.",
      },
      {
        q: "¿Qué significa 'sin DAC'?",
        a: "DAC (Drug Affinity Complex) extiende la vida media del CJC-1295. La versión sin DAC tiene una vida media más corta, lo que permite estudiar la pulsatilidad natural de GH con mayor precisión.",
      },
      {
        q: "¿Por qué combinar CJC-1295 con Ipamorelin?",
        a: "La combinación de un análogo de GHRH (CJC-1295) con un secretagogo de ghrelina (Ipamorelin) se estudia por su potencial efecto sinérgico en la liberación de GH.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Upsert
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Seeding ${products.length} products into Supabase...`);

  const { data, error } = await supabase
    .from("products")
    .upsert(products, { onConflict: "slug" })
    .select("slug, name");

  if (error) {
    console.error("Upsert failed:", error.message);
    process.exit(1);
  }

  console.log("Upserted products:");
  for (const row of data ?? []) {
    console.log(`  - ${row.slug} (${row.name})`);
  }

  console.log("Done.");
}

main();
