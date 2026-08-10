import type { MetadataRoute } from "next";

const BASE_URL = "https://royal-rollers.com";

const ROUTES = ["", "/services", "/how-it-works", "/faq", "/contact", "/reviews", "/quote", "/privacy", "/terms", "/accessibility"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
