import type { MetadataRoute } from "next";

import { toAbsoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/imoveis", "/promocoes"],
        disallow: ["/admin", "/login"],
      },
    ],
    sitemap: toAbsoluteUrl("/sitemap.xml"),
    host: toAbsoluteUrl("/"),
  };
}
