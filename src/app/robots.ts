import type { MetadataRoute } from "next";

// Placeholder domain — see src/app/sitemap.ts for context. Swap both for
// the real production domain once one is configured.
const BASE_URL = "https://quantumlearn.example";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
