import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/book"],
    },
    sitemap: "https://royal-rollers.com/sitemap.xml",
  };
}
