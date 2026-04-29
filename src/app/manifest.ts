import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apex Peptide Lab",
    short_name: "Apex Lab",
    description: "Péptidos de investigación en Bolivia",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1628",
    theme_color: "#b8ca60",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
