import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vivici",
    short_name: "Vivici",
    description:
      "Imobiliária digital da Vivici com catálogo de imóveis, campanhas promocionais e atendimento personalizado.",
    start_url: "/",
    display: "standalone",
    background_color: "#071525",
    theme_color: "#071525",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
