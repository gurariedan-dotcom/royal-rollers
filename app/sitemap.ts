import type { MetadataRoute } from "next";

const BASE_URL = "https://www.royalrollers.example";

const ROUTES = ["", "/services", "/how-it-works", "/faq", "/about", "/contact", "/reviews", "/quote"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
